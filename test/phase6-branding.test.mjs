import test from 'node:test';
import assert from 'node:assert/strict';
import { loadTsModule } from './utils.mjs';

const sc = loadTsModule('src/lib/shell-contract.ts');
const dt = loadTsModule('src/lib/dashboard-template.ts');

test('Phase 6: renderCreditMarkup handles default, none, and custom modes', () => {
  const defaultCredit = sc.renderCreditMarkup('default');
  assert.ok(defaultCredit.includes('Tanmay Kalbande'), 'Default credit mentions author');
  assert.ok(defaultCredit.includes('linkedin.com'), 'Default credit links to LinkedIn');

  const noneCredit = sc.renderCreditMarkup('none');
  assert.equal(noneCredit, '', 'None mode produces empty string');

  const customCredit = sc.renderCreditMarkup({ text: 'Built by Analytics Co', url: 'https://example.com' });
  assert.ok(customCredit.includes('Built by Analytics Co'), 'Custom text rendered');
  assert.ok(customCredit.includes('https://example.com'), 'Custom URL rendered');
});

test('Phase 6: getFullDashboardTemplate respects credit configuration', () => {
  const defaultHtml = dt.getFullDashboardTemplate();
  assert.ok(defaultHtml.includes('built by'), 'Default template includes credit');

  const noneHtml = dt.getFullDashboardTemplate({ credit: 'none' });
  assert.ok(!noneHtml.includes('Tanmay Kalbande'), 'None credit omits author credit');
  assert.ok(!noneHtml.includes('credit-link'), 'None credit omits credit link');

  const customHtml = dt.getFullDashboardTemplate({ credit: { text: 'Enterprise BI' } });
  assert.ok(customHtml.includes('Enterprise BI'), 'Custom credit text rendered in template');
});
