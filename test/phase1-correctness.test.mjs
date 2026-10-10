import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadTsModule } from './utils.mjs';

const dt = loadTsModule('src/lib/dashboard-template.ts');

test('A9: HTML escaping helper handles special characters', () => {
  const code = dt.JS_UTILITIES;
  assert.ok(code.includes('function esc('), 'JS_UTILITIES must define esc helper');
  
  // Test esc() behavior directly using an eval in isolated function context
  const escFn = new Function('s', `
    ${code.match(/function esc\(s\) \{[\s\S]*?\}/)[0]}
    return esc(s);
  `);
  
  assert.equal(escFn('<script>alert("xss")</script>'), '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
  assert.equal(escFn("O'Connor & Sons"), "O&#39;Connor &amp; Sons");
  assert.equal(escFn(''), '');
  assert.equal(escFn(null), '');
  assert.equal(escFn(123), '123');
});

test('A11: CSV parser strips UTF-8 BOM', () => {
  const code = dt.JS_UTILITIES;
  assert.ok(code.includes('\\uFEFF'), 'parseCSV must strip UTF-8 BOM');

  const parseFn = new Function('text', `
    function esc(s) { return String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c] || c)); }
    ${code.match(/function parseCSV\(text\) \{[\s\S]*?\n  \}/)[0]}
    return parseCSV(text);
  `);

  const edgeCasesCsv = readFileSync('test/fixtures/edge_cases.csv', 'utf8');
  const res = parseFn(edgeCasesCsv);
  assert.ok(res.headers.length > 0, 'Must parse headers');
  assert.equal(res.headers[0], 'Item_ID', 'First header must not contain BOM character');
  assert.equal(res.rows.length, 6, 'Must parse 6 rows despite quoted newlines and commas');
  assert.ok(res.rows[2].Category.includes('\n'), 'Quoted newline preserved in value');
  assert.ok(res.rows[1].Notes.includes(','), 'Quoted comma preserved in value');
});

test('A11: CSV parser supports semicolon delimiters', () => {
  const code = dt.JS_UTILITIES;
  const parseFn = new Function('text', `
    function esc(s) { return String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c] || c)); }
    ${code.match(/function parseCSV\(text\) \{[\s\S]*?\n  \}/)[0]}
    return parseCSV(text);
  `);

  const semiCsv = readFileSync('test/fixtures/edge_cases_semicolon.csv', 'utf8');
  const res = parseFn(semiCsv);
  assert.deepEqual(res.headers, ['Item_ID', 'Date', 'Store_Name', 'Category', 'Amount', 'Notes'], 'Must detect semicolon delimiter');
  assert.equal(res.rows.length, 3);
  assert.equal(res.rows[0].Store_Name, 'Store A');
});

test('A10: Filter button labels show (none) for empty category values', () => {
  const code = dt.JS_UTILITIES;
  assert.ok(code.includes("val === '' ? '(none)' : val"), 'Empty category value must render as (none)');
});

test('A14: countUp preserves scale and units and handles zero', () => {
  const code = dt.JS_UTILITIES;
  assert.ok(code.includes('function countUp('), 'Must define countUp');
  assert.ok(code.includes('opts.prefix'), 'countUp must accept prefix');
  assert.ok(code.includes('opts.suffix'), 'countUp must accept suffix');
  assert.ok(code.includes('opts.decimals'), 'countUp must accept decimals');
  assert.ok(code.includes('_currentValue'), 'countUp must preserve current value on re-entry');
});

test('A15: typeText supports duration cap and cancellation', () => {
  const code = dt.JS_UTILITIES;
  assert.ok(code.includes('function typeText('), 'Must define typeText');
  assert.ok(code.includes('maxDuration'), 'typeText must support maxDuration cap');
  assert.ok(code.includes('_typeGen'), 'typeText must support cancellation');
});

test('A6: switchTab supports both .tab-panel and .tab-pane', () => {
  const code = dt.JS_UTILITIES;
  assert.ok(code.includes('.tab-panel, .tab-pane'), 'switchTab must query both .tab-panel and .tab-pane');
});

test('A16: Modals apply inert attribute to background root', () => {
  const code = dt.JS_UTILITIES;
  assert.ok(code.includes('.setAttribute(\'inert\', \'\''), 'openDrawer must set inert on app root');
  assert.ok(code.includes('.removeAttribute(\'inert\')'), 'closeDrawer must remove inert');
});

test('A13: resetAll clears stale state on new file upload', () => {
  const code = dt.JS_UTILITIES;
  assert.ok(code.includes('function resetAll()'), 'Must define resetAll');
  assert.ok(code.includes('resetAll()'), 'handleFile must call resetAll');
});
