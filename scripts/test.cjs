'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const suites = fs.readdirSync(path.join(root, 'tests')).filter(name => name.endsWith('.cjs')).sort();
let failures = 0;
for (const suite of suites) {
  console.log('\n--- ' + suite + ' ---');
  const result = spawnSync(process.execPath, [path.join('tests', suite)], { cwd: root, stdio: 'inherit' });
  if (result.error) console.error(result.error.message);
  if (result.status !== 0) failures++;
}
console.log(`\n${suites.length - failures}/${suites.length} suites réussies.`);
process.exitCode = failures ? 1 : 0;
