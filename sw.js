// Winston Fit — Service Worker
// Handles background push notifications for daily workout reminders

const CACHE_NAME = 'winstonfit-v1';

// ── INSTALL & ACTIVATE ────────────────────────────────────────────────────────
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

// ── PUSH EVENT ────────────────────────────────────────────────────────────────
self.addEventListener('push', e => {
  let data = { title: 'Winston Fit', body: "Time to train. Your workout is ready. 💪", url: '/' };
  if (e.data) {
    try { data = { ...data, ...e.data.json() }; } catch (_) {}
  }

  const options = {
    body: data.body,
    icon: '/icon-512.png',
    badge: '/icon-512.png',
    tag: 'winstonfit-workout',       // replaces previous notification instead of stacking
    renotify: true,
    requireInteraction: false,
    data: { url: data.url || '/' },
    actions: [
      { action: 'open',   title: 'Let\'s go' },
      { action: 'snooze', title: 'Snooze 1h'  },
    ],
  };

  e.waitUntil(self.registration.showNotification(data.title, options));
});

// ── NOTIFICATION CLICK ────────────────────────────────────────────────────────
self.addEventListener('notificationclick', e => {
  e.notification.close();

  if (e.action === 'snooze') {
    // Re-show the notification after 1 hour
    e.waitUntil(
      new Promise(resolve => {
        setTimeout(() => {
          self.registration.showNotification('Winston Fit — Reminder', {
            body: "Still time to get your workout in today.",
            icon: '/icon-512.png',
            tag: 'winstonfit-snooze',
            data: { url: '/' },
          });
          resolve();
        }, 60 * 60 * 1000);
      })
    );
    return;
  }

  // Default: open/focus the app
  const targetUrl = (e.notification.data && e.notification.data.url) || '/';
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
      for (const client of clients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      return self.clients.openWindow(targetUrl);
    })
  );
});
