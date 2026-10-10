import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { loadTsModule, extractJsUtilities } from './utils.mjs';

test('Phase 0: Module Loading and Fixtures Sanity', async (t) => {
  const dt = loadTsModule('src/lib/dashboard-template.ts');
  const sc = loadTsModule('src/lib/shell-contract.ts');
  const bp = loadTsModule('src/lib/blueprint.ts');
  const gg = loadTsModule('src/lib/generation-guide.ts');

  assert.ok(dt.JS_UTILITIES, 'JS_UTILITIES should exist');
  assert.ok(sc.DASHBOARD_SHELL_CONTRACT, 'DASHBOARD_SHELL_CONTRACT should exist');
  assert.ok(typeof bp.buildDashboardBlueprint === 'function', 'buildDashboardBlueprint should be a function');
  assert.ok(typeof gg.getDashboardGenerationGuide === 'function', 'getDashboardGenerationGuide should be a function');

  // Verify fixtures exist
  const salesCsv = fs.readFileSync('test/fixtures/sales_distribution.csv', 'utf8');
  assert.ok(salesCsv.split('\n').length >= 500, 'sales_distribution.csv should have >= 500 rows');

  const opsCsv = fs.readFileSync('test/fixtures/service_ops.csv', 'utf8');
  assert.ok(opsCsv.split('\n').length >= 400, 'service_ops.csv should have >= 400 rows');

  const edgeCsv = fs.readFileSync('test/fixtures/edge_cases.csv', 'utf8');
  assert.ok(edgeCsv.charCodeAt(0) === 0xFEFF, 'edge_cases.csv should have UTF-8 BOM');
});

test('Phase 0 Baseline: Identify Known CSV parser flaws', async (t) => {
  const dt = loadTsModule('src/lib/dashboard-template.ts');
  const utils = extractJsUtilities(dt.JS_UTILITIES);

  // Normal CSV without BOM should parse rows
  const normalCsv = 'A,B,C\n1,2,3\n4,5,6';
  const normalRes = utils.parseCSV(normalCsv);
  assert.equal(normalRes.columns.length, 3);
  assert.equal(normalRes.rows.length, 2);

  // Verification: BOM is stripped from first column header (Resolves flaw A11)
  const bomCsv = '\uFEFFA,B\n1,2';
  const bomRes = utils.parseCSV(bomCsv);
  assert.equal(bomRes.columns[0].charCodeAt(0), 65, 'BOM stripped from first column (Flaw A11 resolved)');

  // Verification: Semicolon separated values split correctly (Resolves flaw A11)
  const semiCsv = 'A;B;C\n1;2;3';
  const semiRes = utils.parseCSV(semiCsv);
  assert.equal(semiRes.columns.length, 3, 'Semicolon delimiters split into 3 columns (Flaw A11 resolved)');
});
