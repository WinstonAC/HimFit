# Winston Fit — Tester Guide

No technical knowledge needed. Just follow these steps and report back anything that feels broken or confusing.

---

## Getting started

1. Open the app: **https://winstonac.github.io/HimFit/**
2. You'll see a **Sign in** screen.

---

## Creating your account

1. Enter your **email** and choose a **password** (at least 6 characters).
2. Tap **Create Account**.
3. Check your inbox for a confirmation email — click the link inside.
   > If you don't see it within 2 minutes, check your **spam/junk** folder.
4. Come back to the app, enter your email + password again, tap **Sign In**.

---

## Setting up your profile

After signing in, a **profile form** opens automatically. Fill in:

| Field | What to pick |
|-------|-------------|
| First name | Your name (optional) |
| Sex | Your biological sex (affects exercise weights + fertility goal option) |
| Units | kg/cm or lb/ft |
| Age | Your age |
| Weight | Your current weight |
| Height | Your height |
| Goals | Pick up to 3 (e.g. Build Muscle + Endurance) |
| Experience | Beginner / Intermediate / Advanced |
| Days per week | How many days you can train (3–6) |
| Location | Gym, Home, or Both |
| Program style | Full Program (strength + runs) or Runner-focused |
| Eating style | Omnivore / Pescatarian / Vegetarian / Vegan |
| Meal preference | Balanced or Salad-forward |
| Running comfort | How far you can run comfortably |
| Injuries | Any restrictions (e.g. "bad knee") |

Tap **Save profile** when done. You can edit it any time from **Overview → Settings → Profile → Edit**.

---

## Exploring the app

### Overview tab (home screen)
- Check your **Days/Wk**, **Sessions**, and **Goal Race** numbers match what you entered.
- The **Build / Drive / Peak** phase card for your current week should have a gold border.
- The **Weekly Split** should match your program style (e.g. runner or gym).

### Today tab
- Shows today's workout — exercises, reps, rest times.
- Tap an exercise's **video button** to see a demo.
- Use the **time pills** (Full / 20 min / 30 min / 45 min / 60 min) to shorten the session.
- Tap **✕** next to an exercise to skip it.
- Tap **Session complete ✓** when you finish.

### Plan tab
- Shows all 12 weeks.
- Your current week is highlighted.
- Tap any week to jump to it.

### Fuel tab
- Shows your **daily calorie and macro targets**.
- Shows a **meal plan** for today's workout type.
- Tap **+ Add to list** on any ingredient to add it to your shopping list.

### Runs tab
- Log a run: enter distance, time, heart rate (optional), RPE (optional), notes.
- Tap **Save run** — it appears in your history below.

### Shop tab
- Your grocery list from Fuel.
- Add custom items with the text box.
- Tap an item to tick it off.
- Tap **Clear done** to remove ticked items.

---

## Things to specifically test

Please check each of these and note anything that looks wrong:

- [ ] Sign-up email arrives and confirmation link works
- [ ] Profile form opens automatically after first sign-in
- [ ] Overview stats show **your** days/week and goal (not hardcoded "5 / 60 / HM")
- [ ] Weekly split matches your program style (runner vs gym)
- [ ] Current phase (Build / Drive / Peak) has gold border
- [ ] Today's workout shows exercises appropriate for your experience level
- [ ] Exercise weights feel reasonable for your bodyweight
- [ ] Fuel macros look sensible for your stats and goals
- [ ] Meal plan matches your eating style
- [ ] Run log saves and displays correctly
- [ ] Shopping list adds/removes items correctly
- [ ] Signing out and back in restores all your data
- [ ] App works on your phone (Add to Home Screen for best experience)

---

## Reporting issues

Please share:
1. **What you were doing** (e.g. "filling in my profile")
2. **What happened** (e.g. "the app went blank")
3. **Your device and browser** (e.g. iPhone 14 / Safari)
4. A **screenshot** if possible

---

## Forgot your password?

On the sign-in screen, tap **Forgot password?**, enter your email, and check your inbox for a reset link.

---

## Signing out

**Overview** → scroll down to **Account** → tap **Sign out**.
