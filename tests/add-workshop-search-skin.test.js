const fs = require('fs');
const path = require('path');
const core = fs.readFileSync(path.join(__dirname, '..', 'core-v4.js'), 'utf8');
const css = fs.readFileSync(path.join(__dirname, '..', 'css', 'shared.css'), 'utf8');

if (!core.includes("wrap.className = 'gf-sugg gf-add-sugg'")) {
  throw new Error('Add-workshop suggestions must use the homepage search skin');
}
if (!core.includes("button.className = 'gf-sugg-row gf-sugg-item'")) {
  throw new Error('Suggestion rows must use the homepage search row skin');
}
if (!css.includes('#gfAdd .gf-add-sugg')) {
  throw new Error('Add-workshop positioning override missing');
}
if (!css.includes('top:calc(100% + 6px)')) {
  throw new Error('Add-workshop suggestions must remain positioned below the field');
}
console.log('Add-workshop search-skin test passed');
