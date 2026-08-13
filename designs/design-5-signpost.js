/* Signpost — Road signage, gantry header
   This design's page: its own header, its own filter controls, its own
   cards. It reads the shared workshop list from window.GF_DATA and
   registers itself with core.js. */

var design = {
  id: "signpost",
  name: "Signpost",
  note: "Road signage, gantry header",
  swatch: "#00693E",
  css: "css/design-5-signpost.css",
  html: "<div class=\"road\">\n\n  <div class=\"gantry\">\n    <div class=\"gantry-in\">\n      <span class=\"arrow\">\u2794</span>\n      <h1>Garage Finder</h1>\n      <span class=\"sub\">Approved workshops \u00b7 UAE</span>\n    </div>\n  </div>\n\n  <div class=\"controls\">\n    <div class=\"lookup\">\n      <span class=\"tag\">Find</span>\n      <input id=\"q\" type=\"search\" placeholder=\"Workshop, area or make\" autocomplete=\"off\">\n    </div>\n\n    <p class=\"ctrl-label\" style=\"margin-top:18px;\">Emirate</p>\n    <div class=\"exits\" id=\"exits\"></div>\n\n    <div class=\"route\" id=\"route\">\n      <button class=\"route-btn\" type=\"button\" data-type=\"all\" aria-pressed=\"true\">All</button>\n      <button class=\"route-btn\" type=\"button\" data-type=\"agency\" aria-pressed=\"false\">Agency</button>\n      <button class=\"route-btn\" type=\"button\" data-type=\"nonagency\" aria-pressed=\"false\">Non-agency</button>\n      <select id=\"ins\"></select>\n    </div>\n  </div>\n\n  <p class=\"milepost\" id=\"milepost\">6 workshops ahead</p>\n  <div id=\"list\"></div>\n  <p class=\"foot\"></p>\n</div>",
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

const exitsEl = document.getElementById('exits');
const insEl = document.getElementById('ins');
const listEl = document.getElementById('list');

insEl.innerHTML = '<option value="all">All insurers</option>' + INSURERS.map(i => `<option>${esc(i)}</option>`).join('');
exitsEl.innerHTML = `<button class="exit" type="button" data-emirate="all" aria-pressed="true">All</button>` +
  EMIRATES.map(e => `<button class="exit" type="button" data-emirate="${esc(e)}" aria-pressed="false">${e}</button>`).join('');

function render(){
  const list = GF.filter(WORKSHOPS, state);
  document.getElementById('milepost').textContent =
    list.length === 1 ? '1 workshop ahead' : list.length + ' workshops ahead';
  if (!list.length){
    listEl.innerHTML = `<div class="detour"><strong>No route found</strong>
      <p>Nothing matches this combination. Try another emirate or clear the insurer panel.</p></div>`;
    return;
  }
  listEl.innerHTML = list.map(w => {
    const items = (w.type === 'agency' ? w.makes : w.insurers)
      .map(t => `<span class="plate">${esc(t)}</span>`).join('');
    return `<article class="sign ${w.type==='nonagency'?'is-nonagency':''} ${w.pending?'gf-is-pending':''}">
      <div class="sign-in">
        <div class="sign-row">
          <div>
            <h2>${esc(w.name)}</h2>
            ${GF.pendingBadge(w)}
            <p class="sign-addr"><a href="${GF.mapsHref(w)}" target="_blank" rel="noopener">${esc(w.address)}</a></p>
          </div>
          <span class="shield">${esc(SHORT[w.emirate] || "")}<br>${w.type==='agency'?'Agency':'Non-ag'}</span>
        </div>
        <div class="sign-foot">
          ${items}
          <span class="tel ${w.phone?'':'blank'}">${w.phone
            ? GF.phoneLines(w.phone)
            : 'No number on file'}</span>
        </div>
        <div class="sign-acts">
          ${w.phone ? `<a class="sbtn" href="${GF.firstTel(w.phone)}">Call</a>` : `<span class="sbtn is-off">Call</span>`}
          <a class="sbtn" href="${GF.mapsHref(w)}" target="_blank" rel="noopener">Open map</a>
          <button class="sbtn" type="button" data-copy="${WORKSHOPS.indexOf(w)}">Copy details</button>
        </div>
      </div>
    </article>`;
  }).join('');
}
function onExitselClick1(e){
  const b = e.target.closest('.exit'); if(!b) return;
  state.emirate = b.dataset.emirate;
  document.querySelectorAll('.exit').forEach(x => x.setAttribute('aria-pressed', x===b));
  render();
}
cleanup.listen(exitsEl, 'click', onExitselClick1);
function onGetelementbyidRouteClick2(e){
  const b = e.target.closest('.route-btn'); if(!b) return;
  state.type = b.dataset.type;
  document.querySelectorAll('.route-btn').forEach(x => x.setAttribute('aria-pressed', x===b));
  render();
}
cleanup.listen(document.getElementById('route'), 'click', onGetelementbyidRouteClick2);
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
