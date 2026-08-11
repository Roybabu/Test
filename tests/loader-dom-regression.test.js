// Regression test: the loading UI must be built with DOM APIs.
// Using textContent with HTML markup renders the markup literally.
const fs = require('fs');
const core = fs.readFileSync(require('path').join(__dirname, '..', 'core-v4.js'), 'utf8');

if (!core.includes("document.createElement('div')")) throw new Error('Loader must create DOM nodes');
if (!core.includes("loadingLabel.textContent = 'Loading workshops'")) throw new Error('Loader label must use textContent');
if (core.includes("stage.textContent = '<div class=\"published-loading\"")) {
  throw new Error('Loader must not put HTML markup into textContent');
}
console.log('Loader DOM regression test passed');
