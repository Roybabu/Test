/* Automotive Glass — Alternative version
   Gradient backgrounds with glassmorphism effects, different color direction
   and visual approach. Modern professional aesthetic for automotive services.
   This design's page: its own header, its own filter controls, its own cards.
   It reads the shared workshop list from window.GF_DATA and registers itself
   with core.js. */

var design = {
  id: "automotive-glass",
  name: "Automotive Glass",
  note: "Gradient/tech-forward, glassmorphism, modern professional",
  swatch: "#00D4FF",
  css: "css/design-3-automotive-glass.css",
  html: "<div class=\"ag-header\">\n  <div class=\"ag-header-content\">\n    <h1 class=\"ag-logo\">Garage<em>.</em>Finder</h1>\n    <p class=\"ag-tagline\">Find trusted workshops</p>\n  </div>\n</div>\n\n<div class=\"ag-sticky\">\n  <div class=\"ag-search-box\">\n    <input id=\"q\" type=\"search\" placeholder=\"Search by workshop, area, or make\" autocomplete=\"off\">\n  </div>\n  <div class=\"ag-filters\">\n    <div class=\"ag-emirate-pills\" id=\"agChips\"></div>\n    <div class=\"ag-row2\">\n      <select id=\"ins\" class=\"ag-insurer-select\"></select>\n      <div class=\"ag-type-toggle\" id=\"agTabs\">\n        <button class=\"ag-toggle-btn\" type=\"button\" data-type=\"all\" aria-pressed=\"true\">All</button>\n        <button class=\"ag-toggle-btn\" type=\"button\" data-type=\"agency\" aria-pressed=\"false\">Agency</button>\n        <button class=\"ag-toggle-btn\" type=\"button\" data-type=\"nonagency\" aria-pressed=\"false\">Non-agency</button>\n      </div>\n    </div>\n  </div>\n</div>\n\n<main class=\"ag-main\">\n  <div class=\"ag-results-header\">\n    <h2 class=\"ag-results-count\" id=\"agCount\">6 workshops</h2>\n  </div>\n  <div class=\"ag-workshop-list\" id=\"agGrid\"></div>\n</main>",
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

const chipsEl = document.getElementById('agChips');
const gridEl = document.getElementById('agGrid');
const countEl = document.getElementById('agCount');
const insEl = document.getElementById('ins');

insEl.innerHTML = '<option value="all">All insurers</option>' +
  INSURERS.map(i => `<option value="${esc(i)}">${esc(i)}</option>`).join('');

function buildChips(){
  const all = `<button class="ag-pill" type="button" data-emirate="all" aria-pressed="${state.emirate==='all'}">All</button>`;
  chipsEl.innerHTML = all + EMIRATES.map(e => {
    const n = GF.countInEmirate(e, WORKSHOPS);
    return `<button class="ag-pill" type="button" data-emirate="${esc(e)}" aria-pressed="${state.emirate===e}">${esc(SHORT[e] || e)}</button>`;
  }).join('');
}

function render(){
  buildChips();
  const list = GF.filter(WORKSHOPS, state);
  countEl.textContent = list.length === 1 ? '1 workshop' : list.length + ' workshops';
  if (!list.length){
    gridEl.innerHTML = `<div class="ag-no-results"><p><strong>No workshops match</strong> your filters. Try adjusting your search.</p></div>`;
    return;
  }
  gridEl.innerHTML = list.map(w => {
    const otherTags = w.makes.map(m => `<span class="ag-make-tag">${esc(m)}</span>`)
      .concat(w.insurers.map(i => `<span class="ag-insurer-tag">${esc(i)}</span>`))
      .join('');
    return `<article class="ag-workshop ${w.type === 'nonagency' ? 'is-nonagency' : 'is-agency'} ${w.pending ? 'gf-is-pending' : ''}">
      <div class="ag-workshop-top">
        <h3 class="ag-workshop-name">${esc(w.name)}</h3>
        ${GF.pendingBadge(w)}
      </div>
      <p class="ag-location"><a href="${GF.mapsHref(w)}" target="_blank" rel="noopener" class="ag-location-link">${esc(w.address)}</a></p>
      <div class="ag-header-row">
        <span class="ag-emirate-badge">${esc(w.emirate)}</span>
        <span class="ag-type-badge">${w.type === 'agency' ? 'Agency' : 'Non-agency'}</span>
      </div>
      ${otherTags ? `<div class="ag-specs">${otherTags}</div>` : ''}
      <div class="ag-contact">
        ${w.phone ? `<div class="ag-phone-block">${GF.phoneLines(w.phone, 'ag-phone')}</div>` : `<div class="ag-no-phone">Phone not available</div>`}
        <div class="ag-quick-actions">
          ${w.phone ? `<a class="ag-btn ag-btn-primary" href="${GF.firstTel(w.phone)}">Call</a>` : `<span class="ag-btn ag-btn-primary is-disabled">Call</span>`}
          <a class="ag-btn" href="${GF.mapsHref(w)}" target="_blank" rel="noopener">Map</a>
          <button class="ag-btn" type="button" data-copy="${WORKSHOPS.indexOf(w)}">Copy</button>
        </div>
      </div>
    </article>`;
  }).join('');
}

function onChipClick(e){
  const b = e.target.closest('.ag-pill'); if (!b) return;
  state.emirate = b.dataset.emirate; render();
}
cleanup.listen(chipsEl, 'click', onChipClick);

function onToggleClick(e){
  const b = e.target.closest('.ag-toggle-btn'); if (!b) return;
  state.type = b.dataset.type;
  document.querySelectorAll('.ag-toggle-btn').forEach(s => s.setAttribute('aria-pressed', s === b));
  render();
}
cleanup.listen(document.getElementById('agTabs'), 'click', onToggleClick);

function onInsurerChange(e){ state.insurer = e.target.value; render(); }
cleanup.listen(insEl, 'change', onInsurerChange);

function onQueryInput(e){ state.q = e.target.value; render(); }
cleanup.listen(document.getElementById('q'), 'input', onQueryInput);

cleanup.add(GF.wireCopy(gridEl, WORKSHOPS));
render();
  },
  destroy: function(){
    cleanup.destroy();
  }
};

export default design;
