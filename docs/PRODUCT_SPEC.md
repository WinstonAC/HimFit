# HimFit — Product Spec & Backlog

_Last updated: May 2026_

---

## What's Shipped

| Feature | Status |
|---------|--------|
| 12-week progressive strength + run program | ✅ Live |
| AI Coach embedded in Today tab (collapsible) | ✅ Live |
| Workout replacement via AI (Apply to Today) | ✅ Live |
| AI Fuel — generate full day meal plan | ✅ Live |
| Voice input on Coach + Fuel | ✅ Live |
| Viewport locked (no pinch-zoom, native feel) | ✅ Live |
| Coach reads time pill selection (20/30/45/60 min) | ✅ Live |
| Supabase auth, profile sync, push notifications | ✅ Live |
| Manual run log | ✅ Live |
| Shopping list from meal ingredients | ✅ Live |
| Weight-scaled exercises (body weight + sex) | ✅ Live |

---

## Backlog — Ranked by Impact

---

### 1. Smart Fuel — Fridge + Recipe Drop + Auto-Cart
**Priority: HIGH — this is the core daily loop**

The most requested feature pattern in the top fitness apps (MyFitnessPal, FitGenie) is seamless nutrition planning that bridges meal suggestions → ingredient inventory → grocery purchasing.

**1a. Fridge / Pantry Inventory**
- New section in Shop tab: "In my fridge" (two sections: Fridge | Shopping List)
- Add items once; they persist until removed
- Stored in `S.fridge[]`, synced via existing Supabase profile state (no new table)

**1b. Recipe Drop into Fuel Chat**
- Open chat bar on Fuel tab (same style as Today's Ask Coach)
- Paste any Instagram/web link or describe a recipe verbally
- AI uses web search to look it up, extracts ingredients + estimated macros
- AI asks: "Add to today or tomorrow? You're missing [X, Y, Z]."
- Confirm → meal added to that day's plan; missing items auto-added to shopping list
- Uses MEAL_JSON protocol (same pattern as WORKOUT_JSON for workouts)

**1c. Smart Diff (auto-cart)**
- When AI generates any meal plan, cross-reference against `S.fridge[]`
- Items you HAVE → shown as "✓ In fridge", not added to cart
- Items you NEED → automatically added to shopping list

**1d. Recipe Saving / Cookbook**
- "Save recipe" button on any AI-suggested meal
- Stored in new Supabase table: `saved_recipes` `{user_id, name, ingredients, macros_json, source_url}`
- Coach and Fuel AI system prompts include last 10 saved recipes for context
- Future: Cookbook view (browsable list of saved recipes)

---

### 2. AI-First Workout Generation
**Priority: HIGH — flagship differentiator**

Most apps (Nike Training Club, Freeletics) offer template-based programs. The gap is a truly personalized AI-generated program that adapts to the user's exact profile.

**Phase 1 (current):** AI modifies individual days via Coach → Apply to Today ✅

**Phase 2 (to build):**
- "Generate my full program" in Overview/Plan tab
- AI generates all 12 weeks: strength + runs, progressive overload week-over-week
- Uses profile: experience, goals, days/week, gym vs. home, injuries, race target
- Stored as `custom_workouts` rows (no schema change needed — table already exists)
- "Reset to default" wipes custom_workouts, restores hardcoded program

**Phase 3 (future):**
- Re-generate on demand ("I've been training for 3 weeks, update my plan")
- Mid-program adjustments based on logged performance

---

### 3. Run Coaching — Race Goal Awareness
**Priority: MEDIUM**

User ran 2:18 half marathon, wants 1:45. The app doesn't know this or factor it into pacing.

- Add to profile intake: goal race (5K/10K/HM/Full), goal finish time, race date
- Add "Personal Bests" section to Runs tab
- Coach system prompt gets: current PRs, goal pace, weeks until race
- Tuesday quality runs and Saturday long runs get pace targets based on race goal
- Run log "Race" checkbox flags an entry as a race result (auto-updates PR)

---

### 4. Fuel Chat — Conversational Food AI
**Priority: MEDIUM**

The Generate button on Fuel tab is one-shot. Users want to iterate, ask questions, get recipe ideas.

- Collapsible "Ask about food" chat on Fuel tab (same style as Today's Ask Coach)
- Handles: recipe requests by name or URL, macro questions, substitutions, meal prep
- Recipe drop flow lives here (see #1b above)
- Distinct system prompt from workout coach (food-focused)

---

### 5. Strava Per-User
**Priority: LOW-MEDIUM**

Currently the Strava athlete ID is hardcoded to one user.

- Add "Strava Athlete ID" to profile intake or Settings
- Replace hardcoded ID `39096162` with `S.intake.stravaId`
- Remove owner-only visibility restriction — any user can connect their own Strava

---

### 6. Exercise Video Fix
**Priority: LOW**

Many YouTube links on exercises are broken or low quality.

- Audit all exercise video links in the workout data arrays (~50–100 entries)
- Replace with working links or switch to a curated source
- Consider hosted GIFs or a YouTube playlist approach

---

### 7. Hardcoded Content Cleanup
**Priority: LOW — needs user input on specifics**

User mentioned "hard coded things I don't like" — needs a review session to identify exactly what to change.

Likely candidates:
- Supplement recommendations (not personalized to goals)
- Protocol cards (sauna, creatine) — static regardless of profile
- Fuel supplements section doesn't respond to user goals

---

## Competitive Landscape (May 2025)

### Top Apps by Downloads
1. MyFitnessPal — AI meal plans (Feb 2025), Walmart grocery partnership
2. Strava — run/ride tracking leader
3. Nike Training Club — best free workout library
4. Fitbod — best AI strength adaptation
5. WHOOP — GPT-4 coaching, biometric-first

### Biggest Gaps in the Market (our opportunities)
| Gap | Opportunity for HimFit |
|-----|------------------------|
| Fragmented nutrition + workout | Unified AI loop: workout → food → shopping |
| Recipe drop (paste a link → meal plan) | Already planning this (#1b above) |
| Voice-first coaching | Mic on Coach + Fuel already live |
| Transparent AI ("why this workout?") | Coach explains reasoning inline |
| Cross-modality periodization | Strength + run unified in one program |
| Grocery integration | Auto-cart from meal plans (#1c above) |
| Offline-first | App works fully offline (localStorage-first) |
| Ethical, non-shaming UX | No streaks, no guilt — coach is encouraging |

### Retention Drivers (from research)
- AI personalization → **50% retention boost**
- Wearable integration → **40% weekly engagement boost**
- Social/community → **30% retention lift**
- Paid AI tier → **75% annual retention** (vs 20% free)

---

## Tech Stack Reference

| Item | Detail |
|------|--------|
| Codebase | Single file: `index.html` (~3,500 lines, vanilla JS) |
| Hosting | GitHub Pages → `winstonac/himfit`, deploys from `main` |
| Auth + DB | Supabase project `jqomeiarmdrraausoecd` |
| AI proxy | Supabase Edge Function `ai-proxy`, secret `himfit-wx-2026` |
| AI model | `claude-sonnet-4-20250514` |
| State | `S` object in localStorage key `hf4`, synced to `himfit_profiles` |
| Tables | `himfit_profiles`, `custom_workouts`, `push_subscriptions` |
| Needed | `saved_recipes` (for cookbook feature) |
