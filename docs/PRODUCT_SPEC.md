# HimFit — Product Spec & MVP Definition

_Last updated: May 2026_

---

## The Product Vision

**One AI coach that runs your entire fitness life** — workouts, food, recovery, race training — across every device and wearable you already own. No wearable required to start, but richer when you add one.

The gap in the market: every top app is siloed. WHOOP knows your biometrics but not your meals. MyFitnessPal knows your macros but not your training. Strava knows your runs but not your strength. HimFit is the unified layer.

---

## MVP Definition — "The Core Loop Must Be Flawless"

Before adding any new feature, these 5 steps must work end-to-end in under 3 minutes, voice-first, on mobile:

```
1. Open Today → see my workout for the day
2. Say "make it 30 minutes, I'm short on time" → AI trims it → Apply
3. Do the workout → mark complete
4. Open Fuel → AI generates meals matching today's session + my macros
5. Missing ingredients → auto-added to shopping list
```

**MVP is complete when this loop works without friction.** Everything else is growth.

---

## What's Shipped ✅

| Feature | Status |
|---------|--------|
| 12-week progressive strength + run program | ✅ Live |
| AI Coach in Today tab (collapsible, voice) | ✅ Live |
| Workout modification + Apply to Today | ✅ Live |
| AI Fuel — generate full day meal plan | ✅ Live |
| Voice input (Coach + Fuel) | ✅ Live |
| Viewport locked — native app feel | ✅ Live |
| Coach reads time pill (20/30/45/60 min) | ✅ Live |
| Supabase auth, profile sync, push notifications | ✅ Live |
| Manual run log | ✅ Live |
| Shopping list from meal ingredients | ✅ Live |
| Weight-scaled exercises (bodyweight + sex) | ✅ Live |

---

## Backlog — Full Feature Set

---

### TIER 1 — Complete the Core Loop (build next)

#### 1A. Smart Fuel: Fridge + Recipe Drop + Auto-Cart
**Why:** The #1 unmet need in every top fitness app. Bridges workout → food → shopping.

**Fridge inventory**
- "In my fridge" section in Shop tab (two columns: Fridge | Shopping List)
- Persists in `S.fridge[]`, syncs via existing Supabase profile (no new table)

**Recipe drop via Fuel Chat**
- Open chat on Fuel tab (collapsible, same style as Today Coach)
- Paste Instagram/web URL or describe a dish ("David Chang ramen")
- AI uses web search → parses ingredients + macros → asks "today or tomorrow?"
- Confirm → meal saved; missing items auto-added to shopping list
- Protocol: MEAL_JSON embedded in reply (same pattern as WORKOUT_JSON)

**Smart ingredient diff**
- Every AI-generated meal plan cross-references `S.fridge[]`
- Items you HAVE → "✓ In fridge" label
- Items you NEED → auto-added to shopping list (no manual tapping)

#### 1B. Run Coaching with Race Goal
**Why:** User is training for 1:45 HM from 2:18. App doesn't factor this in at all.

- Profile intake: add goal race type, goal finish time, target race date
- Runs tab: Personal Bests section (user logs PRs, "Race" checkbox on run entries)
- Tuesday quality runs + Saturday long runs get specific pace targets based on goal
- Coach system prompt includes: current PR, goal pace, weeks to race date

---

### TIER 2 — Wearable Integration (major differentiator)

#### 2A. Apple Health + Wearable Data (via Terra API)
**Why:** Wearable data = 40% higher weekly engagement (per research). WHOOP has this behind a $30/month wall. We can offer it free via any wearable.

**Approach: Use Terra API (wearable aggregator)**
- Terra connects: Apple Watch, Garmin, Whoop, Fitbit, Polar, Oura Ring, Google Fit
- User connects once via OAuth → we receive: HRV, resting HR, sleep, workout sessions, steps, calories
- No native iOS app required — Terra has a web SDK

**What the Coach gets from wearables:**
- Last night's sleep quality + HRV → "Your HRV is low today. Here's a recovery session instead."
- Active calories burned → adjust today's calorie targets in Fuel
- Heart rate zones from yesterday's workout → inform today's intensity
- Workout detection (did you actually do the workout?)

**Implementation:**
- New "Connect Wearable" button in Overview → Settings
- Terra OAuth flow (pop-up) → stores Terra user ID in Supabase profile
- Daily webhook from Terra → Supabase Edge Function → stored in `wearable_snapshots` table
- Coach system prompt gets a `[WEARABLE DATA]` block with last 7 days of metrics

**New Supabase table:** `wearable_snapshots` `{user_id, date, hrv, sleep_hrs, sleep_score, resting_hr, active_kcal, steps, raw_json}`

**Phase 1 (MVP wearable):** Read-only data in Coach context  
**Phase 2:** Auto-adjust workout intensity based on HRV  
**Phase 3:** Native Apple Watch app (requires Xcode/Swift — separate build)

---

### TIER 3 — Program Generation & Personalization

#### 3A. AI Full 12-Week Program Generation
**Why:** Template programs are the status quo. True AI personalization is the gap nobody has solved well.

- "Generate my program" in Overview/Plan tab
- AI generates all 12 weeks: strength, runs, progressive overload
- Uses: experience, goals, days/week, gym vs. home, injuries, race target, wearable baseline
- Stored as `custom_workouts` rows (schema unchanged)
- "Reset to default program" wipes custom rows, restores hardcoded plan
- Phase 3: AI re-generates mid-program based on actual performance data

#### 3B. Recipe Saving / Cookbook
- "Save recipe" button on any AI-suggested meal
- New Supabase table: `saved_recipes` `{user_id, name, ingredients_json, macros_json, source_url}`
- Coach + Fuel AI include last 10 saved recipes in system prompt
- Future: browsable Cookbook view

---

### TIER 4 — Polish & Growth

#### 4A. Strava Per-User
- Add "Strava Athlete ID" to profile intake
- Replace hardcoded ID `39096162` with `S.intake.stravaId`
- Any user can see their own Strava activity

#### 4B. Exercise Video Overhaul
- Audit and fix all broken YouTube links (~50–100 exercise entries)
- Consider curated YouTube playlist or hosted demo GIFs

#### 4C. Hardcoded Content Cleanup
- Supplements + protocols not personalized to user goals
- Needs a review session to identify specific items

#### 4D. Social / Community (longer term)
- Competitors with social see 30% retention boost
- Minimal: share a workout summary card (image)
- Full: friends, challenges, group programs

---

## Competitive Landscape

### Top Apps (May 2025)
| App | Strength | Key Weakness |
|-----|----------|--------------|
| MyFitnessPal | Massive food DB, new AI meal plans | No workout programming |
| WHOOP | Best biometric coaching (GPT-4) | $30/mo hardware required |
| Fitbod | Best AI strength adaptation | No nutrition, no runs |
| Strava | Best run/ride tracking + community | No strength, no nutrition |
| Nike Training Club | Best free workout library | No personalization, no food |
| Freeletics | 60M users, AI program gen | Complicated UX, no nutrition |
| Future | Human + AI hybrid coaching | $150/month |

### Market Gaps We Fill
| Gap | How HimFit fills it |
|-----|---------------------|
| Unified workout + nutrition + shopping | Core loop (Tier 1) |
| Wearable coaching without hardware lock-in | Terra API aggregation (Tier 2) |
| Recipe drop from any URL/link | Fuel Chat with web search (Tier 1) |
| Voice-first interaction | Already live ✅ |
| Transparent AI reasoning | Coach explains every recommendation |
| Cross-modality periodization (strength + run) | Already live ✅ |
| Offline-first | Already live ✅ |
| Non-shaming UX (no streak guilt) | By design |

### Retention Research
- AI personalization → **50% retention boost**
- Wearable integration → **40% weekly engagement boost**  
- Social features → **30% retention lift**
- Paid AI tier → **75% annual retention** vs 20% free tier

### Biggest User Complaints Across All Apps
1. Shame-based notifications and streak mechanics
2. Unrealistic calorie/macro targets
3. Siloed data (no single source of truth)
4. Paywalled core features
5. Poor offline support

---

## Build Order Recommendation

```
NOW (stabilize the core loop):
  ✓ Fix Apply to Today reliably
  → Fuel Chat + Recipe Drop (1A)
  → Race goal coaching (1B)

NEXT SPRINT (wearable + program):
  → Terra API wearable integration (2A)
  → AI full program generation (3A)

GROWTH (once core is solid):
  → Recipe Cookbook (3B)
  → Strava per-user (4A)
  → Video overhaul (4B)
  → Social sharing (4D)
```

---

## Tech Stack

| Item | Detail |
|------|--------|
| Codebase | Single file: `index.html` (~3,500 lines, vanilla JS) |
| Hosting | GitHub Pages → `winstonac/himfit`, `main` branch |
| Auth + DB | Supabase `jqomeiarmdrraausoecd` |
| AI proxy | Supabase Edge Function `ai-proxy`, secret `himfit-wx-2026` |
| AI model | `claude-sonnet-4-20250514` |
| State | `S` object → localStorage `hf4` → synced to `himfit_profiles` |
| Wearable (planned) | Terra API — aggregates Apple Watch, Garmin, Whoop, Oura, Fitbit |

### Supabase Tables
| Table | Status | Purpose |
|-------|--------|---------|
| `himfit_profiles` | ✅ Live | Full state sync |
| `custom_workouts` | ✅ Live | AI workout overrides per day |
| `push_subscriptions` | ✅ Live | Workout reminders |
| `saved_recipes` | 🔲 Planned | Cookbook |
| `wearable_snapshots` | 🔲 Planned | Daily HRV, sleep, HR from Terra |
