# HimFit — Product Spec

_Last updated: May 2026_

---

## Vision

**"Your AI personal trainer and nutritionist. $15/month."**

Future charges $199/month for a human coach. Centr charges $120/year for pre-recorded videos. Fitbod charges $96/year and ignores nutrition. MyFitnessPal handles food but not training. No one does both.

HimFit is the only app that puts a conversational AI coach across your entire day — workout, food, recovery, race training — and costs less than a protein shake per week.

**Philosophy: under-promise, over-deliver.** Don't market 50 features. Market one thing: the best AI coach you've ever had.

---

## The MVP Loop

This loop must work end-to-end in under 3 minutes, voice-first, on mobile. Nothing ships until this is flawless.

```
1. Open Today → see my workout
2. "Make it 30 min, I'm tight on time" → AI trims it → Apply
3. Train → mark complete
4. Open Fuel → AI generates meals matching today's session + my macros
5. Missing ingredients → auto-added to shopping list
```

---

## Aesthetic Goal — Voice-First Body Vision

### What it is

A user should be able to say — at any point, by voice or text — exactly what they want their body to look like. Not abstract fitness goals. Real, specific, honest language:

> "I'm getting a dad bod. I want my shit to be tight."
> "I want to look like I cut for 3 weeks."
> "I want to be lean but not skinny — athletic, shoulders look big in a shirt."
> "I want to lose the gut but keep the muscle."
> "Beach in 6 weeks. Make it happen."

The AI understands this language. No dropdown needed. No "select your goal: weight loss / muscle gain / endurance." That's what every other app does. This is a conversation.

### Where it lives

**Profile (captured once, updated anytime):**
- Aesthetic goal field: free text + voice input
- Displayed back as a card: _"Your goal: Look tight and athletic — lean with visible shoulders in 6 weeks"_
- Editable anytime. Change your goal → Coach and Fuel automatically re-orient

**Coach (every session):**
- Coach system prompt always includes the aesthetic goal verbatim
- If no goal is set, Coach proactively asks: _"Before we get into today's session — what do you want your body to look like? Give it to me straight."_
- User speaks it → Coach confirms interpretation → saved to profile

**Fuel (every meal plan):**
- Aesthetic goal drives caloric strategy: cut, lean bulk, maintenance, aggressive cut
- Goal timeframe ("3 weeks", "6 weeks", "beach in June") informs how aggressive the deficit/surplus should be
- Fuel AI calls it out explicitly: _"You're 4 weeks from your goal. Today's meals are set at a 400 cal deficit with high protein to protect muscle."_

### What the AI does with it

The aesthetic goal isn't just stored — it changes every recommendation:

| Goal | Workout impact | Nutrition impact |
|------|---------------|-----------------|
| "Tight and lean, 3 weeks" | More cardio, HIIT finishers, keep strength volume | Aggressive deficit, very high protein, lower carbs |
| "Dad bod → athletic" | Core work, functional strength, steady cardio base | Moderate deficit, balanced macros |
| "Lean bulk, shoulders + chest" | Heavy compound push + pull, less cardio | Slight surplus, protein-forward, timed carbs |
| "Beach body, 6 weeks" | Full body circuits, cardio uptick each week | Progressive deficit, drop water-weight foods last week |
| "Just be strong, don't care about looks" | Pure strength programming, no cardio tax | Maintenance or slight surplus |

### Profile intake fields added

```
aestheticGoal: string        // "I want to look tight and athletic"
goalTimeframe: string        // "6 weeks" / "before June" / "ongoing"
goalConfirmedAt: timestamp   // when AI last confirmed the goal interpretation
```

These get added to the existing profile object and synced via Supabase.

### UX flow

```
Profile setup → "What do you want your body to look like?" 
             → mic button prominent → user speaks freely
             → AI confirms: "Got it — lean and athletic with visible shoulders in 6 weeks. 
                             I'll run your workouts and meals toward that."
             → Saved → visible as a goal card on Overview tab

Any time later → tap goal card → "Update my goal" → voice again
```

### Why this is different

Every fitness app reduces this to a button: _Lose Weight / Build Muscle / Improve Fitness_. That's lazy. It doesn't capture what people actually want. A man who says "I'm getting a dad bod, I want my shit to be tight" has a completely different plan than a man who says "I want to look like I cut for 3 weeks." Both might select "Lose Weight" in a dropdown.

Capturing the real goal in real language — and letting the AI interpret it — is a differentiator no one has built.

---

## Architecture Direction

### Hardcoded Data Strategy

The current app has a hardcoded 12-week program (Winston's program) and a static 3-rotation meal plan. With the AI-first direction, this gets replaced in phases:

**Keep permanently:**
- Structural skeleton: weekly day types, DAYS array, 12-week phase framework, week/day navigation
- Protocol cards (sauna, creatine, run order) — good static content
- Offline fallback: if custom_workouts is empty and AI is unreachable, a minimal placeholder renders

**Replace with AI (phased):**
- Static meal rotation (3 sets × 4 diet types) → replaced by AI Fuel once Fuel Chat is solid
- Specific exercise arrays (MON_CH, WED_CH, THU_CH, etc.) → replaced by AI-generated `custom_workouts` on profile completion
- Weight scaling math → AI handles this in generated programs

**Correct sequence:**
```
Phase A: Build AI full program generation → stores all weeks in custom_workouts
Phase B: Hardcoded exercise arrays become dead code → remove
Phase C: Static meal rotation becomes loading state → remove
```
Do not remove hardcoded data before AI generation is live and stable. New users need something to see on day 1.

**New user first-run flow (target state):**
```
Complete profile → AI generates full 12-week program → stored in custom_workouts
                → AI generates this week's meal plan → shown in Fuel
                → Hardcoded data never shown
```

---

## What's Shipped ✅

| Feature | Notes |
|---------|-------|
| 12-week progressive strength + run program | Hardcoded — to be replaced by AI generation |
| AI Coach in Today tab (collapsible, voice) | Working |
| Workout modification + Apply to Today | Working — Supabase unique constraint fixed |
| AI Fuel — generate full day meal plan | Working |
| Voice input — Coach + Fuel | Working (mic resets correctly now) |
| Viewport locked — native app feel | Working |
| Coach reads time pill (20/30/45/60 min) | Working |
| Supabase auth, profile sync, push notifications | Working |
| Manual run log | Working |
| Shopping list from meal ingredients | Working |
| Weight-scaled exercises | Working — to be replaced by AI |

---

## Full Competitive Feature Matrix

| Feature | **HimFit** | WHOOP | Fitbod | Future | MyFitnessPal | Freeletics | Nike TC | Strava | Centr | Caliber | Apple Fitness+ |
|---------|--------|-------|--------|--------|--------------|------------|---------|--------|-------|---------|----------------|
| **PRICING** | | | | | | | | | | | |
| Free tier | ✅ Full app | ❌ | 3 workouts | ❌ | ✅ Basic | ✅ Basic | ✅ Full | ✅ Basic | ❌ | ✅ Full | ❌ |
| Monthly | $15 planned | $25–40 | $16 | $199 | $7 | $8–10 | Free | $12 | $30 | Free/$17 | $10 |
| Annual | $120 planned | $199–359 | $96 | $2,388 | $80 | $80 | Free | $80 | $120 | $72 | $80 |
| **AI & COACHING** | | | | | | | | | | | |
| Conversational AI coach | ✅ Full chat | Text Q&A | ❌ | Human | ❌ | Coach+ tier | ❌ | Text summaries | ❌ | ❌ | Voice (15 Pro+ only) |
| AI workout generation | ✅ Per day + 🔲 full program | ❌ | ✅ Strength only | Assists human | ❌ | ✅ HIIT only | ❌ | ❌ | ❌ | ❌ | Custom Plans only |
| AI modifies live workout | ✅ Apply to Today | ❌ | ❌ | Human does this | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Voice interaction | ✅ Mic everywhere | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ 15 Pro+ only |
| Web search in AI | ✅ | ❌ | ❌ | N/A | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Human coach | ❌ | ❌ | ❌ | ✅ $199/mo | ❌ | ❌ | Pre-recorded | ❌ | Pre-recorded | ✅ $200/mo | Pre-recorded |
| **WORKOUT** | | | | | | | | | | | |
| Strength training | ✅ | ❌ | ✅ Best-in-class | ✅ | ❌ | ✅ | ✅ | Limited | ✅ | ✅ | ✅ |
| Running program | ✅ Periodized HM build | Tracking only | ❌ | Varies | Tracking only | ❌ | Limited | ✅ Best | Limited | ❌ | ❌ |
| Strength + running unified | ✅ | ❌ | ❌ | Depends on coach | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| 12-week periodized plan | ✅ → 🔲 AI-generated | ❌ | No | ✅ Custom | ❌ | Journeys | ❌ | ❌ | ❌ | ✅ | ✅ |
| Progressive overload | ✅ Auto-scaled | N/A | ✅ Automated | Manual | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Session time picker | ✅ 20/30/45/60 min | ❌ | Partial | Human | ❌ | Partial | ✅ | ❌ | ✅ | ❌ | ✅ |
| Skip/modify exercises | ✅ | ❌ | ✅ | ✅ | ❌ | Limited | ❌ | ❌ | ❌ | ✅ | ❌ |
| Injury awareness | ✅ Profile + Coach | ❌ | Limited | ✅ Human | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Exercise video demos | ✅ (needs update) | ❌ | ✅ 1,600+ HD | ❌ | ❌ | ✅ | ✅ 200+ | ❌ | ✅ 1,400+ | ✅ 600+ | ✅ 8,000+ |
| **NUTRITION** | | | | | | | | | | | |
| AI meal planning | ✅ | ❌ | ❌ | ❌ | ✅ Premium+ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Meals matched to workout type | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Macro calculator | ✅ Mifflin-St Jeor | ❌ | ❌ | Depends | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ |
| Diet style support | ✅ omni/veg/vegan/pesc | ❌ | ❌ | Varies | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Recipe database | Static → 🔲 AI + URL drop | ❌ | ❌ | ❌ | ✅ 20.5M foods | ✅ 330+ | TV only | ❌ | ✅ 800+ | ❌ | ❌ |
| Recipe drop (paste URL) | 🔲 Planned | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Grocery/shopping list | ✅ | ❌ | ❌ | ❌ | ✅ Premium+ | ✅ | ❌ | ❌ | ✅ Auto | ❌ | ❌ |
| Fridge inventory | 🔲 Planned | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Auto-cart from meal plan | 🔲 Planned | ❌ | ❌ | ❌ | Partial (Walmart) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **WEARABLES** | | | | | | | | | | | |
| Apple Watch | 🔲 Terra API | ❌ proprietary | ✅ Log from wrist | ✅ Required | ✅ Health sync | ✅ Sync | ✅ | ✅ Live Segments | ❌ | ✅ | ✅ Primary |
| Garmin / Polar / Suunto | 🔲 Terra API | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ Garmin/Polar | ✅ 3,200+ | ❌ | ❌ Apple only | ❌ |
| Whoop / Oura / Fitbit | 🔲 Terra API | WHOOP only | ❌ | ❌ | ✅ Most | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| HRV / sleep / recovery | 🔲 Terra API | ✅ Core | ❌ | ✅ Via Watch | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | Partial |
| Wearable-agnostic | 🔲 Terra (any device) | ❌ WHOOP only | ❌ | ❌ Apple only | Partial | ❌ | Partial | ✅ | ❌ | ❌ Apple only | ❌ Apple only |
| **PLATFORM & UX** | | | | | | | | | | | |
| iOS | ✅ PWA | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Android | ✅ PWA | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Web | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ | ✅ | Likely | ❌ |
| Native App Store | ❌ PWA only (for now) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Offline support | ✅ Full | Limited | ✅ | ❌ | ❌ | Partial | ❌ | ❌ | ❌ | ❌ | ❌ |
| No shame / streak mechanics | ✅ | ❌ | ❌ | ✅ | ❌ Streaks | ❌ Streaks | ❌ | ❌ Streaks | ❌ | ✅ | ❌ |

---

## Where HimFit Wins

**1. The only unified AI coach** — workout + food + shopping in one conversation. Every competitor is siloed.

**2. AI that rewrites your actual workout** — not just recommendations. Coach modifies today's session, you tap Apply, it's saved. No other app does this.

**3. Meals matched to your workout type** — leg day shifts your macros, long run day changes your carb split. No competitor does this.

**4. Voice-first everywhere** — mic on Coach and Fuel. Apple Fitness+ has voice but only on iPhone 15 Pro+. No one else.

**5. Strength + running periodized together** — Fitbod is strength only. Strava is runs only. HimFit builds your half-marathon while keeping you strong.

**6. Wearable-agnostic via Terra API** — one integration covers Apple Watch, Garmin, Whoop, Oura, Fitbit, Polar. No hardware lock-in.

**7. Offline-first** — works fully without internet. Almost no competitor does this.

**8. Transparent AI** — Coach explains its reasoning. No black box.

---

## Where Competitors Win (be honest)

| Gap | Who's better | Our response |
|----|-------------|--------------|
| Exercise video library | Fitbod (1,600+), Apple Fitness+ (8,000+) | Fix video links; consider GIF library |
| Food database | MyFitnessPal (20.5M foods) | Not our angle — AI meal plans, not logging |
| Run tracking depth | Strava (50+ sports, GPS, social) | Strava per-user integration as data source |
| Wearable biometrics | WHOOP | Terra API covers this |
| Human coaching | Future ($199/mo), Caliber ($200/mo) | Not our model — AI-first |
| App Store presence | Everyone | PWA now; native app post product-market-fit |
| Social / community | Strava, Freeletics | Not MVP — shareable card later |

---

## Pricing Strategy

**$15/month or $120/year — one tier, everything included**

| | HimFit | Future | Centr | Strava | Freeletics | Fitbod |
|--|--------|--------|-------|--------|------------|--------|
| Price/year | $120 | $2,388 | $120 | $80 | $80 | $96 |
| AI workout gen | ✅ | Assisted | ❌ | ❌ | ✅ | ✅ |
| AI nutrition | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Unified coach | ✅ | Human | ❌ | ❌ | ❌ | ❌ |

**What premium means for HimFit:**
- No ads, ever
- No paywalled features — one tier, everything in
- No streaks, no shame, no guilt notifications
- AI explains its reasoning
- Feels instant

**The 3-word pitch: "Your AI coach."**

---

## Full Backlog

### 🔴 Now — Complete the Core Loop

| # | Feature | Notes |
|---|---------|-------|
| 1 | **Aesthetic goal — voice body vision** | Free-text + voice field in profile: "I want to look tight in 6 weeks." AI confirms + saves. Feeds Coach + Fuel system prompts. See full spec above. |
| 2 | Fridge/pantry inventory | Shop tab, two sections: Fridge + Shopping List. Stored in `S.fridge[]` |
| 3 | Fuel Chat — open conversation on Fuel tab | Same style as Today Coach. Handles recipe requests, macro questions |
| 4 | Recipe drop via URL or description | Paste Instagram link or "David Chang ramen" → AI parses → MEAL_JSON → saves to day plan |
| 5 | Auto-cart: diff meal plan vs fridge | Items you have → "✓ In fridge". Items you need → auto-added to cart |
| 6 | Race goal in profile | Goal race type, target time, race date |
| 7 | Personal Bests in Runs tab | Log PRs; "Race" checkbox on run entries |
| 8 | Pace targets from race goal | Tuesday quality runs + Saturday long runs get specific paces |

### 🟡 Next Sprint — AI Program + Wearables

| # | Feature | Notes |
|---|---------|-------|
| 8 | AI full 12-week program generation | "Generate my program" on profile save. Stores all weeks in `custom_workouts`. Replaces hardcoded arrays |
| 9 | Remove hardcoded exercise data | After #8 is stable. Keep structural skeleton (DAYS array, phase logic) |
| 10 | Terra API wearable connection | OAuth flow in Settings. Covers Apple Watch, Garmin, Whoop, Oura, Fitbit, Polar |
| 11 | HRV/sleep → Coach intensity adjustment | Low HRV → Coach suggests recovery session instead of heavy lifting |
| 12 | Wearable data in Coach system prompt | Last 7 days of HRV, sleep, active calories fed to Coach context |
| 13 | Remove static meal rotation | After Fuel Chat is solid. Replace with AI Fuel as the default |

### 🟢 Later — Growth & Polish

| # | Feature | Notes |
|---|---------|-------|
| 14 | Recipe Cookbook | Save recipes; Supabase `saved_recipes` table; Coach references them |
| 15 | Strava per-user | Replace hardcoded athlete ID with `S.intake.stravaId` |
| 16 | Exercise video overhaul | Audit + fix all broken links. ~50–100 entries |
| 17 | Personalised supplements | Based on goals, not static |
| 18 | Shareable workout card | Social proof; share today's session as an image |
| 19 | Native App Store app | Post product-market-fit |

---

## Tech Stack

| Item | Detail |
|------|--------|
| Codebase | `index.html` — single file, ~3,500 lines, vanilla JS |
| Hosting | GitHub Pages → `winstonac/himfit`, `main` branch |
| Auth + DB | Supabase `jqomeiarmdrraausoecd` |
| AI | Claude `claude-sonnet-4-20250514` via `ai-proxy` Edge Function |
| AI auth | `x-proxy-secret: himfit-wx-2026` header |
| Wearables (planned) | Terra API — aggregates Apple Watch, Garmin, Whoop, Oura, Fitbit, Polar |
| State | `S` object → `localStorage hf4` → synced to `himfit_profiles` |

### Supabase Tables

| Table | Status | Purpose |
|-------|--------|---------|
| `himfit_profiles` | ✅ Live | Full app state (includes `S.fridge[]` when built) |
| `custom_workouts` | ✅ Live | AI workout overrides per week/day |
| `push_subscriptions` | ✅ Live | Workout reminders |
| `saved_recipes` | 🔲 Planned | Cookbook |
| `wearable_snapshots` | 🔲 Planned | Daily HRV, sleep, HR from Terra |

---

## For Cursor / Any Editor

The entire app is one file: `index.html`. No build step, no framework.

Key patterns to understand before editing:
- `S` = global state object. `save()` writes to localStorage + schedules Supabase sync
- `buildDay()` = renders the Today workout. Checks `_customWorkouts` first, falls back to hardcoded
- `callAI(messages, systemPrompt)` = shared AI call. Returns text. Handles `tool_use` loop for web search
- `WORKOUT_JSON` protocol: AI embeds JSON in a code block → app parses → shows Apply button
- `MEAL_JSON` protocol: same pattern, planned for food
- `winstonFitSupabase` = Supabase client (let-scoped, not on window)
- `winstonFitAuthUser` = current Supabase user object
