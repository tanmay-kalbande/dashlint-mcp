# dashlint-sdk

Lightweight TypeScript client for the [DashLint MCP server](https://dashlint.tanmaysk.in). Call DashLint tools programmatically without requiring an MCP client.

## Install

```bash
npm install dashlint-sdk
```

## Quick Start

```typescript
import { DashLint } from 'dashlint-sdk';

const dl = new DashLint();

// Get the dashboard creation workflow
const workflow = await dl.getWorkflow();

// Build a schema-aware blueprint
const blueprint = await dl.buildBlueprint({
  businessQuestion: 'How is revenue trending by region?',
  rowCount: 5000,
  fields: [
    { name: 'order_id', type: 'identifier', distinctCount: 5000 },
    { name: 'order_date', type: 'date' },
    { name: 'region', type: 'category', distinctCount: 4 },
    { name: 'revenue', type: 'currency' },
    { name: 'units', type: 'number' },
  ],
});

// Get the dashboard kit
const kit = await dl.getDashboardKit({ mode: 'inline', domain: 'sales-distribution' });

// Check version
const version = await dl.getVersion();
console.log(version.serverVersion);
```

## Custom Server URL

```typescript
const dl = new DashLint({
  url: 'http://localhost:3000/mcp', // local dev
  timeout: 60_000,                  // 60s timeout
});
```

## API

| Method | Tool Called |
|--------|-----------|
| `getWorkflow()` | `get_dashboard_creation_workflow` |
| `buildBlueprint(input)` | `build_dashboard_blueprint` |
| `getDashboardKit(input?)` | `get_dashboard_kit` |
| `getVersion()` | `get_version` |
| `getDataInsightPlaybook()` | `get_data_insight_playbook` |
| `getCompositionPlaybook()` | `get_dashboard_composition_playbook` |
| `getInteractionPlaybook()` | `get_dashboard_interaction_playbook` |
| `getCompletionChecklist()` | `get_dashboard_completion_checklist` |

## Privacy

The SDK communicates only with the DashLint MCP server. It sends **no dataset rows** — only column metadata (names, types, counts) when calling `buildBlueprint()`. Your data stays on your machine.

## License

MIT
