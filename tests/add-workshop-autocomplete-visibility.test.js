const fs = require('fs');
const path = require('path');
const core = fs.readFileSync(path.join(__dirname, '..', 'core-v4.js'), 'utf8');
const css = fs.readFileSync(path.join(__dirname, '..', 'css', 'shared.css'), 'utf8');
if (!core.includes("wrap.className = 'gf-sugg gf-add-sugg'")) throw new Error('Add-workshop autocomplete must use isolated wrapper');
// The row carries the shared skin class AND the add-form interaction hook.
// The hook must match what the click/keydown handlers and the CSS query.
if (!core.includes("button.className = 'gf-sugg-row gf-add-sugg-item'")) throw new Error('Add-workshop suggestion item selector missing');
if (!core.includes("closest('.gf-add-sugg-item')")) throw new Error('Click handler must query the add-form hook class');
if (!core.includes("querySelector('.gf-add-sugg-item')")) throw new Error('Keyboard handler must query the add-form hook class');
if (!css.includes('#gfAdd .gf-add-sugg')) throw new Error('Add-workshop autocomplete CSS missing');
console.log('Add-workshop autocomplete visibility test passed');
