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
  numericSummary?: {
    min?: number;
    max?: number;
    mean?: number;
  };
  dateRange?: {
    min?: string;
    max?: string;
  };
}

export type FieldRole =
  | "identifier"
  | "time"
  | "status"
  | "reason"
  | "measure"
  | "rate"
  | "dimension"
  | "unknown";

export type AdditivityClass =
  | "additive"
  | "non_additive"
  | "snapshot"
  | "count_distinct"
  | "count_and_share"
  | "none";

export type DefaultAggregation =
  | "sum"
  | "weighted_avg"
  | "recompute"
  | "avg"
  | "median"
  | "latest"
  | "count"
  | "count_distinct"
  | "none";

export interface ClassifiedField {
  name: string;
  inferredType: DashboardFieldType;
  distinctCount?: number;
  nullablePercent?: number;
  role: FieldRole;
  additivity: AdditivityClass;
  defaultAggregation: DefaultAggregation;
  confidence: number;
  reason: string;
  guardrail?: string;
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export function classifyField(field: DashboardFieldInput, rowCount?: number): ClassifiedField {
  const normName = normalize(field.name);
  const tokens = new Set(normName.split(" ").filter(Boolean));
  const distinctRatio = (rowCount && field.distinctCount != null) ? (field.distinctCount / rowCount) : 0;
  const numeric = ["number", "currency", "percentage"].includes(field.type);

  // 1. Identifier check
  const idSuffixes = ["id", "code", "no", "number", "key", "ref", "reference", "uuid", "guid"];
  const isIdName = idSuffixes.some(s => normName === s || normName.endsWith(" " + s) || normName.endsWith("_" + s));
  const idByRatio = !numeric && ["text", "unknown", "category", "identifier"].includes(field.type) && distinctRatio >= 0.90;
  if (field.type === "identifier" || (isIdName && !numeric) || idByRatio) {
    return {
      name: field.name,
      inferredType: field.type,
      distinctCount: field.distinctCount,
      nullablePercent: field.nullablePercent,
      role: "identifier",
      additivity: "count_distinct",
      defaultAggregation: "count_distinct",
      confidence: isIdName ? 0.95 : 0.88,
      reason: "Column represents record or entity identifier; suitable for grain determination.",
      guardrail: "Confirm whether this is a record grain key or a recurring entity ID before reporting distinct counts as unique entities."
    };
  }

  // 2. Time check (calendar dates and timestamps; durations are measures)
  const timeTokens = ["date", "time", "timestamp", "opened", "created", "resolved", "closed", "updated", "period", "month", "week", "day", "year", "quarter"];
  const isTemporalType = ["date", "datetime"].includes(field.type);
  const isTimeByName = !numeric && field.type !== "boolean" && timeTokens.some(t => tokens.has(t));
  if (isTemporalType || isTimeByName) {
    return {
      name: field.name,
      inferredType: field.type,
      distinctCount: field.distinctCount,
      nullablePercent: field.nullablePercent,
      role: "time",
      additivity: "none",
      defaultAggregation: "none",
      confidence: 0.96,
      reason: "Time or date dimension indicating event sequence or temporal partition.",
      guardrail: "Aggregate by consistent calendar buckets (e.g. day or month); do not sum or average date values."
    };
  }

  // 3. Status or Outcome check
  const statusTokens = ["status", "state", "outcome", "result", "flag", "on time", "breach", "priority", "severity", "stage", "active", "closed", "resolved", "delivered", "returned", "cancelled"];
  const isStatusMatch = statusTokens.some(t => t.includes(" ") ? normName.includes(t) : tokens.has(t));
  const isQtyField = ["qty", "quantity", "count", "units", "volume", "amount"].some(t => tokens.has(t)) || field.type === "number" || field.type === "currency";
  if (!isQtyField && (field.type === "boolean" || isStatusMatch)) {
    return {
      name: field.name,
      inferredType: field.type,
      distinctCount: field.distinctCount,
      nullablePercent: field.nullablePercent,
      role: "status",
      additivity: "count_and_share",
      defaultAggregation: "count",
      confidence: 0.92,
      reason: "Categorical status, outcome, or priority flag indicating operational state.",
      guardrail: "Always display counts alongside percentage shares, and make missing/unresolved statuses explicit."
    };
  }

  // 4. Reason or Root Cause check
  const reasonTokens = ["reason", "cause", "issue reason", "defect", "root cause", "failure"];
  const isReasonMatch = reasonTokens.some(t => t.includes(" ") ? normName.includes(t) : tokens.has(t));
  if (isReasonMatch) {
    return {
      name: field.name,
      inferredType: field.type,
      distinctCount: field.distinctCount,
      nullablePercent: field.nullablePercent,
      role: "reason",
      additivity: "count_and_share",
      defaultAggregation: "count",
      confidence: 0.94,
      reason: "Categorical explanation for exceptions, returns, or service delays.",
      guardrail: "Empty or null values represent normal/issue-free transactions; label as (none) rather than omitting."
    };
  }

  // 5. Rates & Percentages (NON-ADDITIVE)
  const rateTokens = ["percent", "pct", "ratio", "rate"];
  const isRateMatch = rateTokens.some(t => t.includes(" ") ? normName.includes(t) : tokens.has(t));
  const isFulfillmentRate = ["fulfilment", "fulfillment"].some(t => tokens.has(t));
  if (field.type === "percentage" || (field.type !== "currency" && (isRateMatch || isFulfillmentRate))) {
    return {
      name: field.name,
      inferredType: field.type,
      distinctCount: field.distinctCount,
      nullablePercent: field.nullablePercent,
      role: "rate",
      additivity: "non_additive",
      defaultAggregation: "recompute",
      confidence: 0.95,
      reason: "Normalized rate or ratio. Must be recomputed from numerator and denominator, never averaged directly.",
      guardrail: "NON-ADDITIVE: Never average percentages across rows; recompute using sum(numerator) / sum(denominator)."
    };
  }

  // 6. Prices & Unit Rates (NON-ADDITIVE)
  const priceTokens = ["price", "mrp", "unit price", "rate per", "cost per", "fare", "fee per"];
  const isPriceMatch = priceTokens.some(t => t.includes(" ") ? normName.includes(t) : tokens.has(t));
  if (isPriceMatch) {
    return {
      name: field.name,
      inferredType: field.type,
      distinctCount: field.distinctCount,
      nullablePercent: field.nullablePercent,
      role: "measure",
      additivity: "non_additive",
      defaultAggregation: "weighted_avg",
      confidence: 0.94,
      reason: "Unit price or per-item rate. Non-additive across transactions; aggregate using weighted average (value / units) or median.",
      guardrail: "NON-ADDITIVE: Never SUM unit prices or rates; calculate weighted average (total value / total units) or display median/distribution."
    };
  }

  // 7. Ratings & Scores (NON-ADDITIVE)
  const ratingTokens = ["rating", "score", "csat", "nps", "stars", "points", "grade"];
  const isRatingMatch = ratingTokens.some(t => tokens.has(t) || normName.includes(t));
  if (isRatingMatch) {
    return {
      name: field.name,
      inferredType: field.type,
      distinctCount: field.distinctCount,
      nullablePercent: field.nullablePercent,
      role: "measure",
      additivity: "non_additive",
      defaultAggregation: "avg",
      confidence: 0.92,
      reason: "Evaluative rating or ordinal score. Non-additive; summarize with average or median with score distribution.",
      guardrail: "NON-ADDITIVE: Do not sum ratings; report mean score, response count, and score breakdown."
    };
  }

  // 8. Durations, Times, Distances, Ages (NON-ADDITIVE)
  const durationTokens = ["duration", "seconds", "minutes", "hours", "days", "wait", "handle", "hold", "elapsed", "lead time", "distance", "km", "miles", "age", "mttr", "latency"];
  const isDurationMatch = durationTokens.some(t => t.includes(" ") ? normName.includes(t) : tokens.has(t));
  if (isDurationMatch) {
    return {
      name: field.name,
      inferredType: field.type,
      distinctCount: field.distinctCount,
      nullablePercent: field.nullablePercent,
      role: "measure",
      additivity: "non_additive",
      defaultAggregation: "avg",
      confidence: 0.92,
      reason: "Continuous duration, distance, or age measure with potential positive skew.",
      guardrail: "NON-ADDITIVE: Prefer median over mean for skewed durations/distances; do not sum across records by default."
    };
  }

  // 9. Point-in-time Snapshot / Balances
  const snapshotTokens = ["stock", "inventory", "balance", "opening", "closing", "headcount", "backlog", "in hand"];
  const isSnapshotMatch = snapshotTokens.some(t => t.includes(" ") ? normName.includes(t) : tokens.has(t));
  if (isSnapshotMatch) {
    return {
      name: field.name,
      inferredType: field.type,
      distinctCount: field.distinctCount,
      nullablePercent: field.nullablePercent,
      role: "measure",
      additivity: "snapshot",
      defaultAggregation: "latest",
      confidence: 0.91,
      reason: "Point-in-time inventory or state snapshot balance.",
      guardrail: "SNAPSHOT: Never sum across time periods; report latest value, period-end level, or average level."
    };
  }

  if (numeric && field.type !== "currency" && (field.distinctCount ?? 99) <= 6) {
    return {
      name: field.name,
      inferredType: field.type,
      distinctCount: field.distinctCount,
      nullablePercent: field.nullablePercent,
      role: "dimension",
      additivity: "none",
      defaultAggregation: "none",
      confidence: 0.6,
      reason: "Few distinct numeric values; likely a descriptor rather than an additive measure.",
      guardrail: "Confirm whether this numeric field is a category, flag, or genuinely additive quantity before summing it."
    };
  }

  // 10. Additive Quantities and Monetary Values
  const additiveTokens = ["units", "qty", "quantity", "count", "volume", "total", "amount", "revenue", "sales", "cost", "spend", "margin", "profit", "value", "delivered", "ordered", "calls", "tickets", "orders", "records", "clicks"];
  const isAdditiveMatch = additiveTokens.some(t => tokens.has(t) || normName.includes(t));
  if (numeric && (isAdditiveMatch || ["currency", "number"].includes(field.type))) {
    return {
      name: field.name,
      inferredType: field.type,
      distinctCount: field.distinctCount,
      nullablePercent: field.nullablePercent,
      role: "measure",
      additivity: "additive",
      defaultAggregation: "sum",
      confidence: 0.93,
      reason: "Additive numeric quantity or currency amount representing transaction volume or value.",
      guardrail: "Summable within consistent scope; verify source currency or units before formatting."
    };
  }

  // 11. Categorical Dimension
  if (["category", "text"].includes(field.type) || (field.distinctCount && field.distinctCount < 100)) {
    return {
      name: field.name,
      inferredType: field.type,
      distinctCount: field.distinctCount,
      nullablePercent: field.nullablePercent,
      role: "dimension",
      additivity: "none",
      defaultAggregation: "none",
      confidence: 0.89,
      reason: "Categorical attribute suitable for grouping, filtering, or breakdown comparisons.",
      guardrail: "Handle high cardinality by capping to top N and grouping long tail into 'Other'."
    };
  }

  // 12. Fallback Unknown
  return {
    name: field.name,
    inferredType: field.type,
    distinctCount: field.distinctCount,
    nullablePercent: field.nullablePercent,
    role: "unknown",
    additivity: "none",
    defaultAggregation: "none",
    confidence: 0.50,
    reason: "Ambiguous role from column metadata alone; inspect distinct values locally.",
    guardrail: "Confirm business definition before relying on this field for primary KPIs."
  };
}

export function buildDashboardBlueprint(input: {
  datasetLabel?: string;
  businessQuestion?: string;
  audience?: string;
  rowCount?: number;
  fields: DashboardFieldInput[];
}) {
  const allowedInputKeys = new Set(['datasetLabel', 'businessQuestion', 'audience', 'rowCount', 'fields', 'credit', 'brand']);
  const allowedFieldKeys = new Set(['name', 'type', 'distinctCount', 'nullablePercent', 'numericSummary', 'dateRange']);
  const allowedNumericKeys = new Set(['min', 'max', 'mean']);
  const allowedDateKeys = new Set(['min', 'max']);

  for (const k of Object.keys(input || {})) {
    if (!allowedInputKeys.has(k)) {
      throw new Error(`Input contains unknown or disallowed keys: '${k}'. Only aggregate column metadata is accepted.`);
    }
  }

  if (!input || !Array.isArray(input.fields)) {
    throw new Error("Input must provide a 'fields' array.");
  }

  for (const field of input.fields) {
    if (typeof field !== 'object' || field === null) {
      throw new Error("Each field must be an object.");
    }
    for (const fk of Object.keys(field)) {
      if (!allowedFieldKeys.has(fk)) {
        throw new Error(`Input contains unknown or disallowed keys: field '${fk}'. Never send dataset rows or sample values.`);
      }
    }
    if (field.numericSummary && typeof field.numericSummary === 'object') {
      for (const nk of Object.keys(field.numericSummary)) {
        if (!allowedNumericKeys.has(nk)) {
          throw new Error(`Input contains unknown or disallowed keys: numericSummary '${nk}'.`);
        }
      }
    }
    if (field.dateRange && typeof field.dateRange === 'object') {
      for (const dk of Object.keys(field.dateRange)) {
        if (!allowedDateKeys.has(dk)) {
          throw new Error(`Input contains unknown or disallowed keys: dateRange '${dk}'.`);
        }
      }
    }
  }

  const classified = input.fields.map(f => classifyField(f, input.rowCount));

  const timeFields = classified.filter(f => f.role === "time").map(f => f.name);
  const idFields = classified.filter(f => f.role === "identifier").map(f => f.name);
  const statusFields = classified.filter(f => f.role === "status").map(f => f.name);
  const reasonFields = classified.filter(f => f.role === "reason").map(f => f.name);
  const dimensionFields = classified.filter(f => f.role === "dimension").map(f => f.name);
  const additiveMeasures = classified.filter(f => f.role === "measure" && f.additivity === "additive").map(f => f.name);
  const nonAdditiveMeasures = classified.filter(f => f.role === "measure" && f.additivity === "non_additive");
  const rateFields = classified.filter(f => f.role === "rate").map(f => f.name);
  const unknownFields = classified.filter(f => f.role === "unknown").map(f => f.name);
  const ambiguousNumericDimensions = classified.filter(f => f.role === "dimension" && ["number", "percentage"].includes(f.inferredType) && f.confidence === 0.6).map(f => f.name);

  // Grain Determination
  let grainGuess = "Single transaction record per row";
  if (idFields.length) {
    const primaryId = classified.find(f => f.role === "identifier");
    if (primaryId && input.rowCount && primaryId.distinctCount === input.rowCount) {
      grainGuess = `One row per individual ${primaryId.name.replace(/_?(id|code|number)$/i, '') || 'transaction'} (verified unique)`;
    } else if (primaryId) {
      grainGuess = `One row per ${primaryId.name.replace(/_?(id|code|number)$/i, '') || 'event'} grain`;
    }
  }

  // Ratios detection (explicit numerator and denominator)
  const ratios: { name: string; formula: string; numerator: string; denominator: string; guardrail: string }[] = [];
  
  // Units fulfillment ratio
  const orderedUnits = additiveMeasures.find(m => /order.*(unit|qty)/i.test(m));
  const deliveredUnits = additiveMeasures.find(m => /deliver.*(unit|qty)/i.test(m));
  if (orderedUnits && deliveredUnits) {
    ratios.push({
      name: "Unit Fulfilment Rate",
      formula: `SUM(${deliveredUnits}) / SUM(${orderedUnits})`,
      numerator: deliveredUnits,
      denominator: orderedUnits,
      guardrail: "Weight by ordered units; never average the row percentages."
    });
  }

  // Value fulfillment ratio
  const orderedVal = additiveMeasures.find(m => /ordered.*(val|amount)/i.test(m));
  const deliveredVal = additiveMeasures.find(m => /delivered.*(val|amount)/i.test(m));
  if (orderedVal && deliveredVal) {
    ratios.push({
      name: "Value Fulfillment Rate",
      formula: `SUM(${deliveredVal}) / SUM(${orderedVal})`,
      numerator: deliveredVal,
      denominator: orderedVal,
      guardrail: "Weight by ordered value; never average individual order rates."
    });
  }

  // Realized Unit Price
  const valueField = additiveMeasures.find(m => /value|revenue|sales|amount/i.test(m));
  const unitsField = additiveMeasures.find(m => /unit|qty|quantity/i.test(m));
  if (valueField && unitsField) {
    ratios.push({
      name: "Effective Realized Unit Price",
      formula: `SUM(${valueField}) / SUM(${unitsField})`,
      numerator: valueField,
      denominator: unitsField,
      guardrail: "Weighted average unit price across fulfilled volume."
    });
  }

  // SLA or Breach ratio
  const breachField = statusFields.find(s => /breach|fail|defect|miss/i.test(s));
  if (breachField) {
    ratios.push({
      name: "SLA Compliance Rate",
      formula: `(COUNT(rows) - COUNT(${breachField} = TRUE)) / COUNT(rows)`,
      numerator: `Eligible rows meeting target`,
      denominator: `Total eligible rows`,
      guardrail: "Confirm whether canceled or abandoned tickets are included in the denominator."
    });
  }

  // Metric Recipes
  const metricRecipes = [
    {
      name: "Total Volume",
      formula: "COUNT(rows) within active filters and date range",
      requiredFields: [],
      aggregation: "count",
      guardrail: "Represents row count. Do not imply unique individuals unless validated against an identifier."
    },
    ...idFields.map(id => ({
      name: `Distinct ${id}`,
      formula: `COUNT_DISTINCT(${id}) within filtered scope`,
      requiredFields: [id],
      aggregation: "count_distinct",
      guardrail: "Confirm whether field is unique transaction ID or repeating customer/entity ID."
    })),
    ...additiveMeasures.map(measure => ({
      name: `Total ${measure}`,
      formula: `SUM(${measure})`,
      requiredFields: [measure],
      aggregation: "sum",
      guardrail: "Additive metric. Preserve source currency symbol and scale appropriately (K, M, L, Cr)."
    })),
    ...nonAdditiveMeasures.map(item => ({
      name: item.defaultAggregation === "weighted_avg" ? `Weighted ${item.name}` : `Typical ${item.name}`,
      formula: item.defaultAggregation === "weighted_avg"
        ? (valueField && unitsField ? `SUM(${valueField}) / SUM(${unitsField})` : `WEIGHTED_AVG(${item.name})`)
        : `${item.defaultAggregation.toUpperCase()}(${item.name})`,
      requiredFields: [item.name],
      aggregation: item.defaultAggregation,
      guardrail: item.guardrail || "NON-ADDITIVE: Do not sum directly."
    })),
    ...statusFields.map(status => ({
      name: `${status} Distribution & Share`,
      formula: `COUNT(rows) and share (%) grouped by ${status}`,
      requiredFields: [status],
      aggregation: "count",
      guardrail: "State the denominator clearly and keep missing/none categories visible."
    }))
  ];

  // Chart Plan
  const chartPlan = [];
  const primaryMeasures = [...additiveMeasures, ...nonAdditiveMeasures.map(m => m.name)];
  if (timeFields.length) {
    chartPlan.push({
      question: "How does operational volume and performance trend over time?",
      chart: "Procedural SVG Line / Time-Series Chart",
      fields: [timeFields[0], ...primaryMeasures.slice(0, 2)],
      condition: "Aggregate by consistent calendar buckets (e.g. day or week) and provide interactive hover probes (#chartTooltip)."
    });
  }
  if (dimensionFields.length || statusFields.length) {
    const dim = dimensionFields[0] || statusFields[0];
    chartPlan.push({
      question: "Which categories, channels, or queues represent the largest volume or exception share?",
      chart: "Sorted Horizontal Comparison Bar Chart (.hbar-row)",
      fields: [dim, ...primaryMeasures.slice(0, 1)],
      condition: "Order bars in descending order; format values cleanly with counts and percentages."
    });
  }
  if (timeFields.length && (dimensionFields.length || statusFields.length)) {
    chartPlan.push({
      question: "Where are temporal bottlenecks or load concentrations occurring?",
      chart: "Heatmap Matrix (.heatmap-grid)",
      fields: [timeFields[0], (dimensionFields[0] || statusFields[0])],
      condition: "Use intensity scale to highlight peak operational windows."
    });
  }
  if (idFields.length) {
    chartPlan.push({
      question: "Which individual records or exceptions require investigation?",
      chart: "Searchable Detail Data Table with Slide Drawer (.data-table + .slide-drawer)",
      fields: [idFields[0], ...(timeFields.slice(0, 1)), ...(statusFields.slice(0, 1)), ...primaryMeasures.slice(0, 2)],
      condition: "Make rows clickable to slide open transaction detail drawer."
    });
  }

  // Local Suggested Checks
  const suggestedChecks = [
    "Verify null percentages on key fields to avoid misleading visual shares.",
    "Confirm date coverage is complete with no hidden time gaps or missing days.",
  ];
  if (orderedUnits && deliveredUnits) suggestedChecks.push(`Verify delivered units (${deliveredUnits}) <= ordered units (${orderedUnits}) on all valid records.`);
  if (orderedVal && deliveredVal) suggestedChecks.push(`Verify delivered value (${deliveredVal}) <= ordered value (${orderedVal}) on all normal records.`);

  // Ask User Questions (max 3)
  const askUser: string[] = [];
  if (unknownFields.length) {
    askUser.push(`What is the operational meaning and preferred aggregation for column(s): ${unknownFields.slice(0, 3).join(", ")}?`);
  }
  if (ambiguousNumericDimensions.length && askUser.length < 3) {
    askUser.push(`Are low-cardinality numeric field(s) ${ambiguousNumericDimensions.slice(0, 3).join(", ")} category labels, flags, or additive measures?`);
  }
  if (!input.businessQuestion) {
    askUser.push("What primary decision or operational question should this dashboard answer for executives?");
  }
  if (!timeFields.length) {
    askUser.push("No explicit date column was detected; would you like to view this as a snapshot comparison or ordinal sequence?");
  }

  return {
    blueprintVersion: "2.0",
    datasetLabel: input.datasetLabel || "Uploaded Dataset",
    datasetSummary: {
      grainGuess,
      primaryMeasures,
      dimensions: dimensionFields,
      timeField: timeFields[0] || null,
      rowCount: input.rowCount
    },
    grainGuess,
    primaryMeasures,
    dimensions: dimensionFields,
    timeField: timeFields[0] || null,
    ratios,
    fields: classified,
    fieldMappings: classified,
    metricRecipes,
    chartPlan,
    suggestedChecks,
    suggestedViews: {
      tab1: "Executive Overview: 1-screen balanced workspace (.workspace / .overview-split) with KPI cards, health bar, and generated operational briefing.",
      tab2: timeFields.length ? "Trends & Time-Series: Interactive SVG charts with hover probes and period drilldown drawers." : "Rankings & Distributions: Sorted horizontal progress bars and category breakdown.",
      tab3: idFields.length ? "Record Explorer & Diagnostics: Searchable data table with slide drawer inspection." : "Segment Matrix & Deep Dive."
    },
    askUser: askUser.slice(0, 3),
    privacy: "Strict metadata-only profile. No dataset rows, cell values, or sample data were sent or stored."
  };
}
