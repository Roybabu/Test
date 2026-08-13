/* Mobile — Thumb-first single column, sticky search & filters
   Built to read well on any phone: one column regardless of width, every
   tappable element at least 44px tall, no hover-only interactions, and
   the search/filter bar pinned under the header so it's always in reach
   without hunting through a long scrolled list. This design's page: its
   own header, its own filter controls, its own cards. It reads the
   shared workshop list from window.GF_DATA and registers itself with
   core.js. */

var design = {
  id: "mobile",
  name: "Mobile",
  note: "Thumb-first single column, sticky search & filters",
  swatch: "#0E7C66",
  css: "css/design-3-mobile.css",
  html: "<div class=\"m-head\">\n  <div class=\"m-head-in\">\n    <h1 class=\"m-word\">Garage<em>.</em>Finder</h1>\n    <span class=\"m-sub\">UAE workshops</span>\n  </div>\n</div>\n\n<div class=\"m-bar\" id=\"mBar\">\n  <div class=\"m-search\">\n    <input id=\"q\" type=\"search\" placeholder=\"Search name, area or make\" autocomplete=\"off\">\n  </div>\n  <div class=\"m-chips\" id=\"mEmirates\"></div>\n  <div class=\"m-row2\">\n    <select id=\"ins\" class=\"m-select\"></select>\n    <div class=\"m-seg\" id=\"mSeg\">\n      <button class=\"m-seg-btn\" type=\"button\" data-type=\"all\" aria-pressed=\"true\">All</button>\n      <button class=\"m-seg-btn\" type=\"button\" data-type=\"agency\" aria-pressed=\"false\">Agency</button>\n      <button class=\"m-seg-btn\" type=\"button\" data-type=\"nonagency\" aria-pressed=\"false\">Non-agency</button>\n    </div>\n  </div>\n</div>\n\n<p class=\"m-tally\" id=\"mTally\">6 workshops</p>\n<div class=\"m-list\" id=\"mList\"></div>\n<p class=\"m-foot\"></p>",
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
const SHORT = GF.shortEmirate || {};
const INSURERS = window.GF_DATA.insurers;

let state = {emirate:"all", type:"all", insurer:"all", q:""};

const chipsEl = document.getElementById('mEmirates');
const listEl = document.getElementById('mList');
const tallyEl = document.getElementById('mTally');
const insEl = document.getElementById('ins');

insEl.innerHTML = '<option value="all">All insurers</option>' +
  INSURERS.map(i => `<option value="${esc(i)}">${esc(i)}</option>`).join('');

function buildChips(){
  const all = `<button class="m-chip" type="button" data-emirate="all" aria-pressed="${state.emirate==='all'}">All (${WORKSHOPS.length})</button>`;
  chipsEl.innerHTML = all + EMIRATES.map(e => {
    const n = GF.countInEmirate(e, WORKSHOPS);
    return `<button class="m-chip" type="button" data-emirate="${esc(e)}" aria-pressed="${state.emirate===e}">${esc(SHORT[e] || e)} (${n})</button>`;
  }).join('');
}

function render(){
  buildChips();
  const list = GF.filter(WORKSHOPS, state);
  tallyEl.textContent = list.length === 1 ? '1 workshop' : list.length + ' workshops';
  if (!list.length){
    listEl.innerHTML = `<div class="m-empty"><strong>Nothing matches these filters</strong>Clear the search or filters and try again.</div>`;
    return;
  }
  listEl.innerHTML = list.map(w => {
    const otherTags = w.makes.map(m => `<span class="m-tag">${esc(m)}</span>`)
      .concat(w.insurers.map(i => `<span class="m-tag is-panel">${esc(i)}</span>`))
      .join('');
    return `<article class="m-card ${w.type === 'nonagency' ? 'is-nonagency' : ''} ${w.pending ? 'gf-is-pending' : ''}">
      <h2 class="m-name">${esc(w.name)}</h2>
      ${GF.pendingBadge(w)}
      <p class="m-addr"><a class="m-maplink" href="${GF.mapsHref(w)}" target="_blank" rel="noopener">${esc(w.address)}</a></p>
      <div class="m-tags m-tags-loc"><span class="m-tag">${esc(w.emirate)}</span><span class="m-kind">${w.type === 'agency' ? 'Agency' : 'Non-agency'}</span></div>
      ${otherTags ? `<div class="m-tags">${otherTags}</div>` : ''}
      ${w.phone ? `<div class="m-phones">${GF.phoneLines(w.phone, 'm-phone-line')}</div>` : `<p class="m-nophone">No number on file</p>`}
      <div class="m-acts">
        ${w.phone ? `<a class="m-act m-act-primary" href="${GF.firstTel(w.phone)}">Call</a>` : `<span class="m-act m-act-primary is-off">Call</span>`}
        <a class="m-act" href="${GF.mapsHref(w)}" target="_blank" rel="noopener">Map</a>
        <button class="m-act" type="button" data-copy="${WORKSHOPS.indexOf(w)}">Copy</button>
      </div>
    </article>`;
  }).join('');
}

function onChipClick(e){
  const b = e.target.closest('.m-chip'); if (!b) return;
  state.emirate = b.dataset.emirate; render();
}
cleanup.listen(chipsEl, 'click', onChipClick);

function onSegClick(e){
  const b = e.target.closest('.m-seg-btn'); if (!b) return;
  state.type = b.dataset.type;
  document.querySelectorAll('.m-seg-btn').forEach(s => s.setAttribute('aria-pressed', s === b));
  render();
}
cleanup.listen(document.getElementById('mSeg'), 'click', onSegClick);

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

export default design;
