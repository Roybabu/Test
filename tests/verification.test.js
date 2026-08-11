const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.join(__dirname, '..');
const files = [
  path.join(root, 'data', 'data-agency.js'),
  path.join(root, 'data', 'data-nonagency.js')
];

const statuses = new Set(['verified', 'outdated', 'review']);
let count = 0;
const ids = new Set();

for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  const objects = text.match(/\{\s*\n\s*id:\s*"ws_[a-f0-9]{8}",.*?\n\s*\}/gs) || [];
  for (const obj of objects) {
    const id = (obj.match(/\bid:\s*"(ws_[a-f0-9]{8})"/) || [])[1];
    assert(id, `missing stable workshop id in ${file}`);
    assert(!ids.has(id), `duplicate workshop id ${id}`);
    ids.add(id);
    for (const field of ['lastVerified', 'verificationStatus', 'source']) {
      assert(new RegExp(`\\b${field}:`).test(obj), `${id} missing ${field}`);
    }
    const status = (obj.match(/\bverificationStatus:\s*"([^"]+)"/) || [])[1];
    assert(statuses.has(status), `${id} has invalid verification status ${status}`);
    const date = (obj.match(/\blastVerified:\s*"([^"]*)"/) || [])[1];
    assert(/^$|^\d{4}-\d{2}-\d{2}$/.test(date), `${id} has invalid lastVerified ${date}`);
    const source = (obj.match(/\bsource:\s*"([^"]*)"/) || [])[1];
    assert(source && source.trim(), `${id} has empty source`);
    count++;
  }
}

const registry = JSON.parse(fs.readFileSync(path.join(root, 'data', 'workshop-verification.json'), 'utf8'));
assert.strictEqual(Object.keys(registry).length, count, 'verification registry must cover every workshop');
for (const id of ids) {
  assert(registry[id], `registry missing ${id}`);
  assert(statuses.has(registry[id].verificationStatus), `${id} registry has invalid status`);
}

const php = fs.readFileSync(path.join(root, 'submit.php'), 'utf8');
assert(php.includes("'verification-list'"), 'PHP must expose verification-list');
assert(php.includes("'verification'"), 'PHP must expose verification action');
assert(php.includes("['verified','outdated','review']") || php.includes("['verified', 'outdated', 'review']"), 'PHP must validate verification statuses');

console.log(`verification metadata tests passed: ${count} workshops`);
