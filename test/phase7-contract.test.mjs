import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadTsModule } from './utils.mjs';

const kit = loadTsModule('src/lib/dashboard-kit.ts');

test('Phase 7: tools.manifest.json is well-formed and lists all tools', () => {
  const raw = readFileSync('src/lib/tools.manifest.json', 'utf8');
  const manifest = JSON.parse(raw);
  
  assert.equal(manifest.version, '2.0.0');
  assert.ok(Array.isArray(manifest.tools), 'Manifest must contain tools array');
  assert.equal(manifest.tools.length, 12, 'Manifest must declare exactly 12 tools');

  const names = manifest.tools.map(t => t.name);
  assert.ok(names.includes('get_dashboard_creation_workflow'));
  assert.ok(names.includes('build_dashboard_blueprint'));
  assert.ok(names.includes('get_dashboard_kit'));
  assert.ok(names.includes('get_version'));
  assert.ok(names.includes('get_shell_preservation_spec'));
  assert.ok(names.includes('get_data_insight_playbook'));
  assert.ok(names.includes('get_dashboard_composition_playbook'));
  assert.ok(names.includes('get_dashboard_interaction_playbook'));
  assert.ok(names.includes('get_dashboard_completion_checklist'));
  assert.ok(names.includes('get_full_dashboard_template'));
  assert.ok(names.includes('get_component_patterns'));
  assert.ok(names.includes('get_js_utilities'));
});

test('Phase 7: route.ts registers every tool declared in manifest', () => {
  const routeSrc = readFileSync('src/app/api/mcp/route.ts', 'utf8');
  const manifest = JSON.parse(readFileSync('src/lib/tools.manifest.json', 'utf8'));

  for (const tool of manifest.tools) {
    const registrationPattern = `registerTool(\n    "${tool.name}"` ;
    const alternatePattern = `"${tool.name}",`;
    assert.ok(
      routeSrc.includes(`"${tool.name}"`),
      `route.ts must register tool: "${tool.name}"`
    );
  }
});

test('Phase 7: README.md lists every tool from manifest', () => {
  const readmeSrc = readFileSync('README.md', 'utf8');
  const manifest = JSON.parse(readFileSync('src/lib/tools.manifest.json', 'utf8'));

  for (const tool of manifest.tools) {
    assert.ok(
      readmeSrc.includes(`\`${tool.name}`),
      `README.md must document tool: "${tool.name}"`
    );
  }
});

test('Phase 7: get_dashboard_kit CLI mode is under 10 KB', () => {
  const cliOutput = kit.buildDashboardKit({ mode: 'cli', domain: 'generic' });
  assert.equal(cliOutput.mode, 'cli');
  assert.ok(cliOutput.cli.commands.init.includes('npx dashlint-kit init'));
  
  const serialized = JSON.stringify(cliOutput);
  const sizeBytes = Buffer.byteLength(serialized, 'utf8');
  assert.ok(sizeBytes < 10 * 1024, `CLI response must be under 10 KB, was ${sizeBytes} bytes`);
});

test('Phase 7: get_dashboard_kit inline mode returns within byte budget', () => {
  const inlineOutput = kit.buildDashboardKit({
    mode: 'inline',
    components: ['kpiCards', 'panels', 'horizontalBars', 'dataTables', 'validation', 'badges', 'buttons', 'generatedOutput', 'multiSelectFilter'],
  });
  
  assert.equal(inlineOutput.mode, 'inline');
  assert.ok(inlineOutput.inline.wireframe.includes('<!-- dashlint-kit v2.0.0 -->'));
  assert.equal(inlineOutput.inline.budget.status, 'within_budget');
  assert.ok(inlineOutput.inline.budget.totalKb <= 35, `Inline response exceeded budget: ${inlineOutput.inline.budget.totalKb} KB`);
});
