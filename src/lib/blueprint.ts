export type DashboardFieldType =
  | "date"
  | "datetime"
  | "number"
  | "currency"
  | "percentage"
  | "boolean"
  | "category"
  | "identifier"
  | "text"
  | "unknown";

export interface DashboardFieldInput {
  name: string;
  type: DashboardFieldType;
  distinctCount?: number;
  nullablePercent?: number;
}

type FieldRole = "time" | "identifier" | "measure" | "duration" | "amount" | "rate" | "status" | "category" | "entity";

const ROLE_SIGNALS: Record<FieldRole, string[]> = {
  time: ["date", "time", "timestamp", "opened", "created", "resolved", "closed", "updated", "period", "month", "week", "day"],
  identifier: ["id", "key", "record id", "ticket id", "incident id", "case id", "conversation id", "interaction id", "session id", "incident number", "ticket number", "case number", "conversation number", "interaction number", "reference"],
  measure: ["count", "volume", "total", "quantity", "units", "score", "value", "amount", "duration", "handle", "wait", "queue", "age", "cost", "revenue", "sales", "calls", "tickets", "incidents", "orders", "requests"],
  duration: ["duration", "handle time", "wait time", "queue time", "total queue", "total handle", "total hold", "hold time", "contacting time", "total contacting", "time to abandon", "resolution time", "elapsed", "age", "minutes", "seconds", "hours", "mttr"],
  amount: ["amount", "revenue", "sales", "cost", "price", "value", "spend", "balance", "profit"],
  rate: ["rate", "percent", "percentage", "ratio", "compliance", "sla", "conversion", "margin", "share"],
  status: ["status", "state", "priority", "severity", "outcome", "result", "resolved", "closed", "abandoned", "made sla", "breached"],
  category: ["category", "type", "channel", "queue", "group", "team", "agent", "owner", "reason", "product", "service", "department", "segment", "source"],
  entity: ["caller", "customer", "user", "agent", "requester", "account", "employee", "location", "region", "store", "site", "product"],
};

const TYPE_ROLE_HINTS: Partial<Record<DashboardFieldType, FieldRole[]>> = {
  date: ["time"],
  datetime: ["time"],
  number: ["measure"],
  currency: ["amount", "measure"],
  percentage: ["rate"],
  boolean: ["status"],
  identifier: ["identifier"],
  category: ["category", "status", "entity"],
};

const ROLE_ALLOWED_TYPES: Record<FieldRole, DashboardFieldType[]> = {
  time: ["date", "datetime", "unknown", "text"],
  identifier: ["identifier", "category", "text", "unknown"],
  measure: ["number", "currency", "percentage", "unknown"],
  duration: ["number", "unknown"],
  amount: ["number", "currency", "unknown"],
  rate: ["number", "percentage", "unknown"],
  status: ["boolean", "category", "text", "unknown"],
  category: ["boolean", "category", "text", "unknown"],
  entity: ["identifier", "category", "text", "unknown"],
};

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function classifyField(field: DashboardFieldInput) {
  const normalizedName = normalize(field.name);
  const tokens = new Set(normalizedName.split(" ").filter(Boolean));
  const possibleRoles: { role: FieldRole; confidence: number; reason: string }[] = [];

  for (const [role, aliases] of Object.entries(ROLE_SIGNALS) as [FieldRole, string[]][]) {
    if (!ROLE_ALLOWED_TYPES[role].includes(field.type)) continue;
    const normalizedAliases = aliases.map(normalize);
    const exact = normalizedAliases.find((alias) => alias === normalizedName);
    const tokenMatch = normalizedAliases.find((alias) => alias.includes(" ")
      ? normalizedName.includes(alias)
      : tokens.has(alias));

    if (exact || tokenMatch) {
      const specific = 0.94;
      possibleRoles.push({ role, confidence: exact ? specific : 0.78, reason: `Field name matches ${role} terminology.` });
    }
  }

  for (const role of TYPE_ROLE_HINTS[field.type] ?? []) {
    if (!possibleRoles.some((match) => match.role === role)) {
      possibleRoles.push({ role, confidence: 0.52, reason: `Inferred ${field.type} type suggests this role; confirm against the data dictionary.` });
    }
  }

  if (["text", "unknown"].includes(field.type) && !possibleRoles.length) {
    possibleRoles.push({ role: "category", confidence: 0.3, reason: "Could be a dimension; inspect locally before using it." });
  }

  const strongRoles = possibleRoles.filter((role) => role.confidence >= 0.7);
  const familyOf = (role: FieldRole) => {
    if (role === "time") return "time";
    if (role === "identifier") return "identifier";
    if (["measure", "duration", "amount", "rate"].includes(role)) return "numeric";
    return "dimension";
  };
  const competingTopRoles = strongRoles.length > 1
    && strongRoles[0].confidence - strongRoles[1].confidence < 0.12
    && familyOf(strongRoles[0].role) !== familyOf(strongRoles[1].role);

  return {
    name: field.name,
    inferredType: field.type,
    distinctCount: field.distinctCount,
    nullablePercent: field.nullablePercent,
    possibleRoles: possibleRoles.sort((a, b) => b.confidence - a.confidence),
    confirmMeaning: strongRoles.length === 0 || competingTopRoles,
  };
}

export function buildDashboardBlueprint(input: {
  datasetLabel?: string;
  businessQuestion?: string;
  audience?: string;
  fields: DashboardFieldInput[];
}) {
  const classified = input.fields.map(classifyField);
  const fieldsFor = (role: FieldRole) => classified
    .filter((field) => field.possibleRoles.some((candidate) => candidate.role === role && candidate.confidence >= 0.7))
    .map((field) => field.name);

  const timeFields = fieldsFor("time");
  const ids = fieldsFor("identifier");
  const measures = fieldsFor("measure");
  const durations = fieldsFor("duration");
  const amounts = fieldsFor("amount");
  const rates = fieldsFor("rate");
  const statuses = fieldsFor("status");
  const categories = [...new Set([...fieldsFor("category"), ...fieldsFor("entity")])];
  const additiveMeasures = measures.filter((field) => !durations.includes(field) && !amounts.includes(field) && !rates.includes(field));
  const chartMeasures = [...new Set([...amounts, ...durations, ...additiveMeasures, ...rates])];

  const metricRecipes = [
    {
      name: "Record volume",
      formula: "COUNT(rows) after applying the visible date range and filters",
      requiredFields: [],
      guardrail: "Label this as row count; do not imply unique entities unless an identifier is validated.",
    },
    ...ids.map((field) => ({
      name: `Distinct ${field}`,
      formula: `COUNT DISTINCT(${field}) within the selected scope`,
      requiredFields: [field],
      guardrail: "Confirm the field is an entity key rather than an event ID before presenting it as people, customers, or accounts.",
    })),
    ...amounts.map((field) => ({
      name: `Total ${field}`,
      formula: `SUM(${field}) only if each row contributes an additive amount; otherwise use the appropriate per-record summary`,
      requiredFields: [field],
      guardrail: "Preserve and display the source currency/unit; do not sum snapshots or percentages.",
    })),
    ...additiveMeasures.map((field) => ({
      name: `Total ${field}`,
      formula: `SUM(${field}) only if each row contributes an additive count/quantity; otherwise select a per-record summary`,
      requiredFields: [field],
      guardrail: "Confirm the measure is additive and show its source unit; never sum rates, snapshots, IDs, or durations.",
    })),
    ...durations.map((field) => ({
      name: `Typical ${field}`,
      formula: `MEDIAN(${field}) with mean and distribution available for context`,
      requiredFields: [field],
      guardrail: "Confirm source unit and exclude missing/invalid values transparently; do not sum a duration field by default.",
    })),
    ...rates.map((field) => ({
      name: field,
      formula: `Use the source rate if its definition is documented; otherwise derive numerator / eligible denominator only when both are identified`,
      requiredFields: [field],
      guardrail: "Never average percentages blindly; expose numerator, denominator, and eligible population.",
    })),
    ...statuses.map((field) => ({
      name: `${field} mix and outcomes`,
      formula: `COUNT(rows) and share of eligible rows by ${field}`,
      requiredFields: [field],
      guardrail: "State the denominator and keep missing/unknown statuses visible.",
    })),
  ];

  const chartPlan = [];
  if (timeFields.length) chartPlan.push({ question: "How does activity or a measure change over time?", chart: "Line chart or compact time series", fields: [...timeFields.slice(0, 1), ...chartMeasures.slice(0, 2)], condition: "Aggregate by a meaningful time grain and show partial-period coverage." });
  if (categories.length) chartPlan.push({ question: "Which groups contribute most to the outcome or workload?", chart: "Sorted horizontal bar chart", fields: [...categories.slice(0, 2), ...chartMeasures.slice(0, 1)], condition: "Show counts/denominators and cap high-cardinality views to a useful ranked set." });
  if (durations.length) chartPlan.push({ question: "How are durations distributed and where is the long tail?", chart: "Histogram or box plot", fields: durations.slice(0, 2), condition: "Keep source units visible; flag outliers as investigation candidates only." });
  if (statuses.length && categories.length) chartPlan.push({ question: "Do outcomes differ across groups?", chart: "Grouped bar, heatmap, or table", fields: [...statuses.slice(0, 1), ...categories.slice(0, 1)], condition: "Use a normalized rate only with a verified eligible denominator; otherwise show counts." });
  if (ids.length) chartPlan.push({ question: "Which records need follow-up?", chart: "Searchable, sortable detail table", fields: [...ids.slice(0, 1), ...timeFields.slice(0, 1), ...statuses.slice(0, 1)], condition: "Retain source rows for details and apply dashboard filters consistently." });

  const warnings: string[] = [];
  if (!timeFields.length) warnings.push("No date/time column confidently detected; avoid time trends until the AI verifies a usable field locally.");
  if (!measures.length) warnings.push("No numeric measure confidently detected from column metadata. Do not force numeric KPIs; inspect text, dates, locations, relationships, and other field structures locally to find appropriate analysis, or explain what additional context is needed.");
  if (classified.some((field) => field.confirmMeaning)) warnings.push("Some field roles are uncertain. Resolve the flagged mappings from local inspection or user confirmation before asserting business meaning.");
  if (!input.businessQuestion) warnings.push("No business question supplied; infer a focused question from the dataset, in any domain, and state the chosen scope in the dashboard.");

  const recommendedComponents: string[] = ["kpiCards", "healthBar", "panels", "validation", "generatedOutput", "buttons", "sectionLayouts", "overlays"];
  if (categories.length) recommendedComponents.push("horizontalBars", "multiSelectFilter");
  if (timeFields.length) recommendedComponents.push("chartContainer", "dayDrawer", "dayComparator", "chartTooltip");
  if (ids.length || categories.length) recommendedComponents.push("dataTables", "drawers");
  if (timeFields.length && categories.length) recommendedComponents.push("heatmap");
  recommendedComponents.push("findingCards", "badges", "accessibility");

  return {
    blueprintVersion: "1.1",
    datasetLabel: input.datasetLabel ?? "User dataset",
    businessQuestion: input.businessQuestion ?? null,
    audience: input.audience ?? null,
    privacy: "Only column metadata was provided to this tool. The AI must read rows and calculate values locally; never send file contents to DashLint.",
    recommendedComponents,
    layoutArchitecture: {
      tab1: "Executive Overview: 1-screen balanced workspace (.workspace / .overview-split). Left column: .kpi-panel with 2x3 .kpis grid, Operational Health Bar gauge (.health-bar-wrap), and .validation checks. Right column: .message-panel with textarea.summary-textarea, .rules, and 4-button .actions strip ('Copy msg', 'Insights', '.txt', 'Deep Dive/Locations'). Clicking 'Insights' wipes open the full .analytics-overlay with sub-tabs. Crucial: Tab 1 must NOT scroll on desktop — both panels must match 100% height.",
      tab2: timeFields.length ? "Trends & Analysis: Stacked SVG trend charts (.chart-container) with interactive probe (#chartTooltip), day breakdown table with row click to .day-drawer, and segment distributions (.seg-grid)." : "Distribution & Rankings: Horizontal progress bars (.hbar-row) and category scorecards.",
      tab3: ids.length ? "Record Explorer: Searchable, sortable data table (.data-table) with row-click detail drawer (.slide-drawer) or day comparator (.comparator-controls)." : "Deep Dive: Detailed breakdown matrices and category tables.",
    },
    fieldMappings: classified,
    metricRecipes,
    chartPlan,
    implementationPriorities: [
      "Use the shared dataset only to choose field mappings, formulas, labels, and insight-generation rules; do not embed source rows, calculated totals, chart points, or fixed findings in the generated HTML.",
      "Deliver a reusable, downloadable HTML application that opens to an empty upload state and locally parses CSV, XLSX, and XLS files.",
      "Recompute every visible metric, chart, narrative insight, filter option, validation status, and detail row from the currently uploaded file. Replacing the file must discard all old data and derived state.",
      "Preserve the existing reference shell, including the exact header upload-control position, while adapting the main dashboard body to this schema.",
      "The role matcher, metric recipes, and chart ideas in this blueprint are non-exhaustive heuristics, never a domain whitelist or required catalog. Build for any domain and use other verified fields, defensible formulas, and suitable custom visualizations when they better answer the user's question.",
      "Keep the reference 'built by Tanmay Kalbande' LinkedIn credit at the very bottom of the sidebar in its muted mono style; preserve the source name animation when available.",
      "Crucial: Tab 1 (Executive Overview) must NEVER scroll vertically on desktop. Structure it as a 2-column balanced workspace (.workspace) where left KPI panel and right Generated Output panel are identically tall.",
      "CSV parsing should be hand-written (~50 lines). For Excel (.xlsx, .xls) support, load SheetJS via a CDN script tag — never inline the library source (it is ~700 KB). If the CDN is unreachable, disable Excel and prompt the user to export as CSV. Do not require a backend, development server, or network upload for data handling.",
    ],
    warnings,
  };
}
