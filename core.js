/* ============================================================================
   CORE
   ----------------------------------------------------------------------------
   Everything the ten designs share:

     • builds one workshop list out of data-agency.js and data-nonagency.js
     • loads whichever design the visitor picked and swaps it on demand
     • the design picker in the bottom-right corner
     • the "+ Add workshop" form and sending submissions to submit.php

   Each design brings its own header, filter controls and card layout. This
   file never draws a card.
   ========================================================================== */

(function(){
  'use strict';

  /* ------------------------------------------------------------------------
     WHICH DESIGN LOADS FIRST
     Change to any id below: board, jobcard, pocket, nightdesk, signpost,
     index, blocks, splitdesk, clay, neu
     ------------------------------------------------------------------------ */
  var DEFAULT_DESIGN = 'board';

  /* Set to false to hide the picker and lock the site to DEFAULT_DESIGN. */
  var SHOW_PICKER = true;

  /* Where visitor submissions go. Set to '' to switch submissions off. */
  var SUBMIT_ENDPOINT = 'submit.php';

  /* If a design file fails to upload, the rest of the site must still work. */
  window.GF_DESIGNS = window.GF_DESIGNS || {};

  /* Bump this whenever you re-upload changed files, so returning visitors
     get the new ones instead of a cached copy. */
  var ASSET_V = '1';

  var ORDER = ['board','jobcard','pocket','nightdesk','signpost',
               'index','blocks','splitdesk','clay','neu'];

  var EMIRATES = ['Abu Dhabi','Dubai','Sharjah','Ajman',
                  'Ras Al Khaimah','Fujairah','Umm Al Quwain'];

  /* ======================================================================
     DATA
     ====================================================================== */
  var missing = [];
  var agency    = (typeof agencyWorkshops    !== 'undefined') ? agencyWorkshops    : (missing.push('data-agency.js'), []);
  var nonagency = (typeof nonAgencyWorkshops !== 'undefined') ? nonAgencyWorkshops : (missing.push('data-nonagency.js'), []);
  var insurerRows = (typeof insurerData      !== 'undefined') ? insurerData        : (missing.push('data-insurers.js'), []);

  function norm(w, type){
    return {
      type:     type,
      name:     w.name    || '',
      emirate:  w.emirate || '',
      address:  w.address || '',
      phone:    w.phone   || '',
      hours:    w.hours   || '',
      notes:    w.notes   || '',
      makes:    w.makes    || [],
      insurers: type === 'nonagency' ? (w.insurers || []) : [],
      pending:  !!w.pending
    };
  }

  var workshops = []
    .concat(agency.map(function(w){ return norm(w, 'agency'); }))
    .concat(nonagency.map(function(w){ return norm(w, 'nonagency'); }));

  var insurers = insurerRows
    .map(function(r){ return r && r.name; })
    .filter(function(n){ return n && n !== 'Insurer name as it should appear'; });
  insurers = insurers.filter(function(n, i){ return insurers.indexOf(n) === i; }).sort();

  /* Workshops this visitor added themselves, kept on their own device
     until the site owner merges them into the data files. */
  var LOCAL_KEY = 'gf_local_workshops';
  function readLocal(){
    try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]'); }
    catch (e) { return []; }
  }
  function writeLocal(list){
    try { localStorage.setItem(LOCAL_KEY, JSON.stringify(list)); } catch (e) {}
  }
  /* Identifies "the same workshop" across a visitor's own copy and the
     published data files — name + emirate, ignoring case and punctuation.
     Without this, a workshop a visitor added would keep showing from their
     device even after the owner merged it into a data file, so they'd see
     it twice. */
  function slugify(s){
    return String(s || '').toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60);
  }
  /* Two records are the same place when the names match — or when one name
     is the start of the other, which covers the owner adding a suffix like
     "LLC" or "Auto Repairs" while merging. The emirate must agree, unless
     one of them is blank. */
  function samePlace(a, b){
    var na = slugify(a && a.name), nb = slugify(b && b.name);
    if (!na || !nb) return false;
    var hit = (na === nb) ||
              (na.length >= 8 && nb.length >= 8 &&
               (na.indexOf(nb) === 0 || nb.indexOf(na) === 0));
    if (!hit) return false;
    var ea = slugify(a && a.emirate), eb = slugify(b && b.emirate);
    return !ea || !eb || ea === eb;
  }
  function isPublished(w){
    for (var i = 0; i < workshops.length; i++){
      if (samePlace(workshops[i], w)) return true;
    }
    return false;
  }

  /* Anything now published is dropped from this device — and pruned from
     storage too, so it heals itself instead of needing a cache clear. */
  var mine = readLocal();
  var stillMine = mine.filter(function(w){ return !isPublished(w); });
  if (stillMine.length !== mine.length){
    writeLocal(stillMine);
    if (window.console && console.info){
      console.info('Garage Finder: removed ' + (mine.length - stillMine.length) +
                   ' saved copy/copies that are now published.');
    }
  }

  var kept = [];
  stillMine.forEach(function(w){
    for (var i = 0; i < kept.length; i++){
      if (samePlace(kept[i], w)) return;   // guard against a double submit
    }
    kept.push(w);
    w.pending = true;
    workshops.push(norm(w, w.type === 'nonagency' ? 'nonagency' : 'agency'));
  });

  workshops.sort(function(a, b){ return a.name.localeCompare(b.name); });

  window.GF_DATA = {
    workshops: workshops,
    insurers:  insurers,
    emirates:  EMIRATES
  };

  if (missing.length){
    var warn = document.createElement('div');
    warn.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:2147483000;' +
      'background:#B3261E;color:#fff;padding:12px 16px;font:600 14px/1.4 system-ui,sans-serif;';
    warn.textContent = 'Could not load: ' + missing.join(', ') +
      ' — check the file is uploaded and has no typo (F12 → Console shows the line).';
    document.addEventListener('DOMContentLoaded', function(){ document.body.appendChild(warn); });
  }

  /* ======================================================================
     MOUNTING A DESIGN
     ====================================================================== */
  var stage  = null;
  var link   = null;
  var current = DEFAULT_DESIGN;
  var pendingRemember = false;
  var KEY = 'gf_design';

  function known(id){ return ORDER.indexOf(id) !== -1 && window.GF_DESIGNS && window.GF_DESIGNS[id]; }

  var mountSeq = 0;
  var currentDesign = null;
  var destroyActiveInsurerPicker = null;
  var cancelPendingMount = null;

  function mount(id, remember){
    if (!known(id)) id = known(DEFAULT_DESIGN) ? DEFAULT_DESIGN : ORDER[0];
    var d = window.GF_DESIGNS[id];
    if (!d) return;

    var previous = currentDesign;
    var seq = ++mountSeq;

    /* Invalidate/cancel any asynchronous CSS callback belonging to the
       previous mount before starting this one. */
    if (cancelPendingMount){
      cancelPendingMount();
      cancelPendingMount = null;
    }

    /* Lifecycle order:
       1. destroy old design
       2. remove old DOM
       3. activate/load new CSS
       4. render new DOM
       5. start new design
    */
    if (previous && typeof previous.destroy === 'function'){
      try {
        previous.destroy();
      } catch (err) {
        console.error('Design "' + previous.id + '" failed to destroy:', err);
      }
    }

    /* The insurer picker is core-owned and lives outside #stage.
       Destroy it before replacing the current design so its document
       listener can never survive a mount. */
    if (destroyActiveInsurerPicker){
      try {
        destroyActiveInsurerPicker();
      } catch (err) {
        console.error('Insurer picker cleanup failed:', err);
      }
      destroyActiveInsurerPicker = null;
    }

    currentDesign = d;
    current = id;
    pendingRemember = !!remember;

    document.body.removeAttribute('style');
    document.body.className = '';
    document.documentElement.removeAttribute('style');

    stage.className = '';
    stage.innerHTML = '';

    var rec = sheetFor(id);

    function paint(){
      /* A later mount has superseded this pending CSS load. */
      if (seq !== mountSeq || currentDesign !== d) return;

      activate(id);
      stage.innerHTML = d.html;

      try {
        d.start();
      } catch (err) {
        console.error('Design "' + id + '" failed to start:', err);
      }

      finish();
    }

    if (!rec || rec.ready || (rec.el && rec.el.sheet)){
      paint();
    } else {
      var done = false;
      var timer = null;

      function go(){
        /* Every asynchronous callback must verify that its mount is still
           current before changing state or touching the UI. */
        if (seq !== mountSeq || currentDesign !== d){
          return;
        }

        if (done) return;
        done = true;
        rec.el.removeEventListener('load', go);
        rec.el.removeEventListener('error', go);
        if (timer !== null) clearTimeout(timer);

        cancelPendingMount = null;
        paint();
      }

      rec.el.addEventListener('load', go);
      rec.el.addEventListener('error', go);
      timer = setTimeout(go, 700);

      cancelPendingMount = function(){
        if (done) return;
        done = true;
        rec.el.removeEventListener('load', go);
        rec.el.removeEventListener('error', go);
        if (timer !== null) clearTimeout(timer);
        if (cancelPendingMount === cancelThisMount) cancelPendingMount = null;
      };

      var cancelThisMount = cancelPendingMount;
    }
  }


  function finish(){
    var d = window.GF_DESIGNS[current];
    document.title = 'Garage Finder — ' + d.name;
    window.scrollTo(0, 0);
    paintPicker();
    mountAddButton();
    enhanceControls();

    /* Each design arrives its own way — see the animation block in
       shared.css. The class is removed as soon as the animation ends,
       because a lingering transform on #stage would trap any
       position:fixed child inside it (the Index design's A–Z rail). */
    playEntrance(d.id);

    if (pendingRemember){
      pendingRemember = false;
      try { localStorage.setItem(KEY, current); } catch (e) {}
      try { history.replaceState(null, '', '#' + current); } catch (e) { location.hash = current; }
    }
  }



  /* ======================================================================
     STYLESHEETS
     ----------------------------------------------------------------------
     A stylesheet has to be fetched and parsed before it applies. If the
     markup is swapped at the same moment the href changes, the new markup
     is briefly painted with the PREVIOUS design's rules — which is what
     produced the flash of unstyled page, and stray shapes like a round
     Clay badge landing on a Board row.

     So every design's stylesheet is loaded up front, sitting inactive
     (media="not all"). Switching then only flips which one is active,
     which the browser applies immediately, with nothing to download.
     ====================================================================== */
  var sheets = {};

  function sheetFor(id){
    if (sheets[id]) return sheets[id];
    var d = window.GF_DESIGNS[id];
    if (!d) return null;

    var href = d.css + '?v=' + ASSET_V;
    var el;

    // the one already in index.html, so the first paint is never delayed
    if (link && link.getAttribute('href') && link.getAttribute('href').indexOf(d.css) === 0){
      el = link;
      el.setAttribute('href', href);
    } else {
      el = document.createElement('link');
      el.rel = 'stylesheet';
      el.href = href;
      el.media = 'not all';                 // downloads, does not apply
      el.setAttribute('data-design', id);
      document.head.appendChild(el);
    }

    /* The link that shipped in index.html has already been fetched and
       applied by the time this script runs — and a link that is already
       loaded never fires another load event, so treat it as ready. */
    var rec = {el: el, ready: (el === link) || !!el.sheet};
    el.addEventListener('load', function(){ rec.ready = true; });
    el.addEventListener('error', function(){ rec.ready = true; });
    sheets[id] = rec;
    return rec;
  }

  function activate(id){
    for (var other in sheets){
      if (sheets.hasOwnProperty(other) && other !== id) sheets[other].el.media = 'not all';
    }
    var rec = sheetFor(id);
    if (rec) rec.el.media = 'all';
  }

  /* Warm the other nine once the page is idle, so the first switch to each
     is as instant as the rest. */
  function preloadSheets(){
    ORDER.forEach(function(id){ if (window.GF_DESIGNS[id]) sheetFor(id); });
  }


  /* ======================================================================
     SEARCH SUGGESTIONS + INSURER PICKER
     ----------------------------------------------------------------------
     Both attach to whatever the mounted design already renders — the
     search box (#q) and the insurer select (#ins) — so no design file
     needs to know they exist. The markup carries neutral class hooks and
     each design's own stylesheet dresses them in its own language.

     Both panels are positioned against the viewport rather than inside the
     design's layout, so they cannot disturb it.
     ====================================================================== */

  function workshopsOnPanel(name){
    return countOnPanel(name);
  }

  /* Escape any value before it is interpolated into HTML. Prefer textContent
     / DOM APIs when building UI from scratch; use this when a template string
     is unavoidable. Covers text nodes and double-quoted attributes. */
  function esc(s){
    return String(s == null ? '' : s)
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#39;');
  }
  window.GF_esc = esc;

  /* ======================================================================
     SHARED DESIGN API  (window.GF)
     ----------------------------------------------------------------------
     Designs are pure presenters. All data, filtering, phone normalisation,
     maps links and copy-to-clipboard live here once. A design should only:
       • own its shell HTML and CSS
       • call GF.filter() / GF.phoneLines() / GF.mapsHref() / …
       • render the returned list in its own visual language
     ====================================================================== */
  var SHORT_EMIRATE = {
    'Abu Dhabi': 'AUH', Dubai: 'DXB', Sharjah: 'SHJ', Ajman: 'AJM',
    'Ras Al Khaimah': 'RAK', Fujairah: 'FUJ', 'Umm Al Quwain': 'UAQ'
  };

  function fullAddress(w){
    var a = (w.address || '').trim();
    if (!a) return w.emirate || '';
    if (!w.emirate) return a;
    return a.toLowerCase().indexOf(String(w.emirate).toLowerCase()) !== -1
      ? a : a + ', ' + w.emirate;
  }

  function mapsHref(w){
    return 'https://www.google.com/maps/search/?api=1&query=' +
      encodeURIComponent((w.name || '') + ', ' + fullAddress(w) + ', United Arab Emirates');
  }

  function parsePhones(str){
    return String(str || '')
      .split(/\s*(?:,|;|\/|\bor\b|\||\n)\s*/i)
      .map(function(s){ return s.trim(); })
      .filter(function(s){ return s.replace(/\D/g, '').length >= 6; });
  }

  function telHref(p){
    var d = String(p || '').replace(/\D/g, '');
    if (d.indexOf('00') === 0) d = d.slice(2);
    if (d.indexOf('971') === 0){
      d = d.slice(3);
      if (d.charAt(0) === '0') d = d.slice(1);
      d = '971' + d;
    } else if (d.charAt(0) === '0'){
      d = '971' + d.slice(1);
    }
    return d ? 'tel:+' + d : '';
  }

  function firstTel(str){
    var list = parsePhones(str);
    return list.length ? telHref(list[0]) : '';
  }

  function phoneLines(str, cls){
    var list = parsePhones(str);
    if (!list.length) return '';
    return '<span class="tel-lines">' + list.map(function(p){
      return '<a class="tel-line ' + (cls || '') + '" href="' + telHref(p) + '">' + esc(p) + '</a>';
    }).join('') + '</span>';
  }

  function searchHay(w){
    return (
      (w.name || '') + ' ' +
      (w.address || '') + ' ' +
      (w.emirate || '') + ' ' +
      (w.makes || []).join(' ') + ' ' +
      (w.insurers || []).join(' ')
    ).toLowerCase();
  }

  /* state: { emirate, type, insurer, q } — any field may be omitted or 'all'/'' */
  function filterWorkshops(list, state){
    state = state || {};
    var em  = state.emirate || 'all';
    var ty  = state.type    || 'all';
    var ins = state.insurer || 'all';
    var q   = (state.q || '').trim().toLowerCase();
    return (list || window.GF_DATA.workshops).filter(function(w){
      if (em  !== 'all' && w.emirate !== em) return false;
      if (ty  !== 'all' && w.type    !== ty) return false;
      if (ins !== 'all' && !(w.insurers && w.insurers.indexOf(ins) !== -1)) return false;
      if (q && searchHay(w).indexOf(q) === -1) return false;
      return true;
    });
  }

  function countOnPanel(name, list){
    list = list || window.GF_DATA.workshops;
    var n = 0;
    for (var i = 0; i < list.length; i++){
      if (list[i].insurers && list[i].insurers.indexOf(name) !== -1) n++;
    }
    return n;
  }

  function countInEmirate(name, list){
    list = list || window.GF_DATA.workshops;
    var n = 0;
    for (var i = 0; i < list.length; i++){
      if (list[i].emirate === name) n++;
    }
    return n;
  }

  function detailsText(w){
    var out = [
      w.name || '',
      w.type === 'agency' ? 'Agency workshop' : 'Non-agency workshop',
      fullAddress(w)
    ];
    if (w.phone) out.push('Phone: ' + w.phone);
    if (w.makes && w.makes.length) out.push('Makes: ' + w.makes.join(', '));
    if (w.insurers && w.insurers.length) out.push('Insurer panels: ' + w.insurers.join(', '));
    out.push(mapsHref(w));
    return out.join('\n');
  }

  function flashCopied(btn){
    var label = btn.getAttribute('data-label') || btn.textContent;
    btn.setAttribute('data-label', label);
    btn.textContent = 'Copied';
    setTimeout(function(){ btn.textContent = label; }, 1500);
  }

  function legacyCopy(text, btn){
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); flashCopied(btn); } catch (e) {}
    document.body.removeChild(ta);
  }

  function copyDetails(btn, w){
    var text = detailsText(w);
    if (navigator.clipboard && window.isSecureContext){
      navigator.clipboard.writeText(text).then(function(){ flashCopied(btn); })
        .catch(function(){ legacyCopy(text, btn); });
    } else {
      legacyCopy(text, btn);
    }
  }

  /* Wire [data-copy="<index>"] buttons inside a container.
     index refers into the array passed as list (usually the filtered list). */
  function wireCopy(container, list){
    if (!container || container.getAttribute('data-gf-copy')) return function(){};
    container.setAttribute('data-gf-copy', '1');

    function onCopyClick(e){
      var b = e.target.closest('[data-copy]');
      if (!b) return;
      e.preventDefault();
      var idx = Number(b.getAttribute('data-copy'));
      var src = list || window.GF_DATA.workshops;
      if (src[idx]) copyDetails(b, src[idx]);
    }

    container.addEventListener('click', onCopyClick);
    return function(){
      container.removeEventListener('click', onCopyClick);
      container.removeAttribute('data-gf-copy');
    };
  }

  /* ---------- lifecycle cleanup helper ---------- */
  function createCleanup(){
    var cleanups = [];

    return {
      listen: function(target, event, handler, options){
        target.addEventListener(event, handler, options);
        cleanups.push(function(){
          target.removeEventListener(event, handler, options);
        });
      },

      add: function(fn){
        if (typeof fn === 'function') cleanups.push(fn);
      },

      destroy: function(){
        while (cleanups.length){
          var cleanup = cleanups.pop();
          try {
            cleanup();
          } catch (err) {
            console.error('Cleanup failed:', err);
          }
        }
      }
    };
  }

  window.GF = {
    esc:           esc,
    emirates:      EMIRATES,
    shortEmirate:  SHORT_EMIRATE,
    fullAddress:   fullAddress,
    mapsHref:      mapsHref,
    parsePhones:   parsePhones,
    telHref:       telHref,
    firstTel:      firstTel,
    phoneLines:    phoneLines,
    searchHay:     searchHay,
    filter:        filterWorkshops,
    countOnPanel:  countOnPanel,
    countInEmirate: countInEmirate,
    detailsText:   detailsText,
    copyDetails:   copyDetails,
    wireCopy:      wireCopy,
    createCleanup: createCleanup
  };

  /* ---------- what the search box can suggest ---------- */
  var suggestIndex = null;
  function buildSuggestIndex(){
    if (suggestIndex) return suggestIndex;
    var seen = {}, out = [];
    function add(text, kind){
      if (!text) return;
      var key = kind + '|' + String(text).toLowerCase();
      if (seen[key]) return;
      seen[key] = 1;
      out.push({text: String(text), kind: kind});
    }
    window.GF_DATA.workshops.forEach(function(w){
      add(w.name, 'workshop');
      (w.makes || []).forEach(function(m){ add(m, 'make'); });
      add(w.emirate, 'emirate');
      /* the area is the useful part of an address — "Al Quoz Industrial
         Area 3, Dubai" is worth suggesting as "Al Quoz Industrial Area 3" */
      if (w.address){
        var area = w.address.split(',')[0].trim();
        if (area.length > 2 && area.length < 46) add(area, 'area');
      }
    });
    suggestIndex = out;
    return out;
  }

  /* The search box is rebuilt every time a design mounts, so nothing is
     attached to the element itself. One set of delegated listeners on the
     document handles whichever #q happens to be on the page. */
  var suggestBox = null;
  var suggestActive = -1;

  function suggestEl(){
    if (suggestBox && suggestBox.isConnected) return suggestBox;
    suggestBox = document.createElement('div');
    suggestBox.id = 'gfSuggest';
    suggestBox.className = 'gf-sugg';
    suggestBox.hidden = true;
    document.body.appendChild(suggestBox);

    suggestBox.addEventListener('mousedown', function(e){ e.preventDefault(); });
    suggestBox.addEventListener('click', function(e){
      var b = e.target.closest('.gf-sugg-row');
      if (!b) return;
      var input = document.getElementById('q');
      if (!input) return;
      input.value = b.getAttribute('data-v');
      hideSuggest();
      input.dispatchEvent(new Event('input', {bubbles:true}));   // let the design filter
      input.focus();
    });
    return suggestBox;
  }

  function hideSuggest(){
    if (suggestBox) suggestBox.hidden = true;
    suggestActive = -1;
  }

  function placeSuggest(input){
    var box = suggestEl();
    var r = input.getBoundingClientRect();
    box.style.left  = Math.round(r.left) + 'px';
    box.style.top   = Math.round(r.bottom + 6) + 'px';
    box.style.width = Math.round(r.width) + 'px';
  }

  function drawSuggest(input){
    var q = (input.value || '').trim().toLowerCase();
    if (!q){ hideSuggest(); return; }

    var all = buildSuggestIndex(), starts = [], has = [];
    for (var i = 0; i < all.length; i++){
      var l = all[i].text.toLowerCase();
      if (l.indexOf(q) === 0) starts.push(all[i]);
      else if (l.indexOf(q) !== -1) has.push(all[i]);
    }
    var hits = starts.concat(has).slice(0, 8);
    var box = suggestEl();

    if (!hits.length){
      box.innerHTML = '<p class="gf-sugg-none">Nothing matching that.</p>';
    } else {
      box.innerHTML = hits.map(function(h, k){
        return '<button class="gf-sugg-row" type="button" data-v="' + esc(h.text) + '"' +
               (k === suggestActive ? ' aria-selected="true"' : '') + '>' +
               '<span class="gf-sugg-txt">' + esc(h.text) + '</span>' +
               '<span class="gf-sugg-kind">' + h.kind + '</span></button>';
      }).join('');
    }
    placeSuggest(input);
    box.hidden = false;
  }

  function isSearchBox(el){
    return el && el.id === 'q' && stage && stage.contains(el);
  }

  document.addEventListener('input', function(e){
    if (!isSearchBox(e.target)) return;
    suggestActive = -1;
    drawSuggest(e.target);
  });
  document.addEventListener('focusin', function(e){
    if (isSearchBox(e.target)) drawSuggest(e.target);
  });
  document.addEventListener('keydown', function(e){
    if (!isSearchBox(e.target)) return;
    var box = suggestBox;
    if (!box || box.hidden) return;
    var rows = box.querySelectorAll('.gf-sugg-row');
    if (!rows.length) return;

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp'){
      e.preventDefault();
      suggestActive = (suggestActive + (e.key === 'ArrowDown' ? 1 : -1) + rows.length) % rows.length;
      drawSuggest(e.target);
    } else if (e.key === 'Enter' && suggestActive >= 0){
      e.preventDefault();
      e.target.value = rows[suggestActive].getAttribute('data-v');
      hideSuggest();
      e.target.dispatchEvent(new Event('input', {bubbles:true}));
    } else if (e.key === 'Escape'){
      hideSuggest();
    }
  });
  document.addEventListener('click', function(e){
    if (isSearchBox(e.target)) return;
    if (e.target.closest && e.target.closest('#gfSuggest')) return;
    hideSuggest();
  });
  window.addEventListener('scroll', function(){
    var input = document.getElementById('q');
    if (suggestBox && !suggestBox.hidden && input) placeSuggest(input);
  }, true);
  window.addEventListener('resize', function(){
    var input = document.getElementById('q');
    if (suggestBox && !suggestBox.hidden && input) placeSuggest(input);
  });

  /* ---------- insurer picker over the design's own <select> ---------- */
  function attachInsurerPicker(sel){
    if (!sel || sel.dataset.gfPicker) return;
    sel.dataset.gfPicker = '1';
    sel.style.display = 'none';           // keep it: the design still listens to it

    var trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'gf-ins-trigger';
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.innerHTML =
      '<span class="gf-ins-label">Insurer panel</span>' +
      '<span class="gf-ins-value">All insurers</span>' +
      '<span class="gf-ins-chev" aria-hidden="true">▾</span>';
    sel.parentNode.insertBefore(trigger, sel.nextSibling);

    var sheet = document.createElement('div');
    sheet.className = 'gf-ins-sheet';
    sheet.hidden = true;
    sheet.innerHTML =
      '<div class="gf-ins-scrim" data-close></div>' +
      '<div class="gf-ins-panel" role="dialog" aria-modal="true" aria-label="Insurer panel">' +
        '<div class="gf-ins-grab"></div>' +
        '<div class="gf-ins-top"><h2>Insurer panel</h2>' +
          '<button class="gf-ins-x" type="button" data-close aria-label="Close">&times;</button></div>' +
        '<div class="gf-ins-search"><input type="search" placeholder="Search insurers" autocomplete="off"></div>' +
        '<div class="gf-ins-list" role="listbox"></div>' +
      '</div>';
    document.body.appendChild(sheet);

    var search = sheet.querySelector('.gf-ins-search input');
    var list   = sheet.querySelector('.gf-ins-list');
    var value  = trigger.querySelector('.gf-ins-value');

    function draw(){
      var q = search.value.trim().toLowerCase();
      var rows = [];
      var withCount = [];
      var without = [];

      window.GF_DATA.insurers.forEach(function(n){
        if (q && n.toLowerCase().indexOf(q) === -1) return;
        var c = workshopsOnPanel(n);
        if (c > 0) withCount.push({name: n, count: c});
        else without.push(n);
      });

      // Active panels first, sorted by workshop count (desc) then name
      withCount.sort(function(a, b){
        return b.count - a.count || a.name.localeCompare(b.name);
      });
      without.sort(function(a, b){ return a.localeCompare(b); });

      if (!q){
        rows.push('<button class="gf-ins-row" type="button" role="option" data-v="all" aria-selected="' +
          (sel.value === 'all') + '"><span class="gf-ins-name">All insurers</span>' +
          '<span class="gf-ins-n">' + window.GF_DATA.workshops.length + '</span></button>');
        if (withCount.length) rows.push('<div class="gf-ins-sep" role="separator"></div>');
      }

      withCount.forEach(function(item){
        rows.push('<button class="gf-ins-row" type="button" role="option" data-v="' + esc(item.name) + '"' +
          ' aria-selected="' + (sel.value === item.name) + '">' +
          '<span class="gf-ins-name">' + esc(item.name) + '</span>' +
          '<span class="gf-ins-n">' + item.count + '</span></button>');
      });

      if (without.length){
        if (!q && withCount.length) rows.push('<div class="gf-ins-sep" role="separator"></div>');
        if (!q) rows.push('<div class="gf-ins-group">Other insurers</div>');
        without.forEach(function(n){
          rows.push('<button class="gf-ins-row" type="button" role="option" data-v="' + esc(n) + '"' +
            ' aria-selected="' + (sel.value === n) + '" data-empty="1">' +
            '<span class="gf-ins-name">' + esc(n) + '</span>' +
            '<span class="gf-ins-n">0</span></button>');
        });
      }

      list.innerHTML = rows.length ? rows.join('') : '<p class="gf-ins-none">No insurer by that name.</p>';
    }
    function open(){
      sheet.hidden = false;
      search.value = '';
      draw();
      setTimeout(function(){ try { search.focus({preventScroll:true}); } catch(e){} }, 60);
    }
    function close(){ sheet.hidden = true; }
    function pick(v){
      sel.value = v;
      value.textContent = v === 'all' ? 'All insurers' : v;
      trigger.classList.toggle('is-set', v !== 'all');
      sel.dispatchEvent(new Event('change', {bubbles:true}));   // the design re-renders
      close();
    }

    var cleanup = createCleanup();

    function onTriggerClick(){ open(); }
    function onSearchInput(){ draw(); }
    function onSheetClick(e){
      if (e.target.closest('[data-close]')){ close(); return; }
      var r = e.target.closest('.gf-ins-row');
      if (r) pick(r.getAttribute('data-v'));
    }
    function onPickerKeyDown(e){
      if (e.key === 'Escape' && !sheet.hidden) close();
    }

    cleanup.listen(trigger, 'click', onTriggerClick);
    cleanup.listen(search, 'input', onSearchInput);
    cleanup.listen(sheet, 'click', onSheetClick);
    cleanup.listen(document, 'keydown', onPickerKeyDown);

    /* The picker is core-owned and is recreated for each mounted design.
       Keep exactly one cleanup handle so repeated mounts cannot accumulate
       document Escape listeners. */
    function destroyPicker(){
      cleanup.destroy();
      if (sheet.parentNode) sheet.parentNode.removeChild(sheet);
      if (trigger.parentNode) trigger.parentNode.removeChild(trigger);
      sel.dataset.gfPicker = '';
      if (destroyActiveInsurerPicker === destroyPicker) {
        destroyActiveInsurerPicker = null;
      }
    }

    destroyActiveInsurerPicker = destroyPicker;
  }

  /* Called after every mount, on whatever markup the design produced. */
  function enhanceControls(){
    hideSuggest();
    if (destroyActiveInsurerPicker){
      try {
        destroyActiveInsurerPicker();
      } catch (err) {
        console.error('Insurer picker cleanup failed:', err);
      }
      destroyActiveInsurerPicker = null;
    }
    [].forEach.call(document.querySelectorAll('.gf-ins-sheet'), function(s){ s.remove(); });
    attachInsurerPicker(stage.querySelector('#ins'));
  }

  /* ======================================================================
     ENTRANCE ANIMATION
     ====================================================================== */
  var entranceTimer = null;

  function playEntrance(id){
    if (!stage) return;
    stage.className = '';
    if (entranceTimer){ clearTimeout(entranceTimer); entranceTimer = null; }

    // restart the animation even when the same design is remounted
    void stage.offsetWidth;
    stage.className = 'gf-in-' + id;

    var cleared = false;
    function clear(){
      if (cleared) return;
      cleared = true;
      stage.className = '';
      stage.removeEventListener('animationend', onEnd);
    }
    function onEnd(e){
      if (e.target === stage) clear();
    }
    stage.addEventListener('animationend', onEnd);

    // belt and braces: clear even if animationend never fires
    entranceTimer = setTimeout(clear, 1200);
  }

  /* ======================================================================
     PICKER
     ====================================================================== */
  function paintPicker(){
    var num = document.getElementById('gfNum');
    if (!num) return;
    var i = ORDER.indexOf(current);
    num.textContent = (i + 1) + '/' + ORDER.length;
    var cur = window.GF_DESIGNS[current];
    document.getElementById('gfName').textContent = cur ? cur.name : '';
    Array.prototype.forEach.call(document.querySelectorAll('#gfList .item'), function(b){
      b.setAttribute('aria-current', b.getAttribute('data-id') === current ? 'true' : 'false');
    });
  }

  function buildPicker(){
    if (!SHOW_PICKER) return;
    if (!Object.keys(window.GF_DESIGNS).length) return;
    var wrap = document.createElement('div');
    wrap.id = 'gfPicker';
    wrap.innerHTML =
      '<div id="gfMenu" hidden><h3>Choose a design</h3><div id="gfList">' +
      ORDER.map(function(id, i){
        var d = window.GF_DESIGNS[id];
        if (!d) return '';
        return '<button class="item" type="button" data-id="' + esc(id) + '" aria-current="false">' +
                 '<span class="sw" style="background:' + esc(d.swatch) + '"></span>' +
                 '<span><strong>' + (i+1) + '. ' + esc(d.name) + '</strong><small>' + esc(d.note) + '</small></span>' +
               '</button>';
      }).join('') +
      '</div><p class="hint">Each design is its own page. Your choice is remembered on this device. Press [ and ] to cycle.</p></div>' +
      '<button id="gfToggle" type="button" aria-expanded="false">' +
        '<span class="n" id="gfNum"></span><span id="gfName"></span></button>';
    document.body.appendChild(wrap);

    var menu = document.getElementById('gfMenu');
    var toggle = document.getElementById('gfToggle');

    toggle.addEventListener('click', function(){
      var open = menu.hidden;
      menu.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
    });
    document.getElementById('gfList').addEventListener('click', function(e){
      var b = e.target.closest('.item'); if (!b) return;
      mount(b.getAttribute('data-id'), true);
      menu.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
    });
    document.addEventListener('click', function(e){
      if (!menu.hidden && !e.target.closest('#gfPicker')){
        menu.hidden = true;
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', function(e){
      if (e.key === 'Escape'){ menu.hidden = true; toggle.setAttribute('aria-expanded','false'); return; }
      if (e.target.matches('input, select, textarea')) return;
      if (document.getElementById('gfAdd') && !document.getElementById('gfAdd').hidden) return;
      if (e.key === '[' || e.key === ']'){
        var i = ORDER.indexOf(current);
        mount(ORDER[(i + (e.key === ']' ? 1 : -1) + ORDER.length) % ORDER.length], true);
      }
    });
  }


  /* ======================================================================
     PHONE NUMBERS — call, WhatsApp, copy
     Designs render a workshop's phone as a single tel: link, even when the
     record holds several numbers. Clicks are intercepted here so every
     design gets one sheet listing each number separately.
     ====================================================================== */

  function parsePhones(str){
    return String(str || '')
      .split(/\s*(?:,|;|\/|\bor\b|\||\n)\s*/i)
      .map(function(s){ return s.trim(); })
      .filter(function(s){ return (s.replace(/\D/g, '').length >= 6); });
  }

  /* UAE numbers to international form, for tel: and wa.me links. */
  function intlDigits(num){
    var d = String(num || '').replace(/\D/g, '');
    if (d.indexOf('00') === 0) d = d.slice(2);
    if (d.indexOf('971') === 0){
      var rest = d.slice(3);
      if (rest.charAt(0) === '0') rest = rest.slice(1);   // drop the trunk 0
      return '971' + rest;
    }
    if (d.charAt(0) === '0')    return '971' + d.slice(1);
    if (d.length === 9 && d.charAt(0) === '5') return '971' + d;
    return d;
  }
  function isMobile(num){ return /^9715\d{8}$/.test(intlDigits(num)); }

  function copyText(text, btn){
    var done = function(){
      var was = btn.textContent;
      btn.textContent = 'Copied';
      setTimeout(function(){ btn.textContent = was; }, 1400);
    };
    if (navigator.clipboard && window.isSecureContext){
      navigator.clipboard.writeText(text).then(done).catch(function(){ legacyCopy(text, done); });
    } else { legacyCopy(text, done); }
  }
  function legacyCopy(text, done){
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); done(); } catch (e) {}
    document.body.removeChild(ta);
  }

  function openCallSheet(numbers, title){
    var box = document.getElementById('gfCall');
    if (!box){
      box = document.createElement('div');
      box.id = 'gfCall';
      document.body.appendChild(box);
      box.addEventListener('click', function(e){
        if (e.target === box) box.hidden = true;
        var close = e.target.closest('#gfCallClose');
        if (close) box.hidden = true;
        var copy = e.target.closest('[data-copynum]');
        if (copy){ copyText(copy.getAttribute('data-copynum'), copy); }
      });
    }
    box.innerHTML =
      '<div class="gf-sheet" role="dialog" aria-modal="true" aria-label="Call this workshop">' +
        '<div class="gf-sheet-top"><h2>' + (title || 'Call') + '</h2>' +
          '<button type="button" id="gfCallClose" aria-label="Close">&times;</button></div>' +
        (numbers.length > 1
          ? '<p class="gf-sheet-note">' + numbers.length + ' numbers on file — pick one.</p>'
          : '') +
        numbers.map(function(n){
          var intl = intlDigits(n);
          return '<div class="gf-num">' +
            '<span class="gf-num-txt">' + n + '</span>' +
            '<div class="gf-num-acts">' +
              '<a class="gf-num-btn is-call" href="tel:' + (intl ? '+' + intl : n.replace(/\s/g,'')) + '">Call</a>' +
              (isMobile(n)
                ? '<a class="gf-num-btn is-wa" href="https://wa.me/' + intl + '" target="_blank" rel="noopener">WhatsApp</a>'
                : '<span class="gf-num-btn is-off" title="Not a mobile number">WhatsApp</span>') +
              '<button type="button" class="gf-num-btn" data-copynum="' + n.replace(/"/g, '&quot;') + '">Copy</button>' +
            '</div>' +
          '</div>';
        }).join('') +
      '</div>';
    box.hidden = false;
  }

  /* Any tel: link in any design opens the sheet instead of dialling blind. */
  document.addEventListener('click', function(e){
    var a = e.target.closest && e.target.closest('a[href^="tel:"]');
    if (!a) return;
    if (a.closest('#gfCall')) return;          // the sheet's own Call button
    e.preventDefault();

    var raw = decodeURIComponent(a.getAttribute('href').slice(4));
    var digits = raw.replace(/\D/g, '').slice(-9);

    /* Find the workshop this number belongs to, so every number it has is
       offered — designs often render them all as one link. */
    var found = null;
    for (var i = 0; i < window.GF_DATA.workshops.length && !found; i++){
      var w = window.GF_DATA.workshops[i];
      if (w.phone && w.phone.replace(/\D/g, '').indexOf(digits) !== -1) found = w;
    }
    var nums = found ? parsePhones(found.phone) : parsePhones(raw);
    if (!nums.length) nums = [raw];
    openCallSheet(nums, found ? found.name : 'Call');
  });

  /* ======================================================================
     TYPE-AHEAD for the comma-separated fields
     ====================================================================== */
  function attachSuggest(input, listFn, label){
    var wrap = document.createElement('div');
    wrap.className = 'gf-sugg';
    input.parentNode.insertBefore(wrap, input.nextSibling);

    function segments(){ return input.value.split(','); }
    function currentTerm(){ return segments()[segments().length - 1].trim(); }

    function close(){ wrap.innerHTML = ''; }

    function choose(value){
      var segs = segments();
      segs[segs.length - 1] = ' ' + value;
      input.value = segs.join(',').replace(/^\s+/, '') + ', ';
      close();
      input.focus();
      check();
    }

    function render(){
      var term = currentTerm().toLowerCase();
      if (!term){ close(); return; }
      var all = listFn();
      var chosen = segments().slice(0, -1).map(function(s){ return s.trim().toLowerCase(); });
      var starts = [], has = [];
      all.forEach(function(n){
        var l = n.toLowerCase();
        if (chosen.indexOf(l) !== -1) return;
        if (l.indexOf(term) === 0) starts.push(n);
        else if (l.indexOf(term) !== -1) has.push(n);
      });
      var hits = starts.concat(has).slice(0, 8);
      if (!hits.length){
        wrap.innerHTML = '<p class="gf-sugg-none">No ' + label + ' by that name. ' +
          'Check the spelling, or ask the site owner to add it.</p>';
        return;
      }
      wrap.innerHTML = hits.map(function(n){
        return '<button type="button" class="gf-sugg-item" data-v="' +
               esc(n) + '">' + esc(n) + '</button>';
      }).join('');
    }

    /* Warn about anything typed that isn't on the list. */
    function check(){
      var all = listFn().map(function(n){ return n.toLowerCase(); });
      var bad = input.value.split(',').map(function(s){ return s.trim(); })
        .filter(Boolean)
        .filter(function(s){ return all.indexOf(s.toLowerCase()) === -1; });
      var note = input.parentNode.querySelector('.gf-unknown');
      if (!note){
        note = document.createElement('p');
        note.className = 'gf-unknown';
        input.parentNode.appendChild(note);
      }
      if (bad.length){
        note.hidden = false;
        note.textContent = 'Not on the ' + label + ' list: ' + bad.join(', ') +
          ' — it will not match any filter until the site owner adds it.';
      } else {
        note.hidden = true;
      }
    }

    input.addEventListener('input', function(){ render(); check(); });
    input.addEventListener('focus', render);
    wrap.addEventListener('click', function(e){
      var b = e.target.closest('.gf-sugg-item');
      if (b) choose(b.getAttribute('data-v'));
    });
    input.addEventListener('keydown', function(e){
      var first = wrap.querySelector('.gf-sugg-item');
      if (e.key === 'Enter' && first){ e.preventDefault(); choose(first.getAttribute('data-v')); }
      if (e.key === 'Escape') close();
    });
    document.addEventListener('click', function(e){
      if (!e.target.closest || (!e.target.closest('.gf-sugg') && e.target !== input)) close();
    });
  }

  function allMakes(){
    var seen = {}, out = [];
    window.GF_DATA.workshops.forEach(function(w){
      (w.makes || []).forEach(function(m){
        var k = m.toLowerCase();
        if (!seen[k]){ seen[k] = 1; out.push(m); }
      });
    });
    return out.sort();
  }

  /* ======================================================================
     ADD WORKSHOP
     One shared form, so every design offers it and the payload matches
     submit.php exactly.
     ====================================================================== */
  function mountAddButton(){
    if (!SUBMIT_ENDPOINT) return;
    if (document.getElementById('gfAddBtn')) return;
    var b = document.createElement('button');
    b.id = 'gfAddBtn';
    b.type = 'button';
    b.textContent = '+ Add workshop';
    b.addEventListener('click', openAdd);
    document.body.appendChild(b);
  }

  function field(label, id, ph, tag){
    return '<label class="gf-f"><span>' + label + '</span>' +
      (tag === 'textarea'
        ? '<textarea id="' + id + '" rows="3" placeholder="' + ph + '"></textarea>'
        : '<input id="' + id + '" placeholder="' + ph + '">') + '</label>';
  }

  function openAdd(){
    var box = document.getElementById('gfAdd');
    if (!box){
      box = document.createElement('div');
      box.id = 'gfAdd';
      box.innerHTML =
        '<div class="gf-sheet" role="dialog" aria-modal="true" aria-label="Add a workshop">' +
          '<div class="gf-sheet-top"><h2>Add a workshop</h2>' +
            '<button type="button" id="gfAddClose" aria-label="Close">&times;</button></div>' +
          '<p class="gf-sheet-note">This is sent to the site owner for review. It shows in your own list straight away, marked as awaiting review, and disappears from your device once the owner publishes it. <button type="button" id="gfClearMine" class="gf-linkbtn">Clear my saved additions</button></p>' +
          '<label class="gf-f"><span>Type</span><select id="gfType">' +
            '<option value="agency">Agency (dealer workshop)</option>' +
            '<option value="nonagency">Non-agency</option></select></label>' +
          field('Workshop name', 'gfName2', 'e.g. Al Habtoor Motors Service Centre') +
          '<label class="gf-f"><span>Emirate</span><select id="gfEmirate">' +
            EMIRATES.map(function(e){ return '<option>' + e + '</option>'; }).join('') +
          '</select></label>' +
          field('Address', 'gfAddress', 'Area, street') +
          field('Phone', 'gfPhone', 'e.g. 04 123 4567') +
          field('Opening hours', 'gfHours', 'e.g. Sat–Thu 8am–7pm') +
          '<div id="gfMakesWrap">' + field('Car makes', 'gfMakes', 'Start typing — pick from the list. Separate several with commas') + '</div>' +
          '<div id="gfInsWrap" hidden>' + field('Insurer panels', 'gfIns', 'Start typing — pick from the list. Separate several with commas') + '</div>' +
          field('Notes', 'gfNotes', 'Anything worth knowing before dispatch', 'textarea') +
          '<p class="gf-msg" id="gfMsg" hidden></p>' +
          '<div class="gf-sheet-acts">' +
            '<button type="button" class="gf-secondary" id="gfCancel">Cancel</button>' +
            '<button type="button" class="gf-primary" id="gfSave">Send for review</button>' +
          '</div>' +
        '</div>';
      document.body.appendChild(box);

      document.getElementById('gfAddClose').addEventListener('click', closeAdd);
      document.getElementById('gfCancel').addEventListener('click', closeAdd);
      box.addEventListener('click', function(e){ if (e.target === box) closeAdd(); });
      document.getElementById('gfType').addEventListener('change', function(e){
        var non = e.target.value === 'nonagency';
        document.getElementById('gfInsWrap').hidden = !non;
        document.getElementById('gfMakesWrap').hidden = non;
      });
      attachSuggest(document.getElementById('gfIns'),
                    function(){ return window.GF_DATA.insurers; }, 'insurer');
      attachSuggest(document.getElementById('gfMakes'), allMakes, 'car make');
      document.getElementById('gfSave').addEventListener('click', save);
      document.getElementById('gfClearMine').addEventListener('click', function(){
        writeLocal([]);
        window.GF_DATA.workshops = window.GF_DATA.workshops.filter(function(x){ return !x.pending; });
        say('Cleared. Anything still awaiting review is gone from this device only — the owner still has your submission.', true);
        setTimeout(function(){ closeAdd(); mount(current, false); }, 1200);
      });
    }
    box.hidden = false;
    document.getElementById('gfName2').focus();
  }

  function closeAdd(){
    var box = document.getElementById('gfAdd');
    if (box) box.hidden = true;
  }

  function list(v){
    return String(v || '').split(',').map(function(s){ return s.trim(); }).filter(Boolean);
  }

  function say(text, ok){
    var m = document.getElementById('gfMsg');
    m.hidden = false;
    m.textContent = text;
    m.className = 'gf-msg ' + (ok ? 'is-ok' : 'is-bad');
  }

  function save(){
    var type = document.getElementById('gfType').value;
    var w = {
      type:     type,
      name:     document.getElementById('gfName2').value.trim(),
      emirate:  document.getElementById('gfEmirate').value,
      address:  document.getElementById('gfAddress').value.trim(),
      phone:    document.getElementById('gfPhone').value.trim(),
      hours:    document.getElementById('gfHours').value.trim(),
      notes:    document.getElementById('gfNotes').value.trim(),
      makes:    type === 'agency'    ? list(document.getElementById('gfMakes').value) : [],
      insurers: type === 'nonagency' ? list(document.getElementById('gfIns').value)   : []
    };
    if (!w.name){ say('A workshop name is required.', false); return; }

    // show it to this visitor immediately, without creating a second copy
    var saved = readLocal().filter(function(x){ return !samePlace(x, w); });
    saved.push(w);
    writeLocal(saved);
    window.GF_DATA.workshops = window.GF_DATA.workshops.filter(function(x){
      return !(x.pending && samePlace(x, w));
    });
    var added = norm(w, type);
    added.pending = true;
    window.GF_DATA.workshops.push(added);
    window.GF_DATA.workshops.sort(function(a, b){ return a.name.localeCompare(b.name); });

    var btn = document.getElementById('gfSave');
    btn.disabled = true;
    btn.textContent = 'Sending…';

    fetch(SUBMIT_ENDPOINT, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ action: 'submit', workshop: Object.assign({}, w, {kind: 'new', target: ''}) })
    })
    .then(function(r){ return r.json(); })
    .then(function(res){
      if (res && res.ok) say('Sent for review. It is in your list now, marked as awaiting review.', true);
      else say((res && res.error) || 'The server rejected it, but it is saved on this device.', false);
    })
    .catch(function(){
      say('Could not reach the server. It is saved on this device only.', false);
    })
    .then(function(){
      btn.disabled = false;
      btn.textContent = 'Send for review';
      setTimeout(function(){ closeAdd(); mount(current, false); }, 1200);
    });
  }

  /* ======================================================================
     START
     ====================================================================== */
  function boot(){
    stage = document.getElementById('stage');
    link  = document.getElementById('design-css');
    buildPicker();

    var fromHash = (location.hash || '').replace('#', '');
    var saved = null;
    try { saved = localStorage.getItem(KEY); } catch (e) {}
    mount(known(fromHash) ? fromHash : (known(saved) ? saved : DEFAULT_DESIGN), false);

    /* warm the remaining stylesheets once the first design is up */
    if (window.requestIdleCallback) requestIdleCallback(preloadSheets);
    else setTimeout(preloadSheets, 400);

    window.addEventListener('hashchange', function(){
      mount((location.hash || '').replace('#', ''), false);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
