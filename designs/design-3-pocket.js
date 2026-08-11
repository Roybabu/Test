/* Pocket — Phone-app cards, chip filters
   This design's page: its own header, its own filter controls, its own
   cards. It reads the shared workshop list from window.GF_DATA and
   registers itself with core.js. */

window.GF_DESIGNS = window.GF_DESIGNS || {};
window.GF_DESIGNS["pocket"] = {
  id: "pocket",
  name: "Pocket",
  note: "Phone-app cards, chip filters",
  swatch: "#1A4FE0",
  css: "css/design-3-pocket.css",
  html: "<div class=\"app\">\n  <div class=\"top\">\n    <div class=\"brand\">\n      <span class=\"mark\">GF</span>\n      <h1>Garage Finder</h1>\n      <span>UAE</span>\n    </div>\n    <div class=\"search\">\n      <svg viewBox=\"0 0 24 24\" stroke-linecap=\"round\"><circle cx=\"11\" cy=\"11\" r=\"7\"/><path d=\"M20 20l-3.5-3.5\"/></svg>\n      <input id=\"q\" type=\"search\" placeholder=\"Search workshop, area or make\" autocomplete=\"off\">\n    </div>\n    <div class=\"chips\" id=\"chips\"></div>\n    <div class=\"segment\" id=\"segment\">\n      <button class=\"segbtn\" type=\"button\" data-type=\"all\" aria-pressed=\"true\">All</button>\n      <button class=\"segbtn\" type=\"button\" data-type=\"agency\" aria-pressed=\"false\">Agency</button>\n      <button class=\"segbtn\" type=\"button\" data-type=\"nonagency\" aria-pressed=\"false\">Non-agency</button>\n    </div>\n    <button class=\"panelpick\" type=\"button\" id=\"insTrigger\" aria-haspopup=\"listbox\" aria-expanded=\"false\">\n      <span class=\"pp-label\">Insurer panel</span>\n      <span class=\"pp-value\" id=\"insValue\">All insurers</span>\n      <svg class=\"pp-chev\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M7 10l5 5 5-5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>\n    </button>\n  </div>\n\n  <p class=\"count\" id=\"count\">6 workshops</p>\n  <div id=\"list\"></div>\n</div>\n\n<div class=\"dock\">\n  <div class=\"dock-in\">\n    <span id=\"dockText\">No filters applied</span>\n    <button id=\"clear\" type=\"button\" disabled>Clear all</button>\n  </div>\n</div>\n\n<div class=\"ins-sheet\" id=\"insSheet\" hidden>\n  <div class=\"ins-scrim\" data-ins-close></div>\n  <div class=\"ins-panel\" role=\"dialog\" aria-modal=\"true\" aria-label=\"Choose an insurer panel\">\n    <div class=\"ins-grab\"></div>\n    <div class=\"ins-top\">\n      <h2>Insurer panel</h2>\n      <button class=\"ins-x\" type=\"button\" data-ins-close aria-label=\"Close\">&times;</button>\n    </div>\n    <div class=\"ins-search\">\n      <svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><circle cx=\"11\" cy=\"11\" r=\"7\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\"/><path d=\"M20 20l-3.5-3.5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\"/></svg>\n      <input id=\"insSearch\" type=\"search\" placeholder=\"Search insurers\" autocomplete=\"off\">\n    </div>\n    <div class=\"ins-list\" id=\"insList\" role=\"listbox\"></div>\n  </div>\n</div>",
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

const chipsEl = document.getElementById('chips');
const listEl = document.getElementById('list');
const countEl = document.getElementById('count');
const insTrigger = document.getElementById('insTrigger');
const insValue   = document.getElementById('insValue');
const insSheet   = document.getElementById('insSheet');
const insList    = document.getElementById('insList');
const insSearch  = document.getElementById('insSearch');
const dockText = document.getElementById('dockText');
const clearBtn = document.getElementById('clear');

/* How many workshops sit on each panel, so nobody picks a dead end. */
function insurerCount(name){
  return GF.countOnPanel(name, WORKSHOPS);
}

function drawInsList(){
  const q = insSearch.value.trim().toLowerCase();
  const hits = INSURERS.filter(n => !q || n.toLowerCase().includes(q));
  const rows = [];
  if (!q){
    rows.push(`<button class="ins-row" type="button" role="option" data-v="all"
      aria-selected="${state.insurer === 'all'}"><span class="ins-name">All insurers</span>
      <span class="ins-n">${WORKSHOPS.length}</span></button>`);
  }
  hits.forEach(n => {
    const c = insurerCount(n);
    rows.push(`<button class="ins-row" type="button" role="option" data-v="${esc(n)}"
      aria-selected="${state.insurer === n}" ${c ? '' : 'data-empty="1"'}>
      <span class="ins-name">${esc(n)}</span><span class="ins-n">${c}</span></button>`);
  });
  insList.innerHTML = rows.length
    ? rows.join('')
    : `<p class="ins-none">No insurer by that name.</p>`;
}

function openIns(){
  insSheet.hidden = false;
  insTrigger.setAttribute('aria-expanded', 'true');
  insSearch.value = '';
  drawInsList();
  setTimeout(() => insSearch.focus({preventScroll:true}), 60);
}
function closeIns(){
  insSheet.hidden = true;
  insTrigger.setAttribute('aria-expanded', 'false');
}
function setInsurer(v){
  state.insurer = v;
  insValue.textContent = v === 'all' ? 'All insurers' : v;
  insTrigger.classList.toggle('is-set', v !== 'all');
  render();
}

cleanup.listen(insTrigger, 'click', openIns);
cleanup.listen(insSearch, 'input', drawInsList);
function onInssheetClick1(e){
  if (e.target.closest('[data-ins-close]')) { closeIns(); return; }
  const r = e.target.closest('.ins-row');
  if (!r) return;
  setInsurer(r.dataset.v);
  closeIns();
}
cleanup.listen(insSheet, 'click', onInssheetClick1);
function onPocketKeyDown(e){
  if (e.key === 'Escape' && !insSheet.hidden) closeIns();
}
cleanup.listen(document, 'keydown', onPocketKeyDown);
chipsEl.innerHTML = ['all'].concat(EMIRATES).map(e =>
  `<button class="chip" type="button" data-emirate="${esc(e)}" aria-pressed="${e==='all'}">${e === 'all' ? 'All emirates' : e}</button>`
).join('');

function initials(name){
  return name.replace(/[^A-Za-z ]/g,' ').trim().split(/\s+/).slice(0,2).map(w => w[0]).join('').toUpperCase();
}
function activeCount(){
  let n = 0;
  if (state.emirate !== 'all') n++;
  if (state.type !== 'all') n++;
  if (state.insurer !== 'all') n++;
  if (state.q) n++;
  return n;
}

function render(){
  document.querySelectorAll('.chip').forEach(c => c.setAttribute('aria-pressed', c.dataset.emirate === state.emirate));
  const list = GF.filter(WORKSHOPS, state);
  countEl.textContent = list.length === 1 ? '1 workshop' : list.length + ' workshops';

  const n = activeCount();
  dockText.textContent = n === 0 ? 'No filters applied' : n === 1 ? '1 filter applied' : n + ' filters applied';
  clearBtn.disabled = n === 0;

  if (!list.length){
    listEl.innerHTML = `<div class="empty"><h2>No workshops here yet</h2>
      <p>Try a different emirate, or set the insurer panel back to all.</p></div>`;
    return;
  }
  listEl.innerHTML = list.map(w => {
    const kind = w.type === 'agency' ? 'agency' : 'nonagency';
    const label = w.type === 'agency' ? 'Agency' : 'Non-agency';
    const metaLabel = w.type === 'agency' ? 'Makes handled' : 'Insurer panels';
    const items = w.type === 'agency'
      ? w.makes.map(m => `<span class="pill">${esc(m)}</span>`).join('')
      : w.insurers.map(i => `<span class="pill is-panel">${esc(i)}</span>`).join('');
    const call = w.phone
      ? `<a class="btn is-primary" href="${GF.firstTel(w.phone)}">Call</a>`
      : `<span class="btn is-off">No number on file</span>`;
    return `<article class="card">
      <div class="card-head">
        <span class="avatar is-${kind}">${esc(initials(w.name))}</span>
        <div>
          <h2 class="card-name">${esc(w.name)}</h2>
          <p class="card-loc"><a href="${GF.mapsHref(w)}" target="_blank" rel="noopener">${esc(w.address)}</a> · ${esc(w.emirate)}</p>
          <span class="badge is-${kind}">${label}</span>
        </div>
      </div>
      <div class="meta">
        <p class="meta-label">${metaLabel}</p>
        <div class="pills">${items}</div>
      </div>
      <div class="meta">
        <p class="meta-label">${w.phone ? 'Phone' : ''}</p>
        ${w.phone ? GF.phoneLines(w.phone) : '<p class="card-loc">No number on file</p>'}
      </div>
      <div class="actions">
        ${call}
        <button class="btn" type="button" data-copy="${WORKSHOPS.indexOf(w)}">Copy details</button>
      </div>
    </article>`;
  }).join('');
}

function onChipselClick2(e){
  const b = e.target.closest('.chip'); if (!b) return;
  state.emirate = b.dataset.emirate; render();
}

cleanup.listen(chipsEl, 'click', onChipselClick2);
function onGetelementbyidSegmentClick3(e){
  const b = e.target.closest('.segbtn'); if (!b) return;
  state.type = b.dataset.type;
  document.querySelectorAll('.segbtn').forEach(s => s.setAttribute('aria-pressed', s === b));
  render();
}
cleanup.listen(document.getElementById('segment'), 'click', onGetelementbyidSegmentClick3);

function onQueryInput(e){ state.q = e.target.value; render(); }

cleanup.listen(document.getElementById('q'), 'input', onQueryInput);
function onClearbtnClick4(){
  state = {emirate:"all", type:"all", insurer:"all", q:""};
  document.getElementById('q').value = '';
  setInsurer('all');
  document.querySelectorAll('.segbtn').forEach(s => s.setAttribute('aria-pressed', s.dataset.type === 'all'));
  render();
}
cleanup.listen(clearBtn, 'click', onClearbtnClick4);

cleanup.add(GF.wireCopy(listEl, WORKSHOPS));
render();
  },
  destroy: function(){
    cleanup.destroy();
  }
};
