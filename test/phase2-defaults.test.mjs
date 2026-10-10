import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadTsModule } from './utils.mjs';

const dt = loadTsModule('src/lib/dashboard-template.ts');

test('F2: No 94.3% compliance fallback in openDayDrawer', () => {
  const code = dt.JS_UTILITIES;
  assert.ok(!code.includes('94.3'), 'JS_UTILITIES must never contain fabricated 94.3% compliance default');
});

test('F2: No hardcoded demo progression numbers in JS utilities', () => {
  const code = dt.JS_UTILITIES;
  assert.ok(!code.includes('[94, 91, 88, 85, 92, 95]'), 'No fabricated demo progression points');
  assert.ok(!code.includes('y80 ='), 'No hardcoded 80% target guideline in drawer');
  assert.ok(!code.includes('y60 ='), 'No hardcoded 60% target guideline in drawer');
});

test('F2: openDayDrawer hides sections when data is missing instead of fabricating values', () => {
  const code = dt.JS_UTILITIES;
  assert.ok(code.includes('progSection.style.display = \'none\''), 'Hides progression section when no curve data');
  assert.ok(code.includes('hourlySection.style.display = \'none\''), 'Hides hourly section when no hourly data');
  assert.ok(code.includes('contribSection.style.display = \'none\''), 'Hides contributors section when no contributors');
  assert.ok(code.includes('rcCard.style.display = \'none\''), 'Hides root cause card when no root cause data');
});

test('F2: Banned literal audit across source files', () => {
  const dtSrc = readFileSync('src/lib/dashboard-template.ts', 'utf8');
  const scSrc = readFileSync('src/lib/shell-contract.ts', 'utf8');

  // Verify neither file contains the fabricated 94.3% default
  assert.ok(!dtSrc.includes('94.3%'), 'dashboard-template.ts must not have 94.3% fallback');
  assert.ok(!scSrc.includes('94.3%'), 'shell-contract.ts must not have 94.3% fallback');
});
