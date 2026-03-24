# HimFit

12-week half marathon + strength training program. Mobile-first PWA-ready web app.

Repository: [https://github.com/WinstonAC/HimFit](https://github.com/WinstonAC/HimFit)

---

## Run locally (any branch)

1. **Check out the branch you want to test** (default training app is `main`; profile/intake work is on `feature/intake-plan-strava-gate` until merged):

   ```bash
   git fetch origin
   git checkout feature/intake-plan-strava-gate   # or: main
   ```

2. **Serve the folder** so the app behaves like it will on the web (recommended):

   ```bash
   cd /path/to/HimFit
   python3 -m http.server 8080
   # or: npx serve .
   ```

3. **Open in a browser** (new window / incognito if you want a clean first-run intake test):

   - [http://localhost:8080](http://localhost:8080)  
   - **Tip:** A private/incognito window has **empty** `localStorage`, so you see the full first-time intake flow. Your normal window keeps existing saved data.

---

## Deploy (GitHub Pages)

Live site (from `main`): **https://winstonac.github.io/HimFit/**

Pages builds from the **`main`** branch only (typical setup). To preview branch changes on the real URL, merge via PR when ready, or use **local server** above for branch testing.

---

## Features

| Tab | What it does |
|-----|----------------|
| **Overview** | Program phases, weekly split, protocols, **Settings** (Strava embed toggle, edit profile) |
| **Today** | Day-by-day workout, exercises, reps, video links |
| **Plan** | 12-week grid, session dots |
| **Runs** | Optional Strava embed (when enabled) + **manual run log** + run history |
| **Fuel** | Meals by session type, ingredient → shopping list |
| **Shop** | Shopping list from Fuel |

---

## Profile & intake (on supported builds)

- On **first visit** (no saved profile), a **profile overlay** asks for sex, age, weight, height, goal, experience, days/week, gym vs home, injuries, and **running comfort**.
- **Fertility-related goal** appears only if **sex is female**.
- Everything is stored **on this device only** (`localStorage`). Nothing is sent to a server for profile/intake.
- **Continue with defaults** skips detailed answers and uses a neutral template + full running progression.
- **Edit profile** from Overview (profile strip or Settings) reopens the form; **Cancel** closes without saving changes you haven’t submitted.

### Running progression

Tuesday quality sessions and Saturday long runs **scale** from **Running comfort** (e.g. walk/jog first → full half-marathon-style block). Same lift days; more plan variants can be added later.

### Plan key

`planKey` is saved for future use (`default`, `fertility_v1`, etc.). Lifting content still matches the main HimFit template until more libraries are added.

---

## Strava

- The **Strava iframe is off by default** so other people don’t see the developer’s account.
- Turn it on: **Overview → Settings → Strava embed** (saved on this device).
- **Manual run history** and the Strava widget are **separate**: logging a run in HimFit does **not** sync to Strava or vice versa unless you add **Strava OAuth + API** later.

### Roadmap (not implemented yet)

- Per-user Strava via **OAuth** (e.g. Vercel serverless + tokens).
- Merge or cross-reference Strava activities with HimFit run history (requires API).

---

## Data on your phone (`localStorage`)

- **Key:** `hf4` (single JSON blob).
- **Includes (among other fields):** week, day, completed sessions, run log, shopping list, profile/intake, `stravaConnected`, `planKey`.

### Updating from an older install

When you load a **newer** build without clearing site data:

- **Runs, shop list, week progress, completed dots** stay merged into the new app state.
- If your old save had **no** `intakeComplete` field but you already had **runs or completed sessions**, the app treats you as **already onboarded** so you aren’t forced through intake again.
- **`stravaConnected` defaults to `false`** on upgrade if it was missing → open **Overview → Settings** and turn **Strava embed** on again if you want the iframe.
- If you **do** go through intake again, new profile fields are added alongside existing progress data.

**Same URL, same browser profile = same data.** A different browser, private window, or “Clear website data” for the site starts fresh.

---

## PWA / home screen

- `manifest.json` + icons support **Add to Home Screen**.
- Theme / `apple-touch-icon` use `icon-512.png`.

---

## Branches

| Branch | Purpose |
|--------|---------|
| `main` | Production-style app; what GitHub Pages usually serves |
| `feature/intake-plan-strava-gate` | Profile intake, run scaling, Strava gated behind Settings (merge when ready) |

---

## Related

- **HerFit** (Melody’s program) is a **separate repo**; changes here only affect HimFit.
