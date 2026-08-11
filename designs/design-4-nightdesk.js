/* Night Desk — Dark console, sticky filter rail
   This design's page: its own header, its own filter controls, its own
   cards. It reads the shared workshop list from window.GF_DATA and
   registers itself with core.js. */

window.GF_DESIGNS = window.GF_DESIGNS || {};
window.GF_DESIGNS["nightdesk"] = {
  id: "nightdesk",
  name: "Night Desk",
  note: "Dark console, sticky filter rail",
  swatch: "#8B7BFF",
  css: "css/design-4-nightdesk.css",
  html: "<div class=\"layout\">\n  <aside class=\"rail\">\n    <div class=\"logo\"><span class=\"dot\"></span><h1>Garage Finder</h1></div>\n    <p class=\"logo-sub\">UAE workshop desk</p>\n\n    <div class=\"rail-group\">\n      <p class=\"rail-title\">Type</p>\n      <div id=\"types\">\n        <button class=\"opt\" type=\"button\" data-type=\"all\" aria-pressed=\"true\"><span class=\"bar\"></span>All workshops<span class=\"n\" data-n=\"all\"></span></button>\n        <button class=\"opt t-agency\" type=\"button\" data-type=\"agency\" aria-pressed=\"false\"><span class=\"bar\"></span>Agency<span class=\"n\" data-n=\"agency\"></span></button>\n        <button class=\"opt t-nonagency\" type=\"button\" data-type=\"nonagency\" aria-pressed=\"false\"><span class=\"bar\"></span>Non-agency<span class=\"n\" data-n=\"nonagency\"></span></button>\n      </div>\n    </div>\n\n    <div class=\"rail-group\">\n      <p class=\"rail-title\">Emirate</p>\n      <div id=\"emirates\"></div>\n    </div>\n\n    <div class=\"rail-group\">\n      <p class=\"rail-title\">Insurer panel</p>\n      <select id=\"ins\"></select>\n    </div>\n  </aside>\n\n  <main class=\"main\">\n    <div class=\"searchbar\">\n      <svg viewBox=\"0 0 24 24\" stroke-linecap=\"round\"><circle cx=\"11\" cy=\"11\" r=\"7\"/><path d=\"M20 20l-3.5-3.5\"/></svg>\n      <input id=\"q\" type=\"search\" placeholder=\"Search name, area or make\" autocomplete=\"off\">\n    </div>\n    <div class=\"headline\">\n      <h2 id=\"title\">All workshops</h2>\n      <span id=\"tally\">6 results</span>\n    </div>\n    <div id=\"list\"></div>\n    <p class=\"foot\"></p>\n  </main>\n</div>",
  start: function(){
const GF = window.GF || {};
const cleanup = GF.createCleanup();
const esc = GF.esc || window.GF_esc || function(s){
  return String(s == null ? '' : s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
};
const WORKSHOPS = window.GF_DATA.workshops;
const EMIRATES = GF.emirates || ["Abu Dhabi","Dubai","Sharjah","Ajman","Ras Al Khaimah","Fujairah","Umm Al Quwain"];
const INSURERS = window.GF_DATA.insurers;
let state = {emirate:"all", type:"all", insurer:"all", q:""};

const emEl = document.getElementById('emirates');
const insEl = document.getElementById('ins');
const listEl = document.getElementById('list');

insEl.innerHTML = '<option value="all">All insurers</option>' + INSURERS.map(i => `<option>${esc(i)}</option>`).join('');
emEl.innerHTML = `<button class="opt" type="button" data-emirate="all" aria-pressed="true"><span class="bar"></span>All emirates<span class="n">${WORKSHOPS.length}</span></button>` +
  EMIRATES.map(e => {
    const n = GF.countInEmirate(e, WORKSHOPS);
    return `<button class="opt" type="button" data-emirate="${esc(e)}" aria-pressed="false"><span class="bar"></span>${esc(e)}<span class="n">${n}</span></button>`;
  }).join('');
document.querySelectorAll('[data-n]').forEach(el => {
  const k = el.dataset.n;
  el.textContent = k === 'all' ? WORKSHOPS.length : WORKSHOPS.filter(w => w.type === k).length;
});

function render(){
  const list = GF.filter(WORKSHOPS, state);
  document.getElementById('title').textContent =
    state.type === 'agency' ? 'Agency workshops' : state.type === 'nonagency' ? 'Non-agency workshops' : 'All workshops';
  document.getElementById('tally').textContent = list.length === 1 ? '1 result' : list.length + ' results';
  if (!list.length){
    listEl.innerHTML = `<div class="none"><strong>Nothing on this desk</strong>Widen the emirate, or set the insurer panel back to all.</div>`;
    return;
  }
  listEl.innerHTML = list.map(w => {
    const tags = w.makes.map(m => `<span class="c">${esc(m)}</span>`).join('') +
                 w.insurers.map(i => `<span class="c panel">${esc(i)}</span>`).join('');
    return `<article class="entry ${w.type==='nonagency'?'is-nonagency':''}">
      <div class="entry-top">
        <h3>${esc(w.name)}</h3>
        <span class="kind">${w.type==='agency'?'Agency':'Non-agency'}</span>
      </div>
      <p class="entry-meta"><a href="${GF.mapsHref(w)}" target="_blank" rel="noopener">${esc(w.address)}</a> · ${esc(w.emirate)}</p>
      <p class="entry-tel ${w.phone?'':'blank'}">${w.phone ? GF.phoneLines(w.phone) : 'No number on file'}</p>
      <div class="chips">${tags}</div>
      <div class="entry-acts">
        ${w.phone ? `<a class="ebtn" href="${GF.firstTel(w.phone)}">Call</a>` : `<span class="ebtn is-off">Call</span>`}
        <a class="ebtn" href="${GF.mapsHref(w)}" target="_blank" rel="noopener">Open map</a>
        <button class="ebtn" type="button" data-copy="${WORKSHOPS.indexOf(w)}">Copy details</button>
      </div>
    </article>`;
  }).join('');
}
function onGetelementbyidTypesClick1(e){
  const b = e.target.closest('.opt'); if(!b) return;
  state.type = b.dataset.type;
  document.querySelectorAll('#types .opt').forEach(o => o.setAttribute('aria-pressed', o===b));
  render();
}
cleanup.listen(document.getElementById('types'), 'click', onGetelementbyidTypesClick1);
function onEmelClick2(e){
  const b = e.target.closest('.opt'); if(!b) return;
  state.emirate = b.dataset.emirate;
  document.querySelectorAll('#emirates .opt').forEach(o => o.setAttribute('aria-pressed', o===b));
  render();
}
cleanup.listen(emEl, 'click', onEmelClick2);
function onInsurerChange(e){ state.insurer = e.target.value; render(); }
cleanup.listen(insEl, 'change', onInsurerChange);
function onQueryInput(e){ state.q = e.target.value; render(); }
cleanup.listen(document.getElementById('q'), 'input', onQueryInput);
cleanup.add(GF.wireCopy(listEl, WORKSHOPS));
render();
  },
  destroy: function(){
    cleanup.destroy();
  }
};
