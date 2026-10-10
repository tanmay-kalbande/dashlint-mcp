import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import ts from 'typescript';

const nativeRequire = createRequire(import.meta.url);

export function loadTsModule(relPath) {
  let fullPath = path.resolve(relPath);
  if (!fs.existsSync(fullPath) && fs.existsSync(fullPath + '.ts')) {
    fullPath = fullPath + '.ts';
  }
  const code = fs.readFileSync(fullPath, 'utf8');
  const res = ts.transpileModule(code, { compilerOptions: { module: ts.ModuleKind.CommonJS } });
  const m = { exports: {} };
  const customRequire = (id) => {
    if (id.startsWith('@/lib/')) {
      return loadTsModule('src/lib/' + id.replace('@/lib/', '') + '.ts');
    }
    if (id.startsWith('.')) {
      const target = path.resolve(path.dirname(fullPath), id);
      return loadTsModule(target);
    }
    return nativeRequire(id);
  };
  const fn = new Function('require', 'exports', 'module', res.outputText);
  fn(customRequire, m.exports, m);
  return m.exports;
}

export function extractJsUtilities(utilitiesStr) {
  // Extract and evaluate utility functions in a sandbox environment
  const mockDOM = `
    const window = { matchMedia: () => ({ matches: false }) };
    const performance = { now: () => Date.now() };
    const requestAnimationFrame = (cb) => setTimeout(cb, 16);
    const document = {
      activeElement: null,
      getElementById: () => null,
      querySelectorAll: () => [],
      querySelector: () => null,
      createElement: (tag) => ({
        style: {},
        classList: { toggle: () => false, add: () => {}, remove: () => {} },
        addEventListener: () => {},
        appendChild: () => {},
        querySelectorAll: () => [],
        querySelector: () => null,
        dataset: {}
      }),
      addEventListener: () => {}
    };
  `;
  const code = `${mockDOM}\n${utilitiesStr}\nreturn { S, parseCSV, parseExcel, countUp, typeText, buildFilterButton, openDrawer, closeDrawer, openDayDrawer, closeDayDrawer, showChartTooltip, hideChartTooltip };`;
  const fn = new Function(code);
  return fn();
}
