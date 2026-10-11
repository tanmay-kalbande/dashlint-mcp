import test from 'node:test';
import assert from 'node:assert/strict';
import { loadTsModule } from './utils.mjs';

const bp = loadTsModule('src/lib/blueprint.ts');

test('Phase 4: Blueprint v2 classifies sales_distribution fields correctly', () => {
  const input = {
    datasetLabel: 'Sales & Distribution Log',
    businessQuestion: 'What is our order fulfillment rate and where are delivery bottlenecks occurring?',
    rowCount: 500,
    fields: [
      { name: 'order_id', type: 'identifier', distinctCount: 500, nullablePercent: 0 },
      { name: 'order_date', type: 'date', distinctCount: 90, nullablePercent: 0 },
      { name: 'customer_name', type: 'text', distinctCount: 42, nullablePercent: 0 },
      { name: 'hub_location', type: 'category', distinctCount: 8, nullablePercent: 0 },
      { name: 'order_qty', type: 'number', distinctCount: 150, nullablePercent: 0 },
      { name: 'gross_amount', type: 'currency', distinctCount: 380, nullablePercent: 0 },
      { name: 'net_unit_price', type: 'currency', distinctCount: 85, nullablePercent: 0 },
      { name: 'delivered_qty', type: 'number', distinctCount: 140, nullablePercent: 0 },
      { name: 'fulfilment_percent', type: 'percentage', distinctCount: 45, nullablePercent: 0 },
      { name: 'delivery_status', type: 'category', distinctCount: 4, nullablePercent: 0 },
      { name: 'delivery_issue_reason', type: 'category', distinctCount: 6, nullablePercent: 62 },
      { name: 'delivery_duration_hours', type: 'number', distinctCount: 35, nullablePercent: 0 },
      { name: 'customer_rating', type: 'number', distinctCount: 5, nullablePercent: 12 },
      { name: 'Estimated_Product_Cost_INR', type: 'currency', distinctCount: 485, nullablePercent: 0 },
      { name: 'Gross_Margin_INR', type: 'currency', distinctCount: 481, nullablePercent: 0 },
      { name: 'Delivery_Days', type: 'number', distinctCount: 28, nullablePercent: 0 },
      { name: 'Delivery_On_Time', type: 'boolean', distinctCount: 2, nullablePercent: 0 },
      { name: 'Sales_Route', type: 'category', distinctCount: 5, nullablePercent: 0 },
      { name: 'Pack_Weight_KG', type: 'number', distinctCount: 3, nullablePercent: 0 },
    ],
  };

  const plan = bp.buildDashboardBlueprint(input);

  assert.ok(plan.fields && plan.fields.length === input.fields.length, 'All fields analyzed');

  // Verify role classifications
  const byName = Object.fromEntries(plan.fields.map(f => [f.name, f]));
  
  assert.equal(byName.order_id.role, 'identifier');
  assert.equal(byName.order_id.defaultAggregation, 'count_distinct');

  assert.equal(byName.order_date.role, 'time');

  assert.equal(byName.order_qty.role, 'measure');
  assert.equal(byName.order_qty.additivity, 'additive');
  assert.equal(byName.order_qty.defaultAggregation, 'sum');

  // CRITICAL SAFEGUARDS: Prices and rates must NEVER be sum!
  assert.equal(byName.net_unit_price.role, 'measure');
  assert.equal(byName.net_unit_price.additivity, 'non_additive');
  assert.notEqual(byName.net_unit_price.defaultAggregation, 'sum', 'Price must NEVER be summed');
  assert.equal(byName.net_unit_price.defaultAggregation, 'weighted_avg');

  assert.equal(byName.fulfilment_percent.role, 'rate');
  assert.equal(byName.fulfilment_percent.additivity, 'non_additive');
  assert.notEqual(byName.fulfilment_percent.defaultAggregation, 'sum', 'Percentage must NEVER be summed');

  assert.equal(byName.customer_rating.role, 'measure');
  assert.equal(byName.customer_rating.additivity, 'non_additive');
  assert.equal(byName.customer_rating.defaultAggregation, 'avg', 'Rating must default to avg, never sum');

  assert.equal(byName.Estimated_Product_Cost_INR.role, 'measure');
  assert.equal(byName.Estimated_Product_Cost_INR.additivity, 'additive');
  assert.equal(byName.Gross_Margin_INR.role, 'measure');
  assert.equal(byName.Gross_Margin_INR.additivity, 'additive');
  assert.equal(byName.Delivery_Days.role, 'measure');
  assert.equal(byName.Delivery_On_Time.role, 'status');
  assert.equal(byName.Sales_Route.role, 'dimension');
  assert.equal(byName.Pack_Weight_KG.role, 'dimension');

  assert.equal(byName.delivery_duration_hours.role, 'measure');
  assert.equal(byName.delivery_duration_hours.additivity, 'non_additive');
  assert.equal(byName.delivery_duration_hours.defaultAggregation, 'avg', 'Duration must default to avg, never sum');

  // Verify dataset-level outputs
  assert.ok(plan.datasetSummary.grainGuess, 'Must emit grain guess');
  assert.ok(plan.datasetSummary.grainGuess.toLowerCase().includes('order'), 'Grain guess mentions order');
  assert.ok(plan.ratios.length > 0, 'Must propose ratio formulas');
  
  // Propose ratio with explicit numerator & denominator
  const fulfillmentRatio = plan.ratios.find(r => r.name.toLowerCase().includes('fulfilment') || r.name.toLowerCase().includes('delivered'));
  assert.ok(fulfillmentRatio, 'Must propose fulfillment ratio');
  assert.ok(fulfillmentRatio.numerator, 'Ratio has explicit numerator');
  assert.ok(fulfillmentRatio.denominator, 'Ratio has explicit denominator');
  assert.ok(fulfillmentRatio.guardrail.includes('never average'), 'Must include non-additive guardrail');

  // Suggested local checks
  assert.ok(plan.suggestedChecks.length > 0, 'Must provide local checks');
});

test('Phase 4: Privacy enforcement — Rejects requests containing sample values or disallowed keys', () => {
  const disallowedPayload = {
    datasetLabel: 'Leak Test',
    fields: [
      {
        name: 'order_id',
        type: 'identifier',
        sampleValues: ['ORD-001', 'ORD-002'], // DISALLOWED KEY
      },
    ],
  };

  assert.throws(() => {
    bp.buildDashboardBlueprint(disallowedPayload);
  }, /unknown or disallowed keys/i);
});
