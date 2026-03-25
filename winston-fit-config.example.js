// Copy to winston-fit-config.js and fill in. Step-by-step: docs/SUPABASE_FULL_SETUP.md
// Never put the service_role key in the frontend — only the anon (public) key.

window.WINSTONFIT_SUPABASE_URL = '';
window.WINSTONFIT_SUPABASE_ANON_KEY = '';

// Live app URL for magic-link redirects (same as Site URL / allowlisted redirect in Supabase). Stops localhost links in email.
window.WINSTONFIT_AUTH_REDIRECT_URL = 'https://winstonac.github.io/HimFit/';

// Optional: your Supabase user UUID so only you can enable the Strava embed (Overview → Settings).
window.WINSTONFIT_STRAVA_OWNER_USER_ID = '';
