// Winston Fit — Supabase Edge Function: send-daily-push
// Triggered by pg_cron (or Supabase scheduled functions) every hour.
// Sends push notifications to users whose notif_time matches the current UTC hour
// after converting from their stored timezone.
//
// Deploy:  supabase functions deploy send-daily-push
// Secrets: supabase secrets set VAPID_PUBLIC=<key> VAPID_PRIVATE=<key> VAPID_SUBJECT=mailto:you@example.com

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const VAPID_PUBLIC  = Deno.env.get('VAPID_PUBLIC')!;
const VAPID_PRIVATE = Deno.env.get('VAPID_PRIVATE')!;
const VAPID_SUBJECT = Deno.env.get('VAPID_SUBJECT') ?? 'mailto:admin@winstonfit.com';

// ── VAPID JWT helpers (no external lib needed) ────────────────────────────────

function base64urlToUint8(b64: string): Uint8Array {
  const pad = b64.length % 4 === 0 ? '' : '='.repeat(4 - (b64.length % 4));
  return Uint8Array.from(atob(b64.replace(/-/g, '+').replace(/_/g, '/') + pad), c => c.charCodeAt(0));
}

function uint8ToBase64url(arr: Uint8Array): string {
  return btoa(String.fromCharCode(...arr)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

async function makeVapidJwt(audience: string): Promise<string> {
  const header  = uint8ToBase64url(new TextEncoder().encode(JSON.stringify({ typ: 'JWT', alg: 'ES256' })));
  const payload = uint8ToBase64url(new TextEncoder().encode(JSON.stringify({
    aud: audience,
    exp: Math.floor(Date.now() / 1000) + 12 * 3600,
    sub: VAPID_SUBJECT,
  })));
  const signing = new TextEncoder().encode(`${header}.${payload}`);

  const keyData = base64urlToUint8(VAPID_PRIVATE);
  const cryptoKey = await crypto.subtle.importKey(
    'raw', keyData,
    { name: 'ECDSA', namedCurve: 'P-256' },
    false, ['sign']
  );
  const sig = new Uint8Array(await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, cryptoKey, signing));
  return `${header}.${payload}.${uint8ToBase64url(sig)}`;
}

// ── Send one push message ─────────────────────────────────────────────────────

async function sendPush(sub: { endpoint: string; p256dh: string; auth: string }, payload: string): Promise<boolean> {
  const url    = new URL(sub.endpoint);
  const origin = `${url.protocol}//${url.host}`;
  const jwt    = await makeVapidJwt(origin);

  // Encrypt payload using Web Push encryption (RFC 8291)
  // We'll use the raw Web Push protocol with AESGCM content-encoding
  const encoder = new TextEncoder();

  // Import receiver public key
  const receiverPubKey = await crypto.subtle.importKey(
    'raw', base64urlToUint8(sub.p256dh),
    { name: 'ECDH', namedCurve: 'P-256' }, true, []
  );

  // Generate sender ephemeral key pair
  const senderKeys = await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits']);
  const senderPubRaw = new Uint8Array(await crypto.subtle.exportKey('raw', senderKeys.publicKey));

  // Derive shared secret
  const sharedBits = new Uint8Array(await crypto.subtle.deriveBits(
    { name: 'ECDH', public: receiverPubKey }, senderKeys.privateKey, 256
  ));

  // Salt (16 random bytes)
  const salt = crypto.getRandomValues(new Uint8Array(16));

  // Auth secret
  const authSecret = base64urlToUint8(sub.auth);

  // HKDF for content encryption key and nonce (RFC 8291 aes128gcm)
  const ikm = await crypto.subtle.importKey('raw', sharedBits, 'HKDF', false, ['deriveKey', 'deriveBits']);

  // PRK auth
  const prkAuthInfo = encoder.encode('WebPush: info\x00');
  const prkAuthInput = new Uint8Array([...base64urlToUint8(sub.p256dh), ...senderPubRaw]);
  const prkAuthMaterial = new Uint8Array([...prkAuthInfo, ...prkAuthInput, 0x01]);

  const authKey = await crypto.subtle.importKey('raw', authSecret, 'HKDF', false, ['deriveBits']);
  const prk = await crypto.subtle.deriveBits(
    { name: 'HKDF', hash: 'SHA-256', salt: sharedBits, info: prkAuthMaterial }, authKey, 256
  );

  // CEK
  const cekInfo = new Uint8Array([...encoder.encode('Content-Encoding: aes128gcm\x00'), 0x01]);
  const cekBits = await crypto.subtle.deriveBits(
    { name: 'HKDF', hash: 'SHA-256', salt, info: cekInfo },
    await crypto.subtle.importKey('raw', prk, 'HKDF', false, ['deriveBits']),
    128
  );

  // Nonce
  const nonceInfo = new Uint8Array([...encoder.encode('Content-Encoding: nonce\x00'), 0x01]);
  const nonceBits = await crypto.subtle.deriveBits(
    { name: 'HKDF', hash: 'SHA-256', salt, info: nonceInfo },
    await crypto.subtle.importKey('raw', prk, 'HKDF', false, ['deriveBits']),
    96
  );

  // Encrypt
  const cek = await crypto.subtle.importKey('raw', cekBits, 'AES-GCM', false, ['encrypt']);
  const plaintext = new Uint8Array([...encoder.encode(payload), 0x02]); // padding delimiter
  const ciphertext = new Uint8Array(await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: nonceBits, tagLength: 128 }, cek, plaintext
  ));

  // Build aes128gcm content (RFC 8188 header + ciphertext)
  const rs = 4096;
  const header = new Uint8Array(21 + senderPubRaw.length);
  header.set(salt, 0);
  new DataView(header.buffer).setUint32(16, rs, false);
  header[20] = senderPubRaw.length;
  header.set(senderPubRaw, 21);
  const body = new Uint8Array([...header, ...ciphertext]);

  const res = await fetch(sub.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Encoding': 'aes128gcm',
      'TTL': '86400',
      'Authorization': `vapid t=${jwt},k=${VAPID_PUBLIC}`,
    },
    body,
  });

  return res.ok || res.status === 201;
}

// ── Main handler ──────────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  // Allow cron trigger (GET) or manual trigger (POST with optional auth header)
  if (req.method !== 'GET' && req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!  // bypasses RLS to read all subscriptions
  );

  // Current UTC hour:minute
  const now = new Date();
  const utcHour = now.getUTCHours();
  const utcMin  = now.getUTCMinutes();

  // Fetch all subscriptions
  const { data: subs, error } = await supabase
    .from('winstonfit_push_subscriptions')
    .select('*');

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  if (!subs || subs.length === 0) return new Response(JSON.stringify({ sent: 0 }), { status: 200 });

  const results = await Promise.allSettled(
    subs
      .filter(sub => {
        // Convert user's local notif_time to UTC using their stored timezone
        try {
          const [hh, mm] = sub.notif_time.split(':').map(Number);
          // Build a date representing "today at notif_time in user_tz"
          const userDate = new Date(new Date().toLocaleDateString('en-CA', { timeZone: sub.user_tz }) + `T${sub.notif_time}`);
          const targetUtcHour = userDate.getUTCHours();
          const targetUtcMin  = userDate.getUTCMinutes();
          // Fire within the same UTC hour window (cron runs every hour)
          return targetUtcHour === utcHour && Math.abs(targetUtcMin - utcMin) < 30;
        } catch { return false; }
      })
      .map(sub =>
        sendPush(
          { endpoint: sub.endpoint, p256dh: sub.p256dh, auth: sub.auth },
          JSON.stringify({
            title: 'Winston Fit',
            body: "Your workout is ready. Let's get it. 💪",
            url: '/',
          })
        ).catch(() => false)
      )
  );

  const sent = results.filter(r => r.status === 'fulfilled' && r.value).length;
  return new Response(JSON.stringify({ sent, total: subs.length }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
});
