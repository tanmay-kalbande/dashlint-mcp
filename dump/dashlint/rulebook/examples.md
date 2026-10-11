# Before / After Examples — DashLint Rulebook

> Illustrative scenarios showing common violations and context-aware fixes.
> Adapt them to the actual data and user's task.

---

## Example 1: Too many categories in a pie chart

### ❌ Before (R-CHART-01)

A pie chart shows twelve incident categories. Small slices are difficult to
compare, and the legend forces repeated eye travel.

### ✅ After

Use a sorted horizontal bar chart for the most important categories, with a
meaningful "Other" group when the long tail can be combined. Keep counts and
the denominator visible. If every category matters, use a searchable table.

**Rules applied**: `R-CHART-01`, `R-CHART-04`

---

## Example 2: A no-scroll rule makes charts unreadable

### ❌ Before (R-LAYOUT-18)

Several useful views are squeezed into one viewport. Charts become too small,
labels are truncated, and the detail table is hidden behind extra controls.

### ✅ After

Keep a concise summary near the top, then let the page scroll naturally. Use
tabs, drawers, or overlays only when they help users switch tasks or inspect
details. Do not remove useful evidence just to avoid scrolling.

**Rules applied**: `R-LAYOUT-06`, `R-LAYOUT-08`, `R-LAYOUT-18`

---

## Example 3: A date field triggers an unnecessary calendar suite

### ❌ Before (R-LAYOUT-18)

The source contains a date column, so the dashboard adds day/week/month
switches, monthly cards, a calendar, a date drawer, and multiple exports even
though the user only asked for an overall comparison.

### ✅ After

Check whether the date is meaningful, what its grain and coverage are, and
whether time patterns answer the question. If not, omit the temporal suite. If
time matters, add the simplest useful trend or period comparison first.

**Rules applied**: `R-CHART-02`, `R-LAYOUT-18`

---

> These scenarios illustrate tradeoffs, not rigid prescriptions. Apply the
> reasoning when the data and task match.
