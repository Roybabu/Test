const fs = require('fs');
const path = require('path');
const core = fs.readFileSync(path.join(__dirname, '..', 'core-v4.js'), 'utf8');
const css = fs.readFileSync(path.join(__dirname, '..', 'css', 'shared.css'), 'utf8');
if (!core.includes("wrap.className = 'gf-sugg gf-add-sugg'")) throw new Error('Add-workshop autocomplete must use isolated wrapper');
if (!core.includes("'.gf-sugg-row gf-add-sugg-item'")) throw new Error('Add-workshop suggestion item selector missing');
if (!css.includes('#gfAdd .gf-add-sugg')) throw new Error('Add-workshop autocomplete CSS missing');
console.log('Add-workshop autocomplete visibility test passed');
