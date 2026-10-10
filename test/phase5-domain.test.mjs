import test from 'node:test';
import assert from 'node:assert/strict';
import { loadTsModule } from './utils.mjs';

const dp = loadTsModule('src/lib/domain-packs.ts');
const sc = loadTsModule('src/lib/shell-contract.ts');

test('Phase 5: Generic pack contains zero banned domain words', () => {
  const genericPack = dp.getDomainPack('generic');
  const serialized = JSON.stringify(genericPack.labels).toLowerCase();

  const bannedWords = ['gos', 'agent', 'hourly', 'sla', 'breach', 'abandon'];
  for (const word of bannedWords) {
    // Check for whole word match
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    assert.ok(!regex.test(serialized), `Generic pack must not contain banned word: "${word}"`);
  }
});

test('Phase 5: Service-ops pack reproduces operational service desk copy', () => {
  const servicePack = dp.getDomainPack('service-ops');
  assert.equal(servicePack.labels.periodTitle, 'Date Detail');
  assert.equal(servicePack.labels.rcTitle, 'Root Cause Breakdown');
  assert.ok(servicePack.labels.kpiChips.some(c => c.label.includes('Compliance')));
});

test('Phase 5: Sales-distribution pack contains fulfillment terminology', () => {
  const salesPack = dp.getDomainPack('sales-distribution');
  assert.equal(salesPack.labels.periodTitle, 'Order Fulfillment Detail');
  assert.ok(salesPack.labels.kpiChips.some(c => c.label.includes('Orders')));
  assert.ok(salesPack.labels.kpiChips.some(c => c.label.includes('On-Time')));
});

test('Phase 5: CSS aliases exist in shell-contract for backwards compatibility', () => {
  const css = sc.getCompleteStylesheet();
  
  assert.ok(css.includes('.period-drawer') && css.includes('.day-drawer'), 'Must support .period-drawer alias');
  assert.ok(css.includes('.entity-pill') && css.includes('.clickable-agent-pill'), 'Must support .entity-pill alias');
  assert.ok(css.includes('.bucket-chart') && css.includes('.hourly-gos-chart'), 'Must support .bucket-chart alias');
  assert.ok(css.includes('.progress-wrap') && css.includes('.cum-gos-wrap'), 'Must support .progress-wrap alias');
});
