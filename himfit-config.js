// Sign-in screen: only appears on the live site when BOTH values below are filled and this file is deployed.
// (Empty keys = full app opens without cloud sign-in.) Guide: docs/SUPABASE_FULL_SETUP.md
window.HIMFIT_SUPABASE_URL = 'https://jqomeiarmdrraausoecd.supabase.co';
window.HIMFIT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impxb21laWFybWRycmFhdXNvZWNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNzE4MTYsImV4cCI6MjA4OTk0NzgxNn0.pkp2QIBg2EGTfU4KMvux7JlZp5Xgh9BoGUa7j7grVjY';

// Strava embed (Runs) — only for YOUR login (not a “code for the AI”):
// 1) Sign into HimFit once (magic link). 2) Supabase → Authentication → Users → your row → copy User UID.
// 3) Paste UUID below, save, push to GitHub Pages. 4) Open app signed in → Overview → Settings → Strava on.
// Leave empty = no Strava row for anyone (manual run log still works for everyone).
window.HIMFIT_STRAVA_OWNER_USER_ID = '';
