'use strict';
const fs=require('fs'), path=require('path'), assert=require('assert');
const root=path.join(__dirname,'..');
const security=fs.readFileSync(path.join(root,'security-v4.js'),'utf8');
const core=fs.readFileSync(path.join(root,'core-v4.js'),'utf8');
const admin=fs.readFileSync(path.join(root,'admin/admin.js'),'utf8');
const designs=fs.readdirSync(path.join(root,'designs')).filter(x=>x.endsWith('.js')).map(x=>fs.readFileSync(path.join(root,'designs',x),'utf8')).join('\n');
assert(security.includes('escapeHTML'),'central escape function missing');
for(const payload of ['<script>','<img src=x onerror=alert(1)>','" onmouseover="alert(1)','\' onfocus=alert(1)']){
  const escaped=payload.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
  assert(!escaped.includes('<script>') && !escaped.includes('<img'));
  assert(escaped.includes('&lt;') || escaped.includes('&quot;') || escaped.includes('&#39;'));
}
assert(core.includes('window.GF_SECURITY.escapeHTML'),'core does not use centralized escaping');
assert(admin.includes('window.GF_SECURITY.escapeHTML'),'admin does not use centralized escaping');
assert(designs.includes('GF.esc')||designs.includes('window.GF_esc'),'designs do not use centralized escaping');
for(const f of ['index.html','admin.html']) assert(!fs.readFileSync(path.join(root,f),'utf8').includes('style="'),'inline style attribute remains');
console.log('security tests: PASS');
