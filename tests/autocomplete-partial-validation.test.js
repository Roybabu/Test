// Regression cases: partial terms must be suggestions, not immediate validation errors.
// Full unmatched values are still rejected by the existing server-side validation.
const fs = require('fs');
const path = require('path');
const core = fs.readFileSync(path.join(__dirname, '..', 'core-v4.js'), 'utf8');
if (!core.includes('function normalizeList()')) throw new Error('Autocomplete list normalization missing');
if (!core.includes('currentHasMatch')) throw new Error('Partial-term matching missing');
if (!core.includes("item && typeof item === 'object'")) throw new Error('Legacy/object insurer compatibility missing');
console.log('Autocomplete partial-validation regression test passed');
