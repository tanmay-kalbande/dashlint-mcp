# Plan Deviations & Findings Log

Log of verified differences or confirmations between the observations in `dashlint_v2_implementation_plan.md` and the actual codebase repository.

## Phase 0 Initial Audit Findings

| Observation in Plan | Codebase Reality | Status / Action |
|----------------------|------------------|-----------------|
| F1: High token payload (~60KB template/patterns/utilities) | Confirmed: `get_shell_preservation_spec` is 50.1 KB, `get_full_dashboard_template` is 39.1 KB, `get_js_utilities` is 27.5 KB. Total combined exceeds 160 KB. | Confirmed. |
| F2: Fabricated defaults in `openDayDrawer` (`94.3%`, `[84, 88, 91, 93, 95, 96, 94]`, hourly array, takeaway string) | Confirmed: `src/lib/dashboard-template.ts:352` has `'94.3%'`, lines 387 has canned takeaway, lines 401–406 has hardcoded progression array, line 443 has hardcoded hourly array. | Confirmed. |
| F3: Appendix A verified bugs (A1–A17) | Confirmed: All verified in `src/lib/dashboard-template.ts` and `src/lib/shell-contract.ts` (e.g. A1 `.main` grid row mismatch, A2 `.filter-drop` sibling vs child, A3 `.kpi-panel` 3 rows vs 4 children in `shell-contract.ts`, A4 `.finding-card` present, A8 unescaped tooltip `onmouseenter`, A9 unescaped HTML injection, A11 CSV parser lacks BOM & quoted newline handling). | Confirmed. |
| F4: Blueprint adds generic roles at 0.52 confidence, sums unit prices | Confirmed: `TYPE_ROLE_HINTS` in `src/lib/blueprint.ts:42` gives `["category", "status", "entity"]` with confidence 0.52; `price` matches `amount` and is suggested for `SUM()`. | Confirmed. |
| F5: Call-center vocabulary baked in (`hourly-gos-chart`, `cum-gos-wrap`, `h-gos-*`, `ddCompliance`, `ddBreaches`) | Confirmed: present in CSS, markup templates, and JS in `shell-contract.ts` and `dashboard-template.ts`. | Confirmed. |
| F6: Hardcoded LinkedIn credit mandatory | Confirmed: `generation-guide.ts` checklist and `shell-contract.ts` strictly enforce personal credit without config toggle. | Confirmed. |
| F7: Tool names drift between manifest/route and docs | Confirmed: Deployed server registers 10 tools; `README.md`, `page.tsx`, and site HTML only list 7 tools. | Confirmed. |
