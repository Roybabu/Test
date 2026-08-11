const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const core = fs.readFileSync(path.join(root, 'core.js'), 'utf8');
const designs = fs.readdirSync(path.join(root, 'css')).filter(f => /^design-\d+.*\.css$/.test(f));

if ((index.match(/fonts\.googleapis\.com\/css2/g) || []).length !== 2) throw new Error('Expected only preload + noscript primary Inter font references in index.html');
if (/fonts\.googleapis\.com\/css2.*rel="stylesheet"/.test(index.replace(/<noscript>[\s\S]*?<\/noscript>/g, ''))) throw new Error('Initial HTML contains a render-blocking Google Fonts stylesheet');
for (const f of designs) {
  const s = fs.readFileSync(path.join(root, 'css', f), 'utf8');
  if (!/font-family:/.test(s)) throw new Error(`${f} has no font-family declaration`);
}
for (const id of ['board','jobcard','pocket','nightdesk','signpost','index','blocks','splitdesk','clay','neu']) {
  if (!new RegExp(`${id}:`).test(core)) throw new Error(`Missing font mapping for ${id}`);
}
for (const f of [
  'fonts/ibm-plex-sans/regular.woff2', 'fonts/ibm-plex-sans/bold.woff2',
  'fonts/ibm-plex-mono/regular.woff2', 'fonts/ibm-plex-mono/bold.woff2'
]) if (!fs.existsSync(path.join(root, f))) throw new Error(`Missing self-hosted font ${f}`);
console.log('Font loading audit: PASS');
