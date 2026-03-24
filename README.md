# HimFit

**12-week** half-marathon build **plus** strength training. Mobile-first, **PWA-ready**, static web app (single `index.html` + assets).

**Live site (GitHub Pages):** [https://winstonac.github.io/HimFit/](https://winstonac.github.io/HimFit/)

**Repository:** [https://github.com/WinstonAC/HimFit](https://github.com/WinstonAC/HimFit)

---

## What you get (user-facing)

| Area | Details |
|------|---------|
| **Overview** | **Sign in** (hero + Settings — luxe copy), phases, split, protocols, **Settings** (Strava, profile, magic link when Supabase is configured) |
| **Today** | Full day: lifts, runs, KB, sauna notes; **reps, rest text, Zone 2 duration, and run tips** adjust from your **goals** |
| **Plan** | 12-week grid; banner when **goals** are active (not only “general”) |
| **Runs** | Optional Strava embed + **manual run log** + history |
| **Fuel** | **Personalised macros** (Mifflin-St Jeor BMR × 1.6, goal-adjusted: +250 surplus / −400 deficit / +150 run fuel / maintenance). Meals by **eating style** (omnivore / pescatarian / vegetarian / vegan), **week rotation** across **3 meal sets**, optional **salad-forward** tips + shopping list |
| **Shop** | List built from Fuel ingredients |

### Profile & intake

- First visit opens a **profile** form (skip with **Continue with defaults**).
- **Units:** **kg/cm** or **lb / ft·in** (stored internally as kg + cm; display follows your choice).
- **Goals:** up to **three** checkboxes (e.g. lose fat + endurance). Drives workout bias (reps, rests, Thursday easy run length, run notes). **Fertility** option appears only if **sex is female**.
- **Eating style** + **meal preference** (balanced vs salad-forward) affect Fuel.
- **Running comfort** scales Tuesday quality runs and Saturday long run blocks.
- **Edit profile:** **Overview → Settings → Profile → Edit** (profile strip at top is read-only).

### Data: device vs cloud

- **Default:** everything lives in the browser **`localStorage`** key `hf4` (this device only). Different phones = different people; nothing is mixed automatically.
- **Optional cloud:** with **Supabase** + keys in `himfit-config.js`, use **Sign in** on the hero or under **Settings**. Full order-of-operations + **branded HimFit email HTML**: **[`docs/SUPABASE_FULL_SETUP.md`](docs/SUPABASE_FULL_SETUP.md)**. The magic link returns to the **same app URL**; profile/intake still runs on the device. Without keys, **Sign in** stays visible with a short explanation.

---

## Run locally

```bash
cd /path/to/HimFit
python3 -m http.server 8081
```

Open **http://localhost:8081** (use another port if busy).

Use a **private/incognito** window for a clean first-run intake test; a normal window keeps existing saved data.

---

## Deploy: GitHub Pages (current)

Pages serves **static files** from this repo—**no Vercel required** for the app to work or for optional Supabase login (the browser talks to Supabase directly).

1. Repo → **Settings → Pages** → source: **`main`**, folder **`/` (root)**.
2. Site URL: **https://winstonac.github.io/HimFit/**

Merge to **`main`** when you want the live site updated.

### Vercel / Netlify (optional)

Any **static host** works the same way: connect the repo, no build step, publish the root. Use Vercel **only if you want** their dashboard, previews, or **serverless functions** (e.g. Strava OAuth with a **secret**—not solvable with Pages alone). **Moving to Vercel does not by itself add multi-user accounts**; accounts need **auth + database** (e.g. Supabase), documented separately.

---

## Optional cloud sign-in (maintainers)

Follow **[`docs/SUPABASE_FULL_SETUP.md`](docs/SUPABASE_FULL_SETUP.md)** (SQL, Auth URLs, **custom email templates**, optional SMTP, `himfit-config.js`, test). Shorthand pointer: [`docs/SUPABASE_NEXT_STEPS.md`](docs/SUPABASE_NEXT_STEPS.md).

If keys are empty, the app is **offline-first** only, but **Sign in** still appears with a calm explanation.

---

## Strava

- The **iframe** is **off by default** so visitors don’t see a fixed athlete embed.
- **Overview → Settings → Strava embed** toggles it (saved locally).
- **Manual run log** ≠ Strava API. Per-user Strava needs **OAuth + backend** (e.g. Vercel function)—see roadmap in `docs/ACCOUNTS_AND_SYNC.md`.

---

## PWA

- `manifest.json` + **`icon-512.png`** (burgundy + gold shoe / weight motif) support **Add to Home Screen**. After changing the icon, clear site data or re-add to home screen to refresh the cached icon.

---

## Developer notes

| Topic | Location |
|-------|----------|
| **Accounts, sync, roadmap (Strava, analytics)** | [`docs/ACCOUNTS_AND_SYNC.md`](docs/ACCOUNTS_AND_SYNC.md) |
| **Supabase + branded email — full checklist** | [`docs/SUPABASE_FULL_SETUP.md`](docs/SUPABASE_FULL_SETUP.md) |
| **Supabase config template** | `himfit-config.example.js` → `himfit-config.js` |

### Macro calculation

`calcMacros()` in `index.html` uses **Mifflin-St Jeor BMR × 1.6** (5-day active factor) from the saved profile (`weightKg`, `heightCm`, `age`, `sex`). Calorie targets adjust per primary goal:

| Primary goal | Adjustment | Protein |
|---|---|---|
| `build_muscle` | TDEE + 250 | 2.0 g/kg |
| `lose_fat` | TDEE − 400 | 2.2 g/kg |
| `endurance` | TDEE + 150 | 2.0 g/kg |
| `stay_lean` / `general` | TDEE ± 0 | 2.0 g/kg |

Fat = 27 % of total kcal. Carbs = remainder. Falls back to 68 kg / 45 yo defaults if no profile.

### `localStorage` (`hf4`)

Rough shape: `week`, `day`, `done`, `runs`, `shopList`, `stravaConnected`, `intakeComplete`, `planKey`, `intake` (includes `goals`, `diet`, `unitPref`, `mealStyle`, …).

### Upgrades from older saves

- Missing **`intakeComplete`** but existing runs/completions → treated as onboarded.
- Missing **`stravaConnected`** → defaults to `false`.
- Legacy single **`goal`** → migrated to **`goals`** array on load.

---

## Related

- **HerFit** (Melody’s program) is a **separate repo**; this repo is **HimFit** only.
