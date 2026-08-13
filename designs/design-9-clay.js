/* Clay — Claymorphism, puffy shapes
   This design's page: its own header, its own filter controls, its own
   cards. It reads the shared workshop list from window.GF_DATA and
   registers itself with core.js. */

var design = {
  id: "clay",
  name: "Clay",
  note: "Claymorphism, puffy shapes",
  swatch: "#7B5CFF",
  css: "css/design-9-clay.css",
  html: "<div class=\"pit\">\n  <header class=\"hero\">\n    <span class=\"blob\">GF</span>\n    <div>\n      <h1>Garage Finder</h1>\n      <p>Agency &amp; non-agency workshops across the UAE</p>\n    </div>\n  </header>\n\n  <div class=\"pods\">\n    <div class=\"pod v\"><b id=\"p-total\">6</b><span>Workshops</span></div>\n    <div class=\"pod m\"><b id=\"p-ag\">3</b><span>Agency</span></div>\n    <div class=\"pod c\"><b id=\"p-non\">3</b><span>Non-agency</span></div>\n    <div class=\"pod v\"><b id=\"p-em\">3</b><span>Emirates</span></div>\n  </div>\n\n  <div class=\"panel\">\n    <div class=\"seek\">\n      <svg viewBox=\"0 0 24 24\" stroke-linecap=\"round\"><circle cx=\"11\" cy=\"11\" r=\"7\"/><path d=\"M20 20l-3.5-3.5\"/></svg>\n      <input id=\"q\" type=\"search\" placeholder=\"Search name, area or make\" autocomplete=\"off\">\n    </div>\n\n    <div class=\"group\">\n      <p class=\"glabel\">Type</p>\n      <div class=\"blobs\" id=\"types\">\n        <button class=\"pill\" type=\"button\" data-type=\"all\" aria-pressed=\"true\">All</button>\n        <button class=\"pill t-agency\" type=\"button\" data-type=\"agency\" aria-pressed=\"false\">Agency</button>\n        <button class=\"pill t-nonagency\" type=\"button\" data-type=\"nonagency\" aria-pressed=\"false\">Non-agency</button>\n      </div>\n    </div>\n\n    <div class=\"group\">\n      <p class=\"glabel\">Emirate</p>\n      <div class=\"blobs\" id=\"emirates\"></div>\n    </div>\n\n    <div class=\"group\">\n      <p class=\"glabel\">Insurer panel</p>\n      <select class=\"drop\" id=\"ins\"></select>\n    </div>\n  </div>\n\n  <p class=\"tally\" id=\"tally\">6 workshops</p>\n  <div id=\"list\"></div>\n  <p class=\"foot\"></p>\n</div>",
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

const listEl = document.getElementById('list');
const emEl = document.getElementById('emirates');
const insEl = document.getElementById('ins');

insEl.innerHTML = '<option value="all">All insurer panels</option>' + INSURERS.map(i => `<option>${esc(i)}</option>`).join('');
emEl.innerHTML = `<button class="pill" type="button" data-emirate="all" aria-pressed="true">All</button>` +
  EMIRATES.map(e => `<button class="pill" type="button" data-emirate="${esc(e)}" aria-pressed="false">${e}</button>`).join('');

document.getElementById('p-total').textContent = WORKSHOPS.length;
document.getElementById('p-ag').textContent = WORKSHOPS.filter(w=>w.type==='agency').length;
document.getElementById('p-non').textContent = WORKSHOPS.filter(w=>w.type==='nonagency').length;
document.getElementById('p-em').textContent = new Set(WORKSHOPS.map(w=>w.emirate)).size;

function initials(n){return n.replace(/[^A-Za-z ]/g,' ').trim().split(/\s+/).slice(0,2).map(x=>x[0]).join('').toUpperCase();}
function render(){
  const list = GF.filter(WORKSHOPS, state);
  document.getElementById('tally').textContent = list.length === 1 ? '1 workshop' : list.length + ' workshops';
  if (!list.length){
    listEl.innerHTML = `<div class="nothing"><span class="blob">?</span>
      <h2>Nothing to show</h2><p>Try another emirate, or set the insurer panel back to all.</p></div>`;
    return;
  }
  listEl.innerHTML = list.map(w => {
    const isAg = w.type === 'agency';
    const items = (isAg ? w.makes : w.insurers)
      .map(t => `<span class="bead ${isAg?'':'panel'}">${esc(t)}</span>`).join('');
    const call = w.phone
      ? `<a class="chub go" href="${GF.firstTel(w.phone)}">Call</a>`
      : `<span class="chub off">No number on file</span>`;
    return `<article class="card ${isAg?'':'is-nonagency'} ${w.pending?'gf-is-pending':''}">
      <div class="card-top">
        <span class="lump">${esc(initials(w.name))}</span>
        <div>
          <h2>${esc(w.name)}</h2>
          ${GF.pendingBadge(w)}
          <span class="badge">${isAg?'Agency':'Non-agency'}</span>
        </div>
      </div>
      <div class="tray tray-address">
        <p>Address</p>
        <a class="place" href="${GF.mapsHref(w)}" target="_blank" rel="noopener">${esc(GF.fullAddress(w))}</a>
      </div>
      <div class="tray">
        <p>${isAg?'Makes handled':'Insurer panels'}</p>
        <div class="beads">${items}</div>
      </div>
      <div class="tray tray-tel">
        <p>Phone</p>
        ${w.phone ? GF.phoneLines(w.phone) : '<span class="place">No number on file</span>'}
      </div>
      <div class="card-actions">${call}<button class="chub" type="button" data-copy="${WORKSHOPS.indexOf(w)}">Copy details</button></div>
    </article>`;
  }).join('');
}
function onGetelementbyidTypesClick1(e){
  const b = e.target.closest('.pill'); if(!b) return;
  state.type = b.dataset.type;
  document.querySelectorAll('#types .pill').forEach(x => x.setAttribute('aria-pressed', x===b));
  render();
}
cleanup.listen(document.getElementById('types'), 'click', onGetelementbyidTypesClick1);
function onEmelClick2(e){
  const b = e.target.closest('.pill'); if(!b) return;
  state.emirate = b.dataset.emirate;
  document.querySelectorAll('#emirates .pill').forEach(x => x.setAttribute('aria-pressed', x===b));
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

export default design;
