// Regression checks for the Add Workshop insurer autocomplete.
const fs = require('fs');
const path = require('path');
const core = fs.readFileSync(path.join(__dirname, '..', 'core-v4.js'), 'utf8');
const insurers = fs.readFileSync(path.join(__dirname, '..', 'data', 'data-insurers.js'), 'utf8');

if (!core.includes("function(){ return window.GF_DATA.insurers; }") &&
    !core.includes("window.GF_DATA && Array.isArray(window.GF_DATA.insurers)")) {
  throw new Error('Insurer autocomplete must read the insurer dataset');
}
if (!core.includes("attachSuggest(document.getElementById('gfIns')")) {
  throw new Error('Add Workshop insurer field is not wired to autocomplete');
}
if (!core.includes("aria-autocomplete', 'list'")) {
  throw new Error('Insurer autocomplete accessibility attribute is missing');
}
if (!/const\s+insurerData\s*=\s*\[/.test(insurers)) {
  throw new Error('Insurer dataset is missing');
}
console.log('Insurer autocomplete regression test passed');
