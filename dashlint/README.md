# DashLint

> Design rules for dashboards that don't look AI-generated — an open Agent
> Skill for chart selection, layout hierarchy, and design tokens, learned
> from real production dashboards.

---

## What is this?

DashLint is an open **rulebook** that any AI coding assistant can read
automatically. It teaches the assistant how to build dashboards that look
like a human designer made them — not like an AI's first draft.

The rulebook covers chart selection, layout, colors, typography, interactions,
loading/error states, and insight presentation, drawing on production React
analytics dashboards (incident management and contact-center SLA).

| Category       | Prefix         | What it covers |
|----------------|----------------|----------------|
| Color system   | `R-COLOR-*`    | Semantic status colors, chart palette ordering, hue limits |
| Spacing        | `R-SPACE-*`    | Card padding, grid gaps, chart-to-card margins |
| Typography     | `R-TYPE-*`     | Dual-font pairing, tabular-nums, fluid KPI sizing |
| Chart selection| `R-CHART-*`    | Data shape → chart type, pie-chart avoidance, animation |
| Layout         | `R-LAYOUT-*`   | KPI-above-charts hierarchy, sidebar, grid, drawers vs overlays |
| Interaction    | `R-INTERACT-*` | Cross-filtering, clickable charts, keyboard shortcuts |
| States         | `R-STATE-*`    | Loading, empty, and error state patterns |

## Quick Start

### Claude Code / Claude Desktop

```bash
# Install via plugin marketplace
claude plugin marketplace add dashlint
```

### Any AI assistant (Cursor, ChatGPT/Codex, Windsurf, etc.)

Point your assistant at this repo's `/skill/SKILL.md`:

```
https://github.com/tanmay-kalbande/dashlint/blob/main/skill/SKILL.md
```

Or clone and reference locally:

```bash
git clone https://github.com/tanmay-kalbande/dashlint.git
# Then tell your AI: "Use the skill at ./dashlint/skill/SKILL.md"
```

### MCP Server (zero install)

If your AI client supports MCP (Model Context Protocol), you can connect to
the hosted server instead — no cloning needed:

```json
{
  "mcpServers": {
    "dashlint": {
      "url": "https://dashlint.tanmaysk.in/mcp"
    }
  }
}
```

→ See [dashlint-mcp](https://github.com/tanmay-kalbande/dashlint-mcp) for
the server source.

## Repo Structure

```
rulebook/                       ← Single source of truth
  design-tokens.md              ← Color / spacing / typography system
  chart-selection-rules.md      ← Data shape → chart type mapping
  chart-rendering.md            ← Reusable chart geometry guidance
  layout-hierarchy-rules.md     ← Information hierarchy rules
  examples.md                   ← Before / after examples

skill/                          ← Agent Skill (SKILL.md format)
  SKILL.md                      ← Frontmatter + activation guide
  reference.md                  ← Full compiled rulebook for AI consumption
  .claude-plugin/
    marketplace.json            ← Claude plugin marketplace manifest
```

## Principles

- **No AI keys** — DashLint never calls an LLM and never stores API keys
- **No signup** — fully open, no authentication
- **Real rules** — every rule comes from production projects, not generic advice
- **Data-driven defaults, not hard bans** — rules explain *why*, so the AI
  can reason about exceptions when the context genuinely warrants one

## Contributing

The rulebook lives in `/rulebook/`. Edit there — `reference.md` is compiled
from it. PRs welcome for new rules, corrections, or before/after examples.

## License

MIT
