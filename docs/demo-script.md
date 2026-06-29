# Adventa Demo Script

## 1. Opening

Start with the question:

```text
What should I do this weekend?
```

Adventa is the decision intelligence layer for Maharashtra adventure tourism.

## 2. User Input

Open `/plan` (or use the planner on the home page) and answer the three questions:

```text
How much time?  →  Just a weekend
Budget?         →  Up to ₹5k
Vibe?           →  Nature
Starting from?  →  Pune
```

Say:

```text
Instead of browsing endlessly, the user gives Adventa four constraints.
```

> Note: budget is a guided choice of ₹5k / ₹10k / ₹15k, and origin is Pune,
> Mumbai, or Nashik — these feed the real travel-time and pricing data.

## 3. Recommendation

Show the `#1 Best Match` hero and its Weekend Confidence Score.

Target story (representative — exact pick depends on live availability):

```text
Devkund Waterfall Trek
~90% Weekend Confidence
```

Say:

```text
Adventa does not just recommend an adventure. It explains the decision.
```

## 4. Explanation

Point to the transparent breakdown (each scored out of 20):

```text
Budget fit
Travel & timing
Weather fit
Difficulty fit
Vibe fit
Availability
```

Say:

```text
The score is transparent, so the user can trust it immediately. "Travel & timing"
blends real travel hours from the chosen origin with how the trip length fits the
requested duration.
```

## 5. Booking

Open the adventure, continue to checkout, select date and participants, then confirm.

Say:

```text
The booking flow validates date, capacity, and recomputes the final price
server-side before confirmation — the client can never dictate the total.
```

## 6. Operator

Switch to `/operator/login` (any credentials work in demo) → dashboard.

Show:

```text
Occupancy
Revenue
Demand signal
Suggested action
```

Say:

```text
Operators see where demand is building and what action can improve revenue.
```

## 7. Close

Close with:

```text
Adventa helps travelers choose better weekends and helps operators maximize occupancy.
```
