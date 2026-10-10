# DashLint Tool, Documentation & Integration Inventory

Generated as part of Phase 0 audit (DashLint v2 implementation).

## 1. Live MCP Tools (Registered in `src/app/api/mcp/route.ts`)

| Tool Name | Parameters / Schema | Typical Response Size | Notes |
|-----------|---------------------|----------------------|-------|
| `get_dashboard_creation_workflow` | None (`{}`) | ~14,171 bytes | Orchestrated workflow guide + tool map |
| `build_dashboard_blueprint` | `{ datasetLabel?, businessQuestion?, audience?, fields: [...] }` | ~7,967 bytes | Schema-aware implementation plan |
| `get_shell_preservation_spec` | None (`{}`) | ~50,149 bytes | Design tokens, frame CSS, sidebar templates, component patterns |
| `get_data_insight_playbook` | None (`{}`) | ~3,210 bytes | Data inspection, verification, and insight rules |
| `get_dashboard_composition_playbook` | None (`{}`) | ~12,235 bytes | Story structure, chart selection, visual hierarchy |
| `get_dashboard_interaction_playbook` | None (`{}`) | ~6,408 bytes | Upload, filters, drawer, responsive requirements |
| `get_dashboard_completion_checklist` | None (`{}`) | ~3,372 bytes | Final review checklist |
| `get_full_dashboard_template` | None (`{}`) | ~39,103 bytes | Wireframe template with fixed shell |
| `get_component_patterns` | `{ components: string[] }` | ~9,452 bytes (4 comps) / ~35 KB (all) | Targeted CSS/HTML snippets for chosen components |
| `get_js_utilities` | None (`{}`) | ~27,454 bytes | CSV/Excel parser, animation, filter, drawer, upload script |

**Total Live Tools:** 10  
**Cumulative response payload for a full run:** >160 KB.

---

## 2. Documentation Pages Inventory

| Document Path | Tools Referenced | Notes |
|---------------|------------------|-------|
| `README.md` (root) | 7 tools (`get_dashboard_creation_workflow`, `build_dashboard_blueprint`, `get_shell_preservation_spec`, `get_data_insight_playbook`, `get_dashboard_composition_playbook`, `get_dashboard_interaction_playbook`, `get_dashboard_completion_checklist`) | **Missing:** `get_full_dashboard_template`, `get_component_patterns`, `get_js_utilities` |
| `dashlint/README.md` | General skill documentation, references skill and MCP URL | No explicit tool table |
| `dashlint/skill/SKILL.md` | `get_dashboard_creation_workflow(mode)`, `get_dashboard_completion_checklist(mode)` | References legacy/workflow tools only |
| `dashlint/skill/reference.md` | Comprehensive design and visualization rulebook (`R-*` rules) | Does not enumerate MCP tools |
| `Design_Tokens.md` | Token definitions, no tool calls | Pure design tokens |

---

## 3. Web & Landing Page Inventory

| Location | Tools Named |
|----------|-------------|
| `src/app/page.tsx` (lines 20–28) | Lists only 7 tools (`build_dashboard_blueprint`, `get_dashboard_creation_workflow`, `get_shell_preservation_spec`, `get_data_insight_playbook`, `get_dashboard_composition_playbook`, `get_dashboard_interaction_playbook`, `get_dashboard_completion_checklist`). |
| `dashlint-site-v9.html` & `dashlint-site-v10.html` | Lists identical 7 tools in `TL` array. |

---

## 4. Drift Summary (Finding F7)

1. The deployed MCP server registers **10 tools**, but `README.md`, `src/app/page.tsx`, and `dashlint-site-v10.html` only document **7 tools**.
2. `get_full_dashboard_template`, `get_component_patterns`, and `get_js_utilities` are live in `src/app/api/mcp/route.ts` but completely absent from public landing pages and root docs.
3. Skill documentation references `(mode)` arguments that the live Zod schemas do not accept (`noInput`).
