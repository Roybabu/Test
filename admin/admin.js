/* ============================================================================
   ADMIN PAGE
   ============================================================================
   Reads data/pending-submissions.json through submit.php, and turns pending
   submissions into blocks you can paste straight into data-agency.js or
   data-nonagency.js. It never edits those files itself — merging stays a
   deliberate, manual step.
   ============================================================================ */

const ENDPOINT = 'submit.php';

let adminKey = sessionStorage.getItem('gf_admin_key') || '';
let rows = [];
let statusFilter = 'pending';
let exportType = 'agency';

const $ = id => document.getElementById(id);

function esc(s){
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

async function api(payload){
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(Object.assign({key: adminKey}, payload))
  });
  let data;
  try{ data = await res.json(); }
  catch(e){ throw new Error('The server did not return valid data. Is submit.php uploaded and is PHP enabled?'); }
  if(!data.ok) throw new Error(data.error || 'Request failed.');
  return data;
}

// ---- unlock ---------------------------------------------------------------

async function unlock(){
  const key = $('admin-key').value.trim();
  if(!key){ $('gate-msg').textContent = 'Enter the admin key.'; return; }
  adminKey = key;
  try{
    await load();
    sessionStorage.setItem('gf_admin_key', key);
    $('gate').style.display = 'none';
    $('panel').style.display = 'block';
  }catch(e){
    adminKey = '';
    $('gate-msg').textContent = e.message;
  }
}

function lock(){
  adminKey = '';
  sessionStorage.removeItem('gf_admin_key');
  rows = [];
  $('panel').style.display = 'none';
  $('gate').style.display = 'block';
  $('admin-key').value = '';
  $('pending-stamp').textContent = 'locked';
}

$('unlock-btn').addEventListener('click', unlock);
$('admin-key').addEventListener('keydown', e => { if(e.key === 'Enter') unlock(); });
$('lock-btn').addEventListener('click', lock);
$('refresh-btn').addEventListener('click', () => load().catch(e => alert(e.message)));

// ---- load and render ------------------------------------------------------

async function load(){
  const data = await api({action: 'list'});
  rows = data.rows || [];
  const pending = rows.filter(r => r.status === 'pending').length;
  $('pending-stamp').textContent = pending + ' pending';
  renderList();
  renderExport();
}

function renderList(){
  const shown = rows.filter(r => statusFilter === 'all' || r.status === statusFilter);
  $('showing').textContent = 'Showing ' + shown.length + ' of ' + rows.length;

  if(!shown.length){
    $('sub-list').innerHTML = '<div class="empty">Nothing here yet.</div>';
    return;
  }

  $('sub-list').innerHTML = shown.map(r => {
    const w = r.workshop || {};
    const when = r.received ? new Date(r.received).toLocaleString() : '';
    return `
      <div class="sub-card ${esc(r.status)}">
        <div class="sub-head">
          <div>
            <h3>${esc(w.name || '(no name)')}</h3>
            <div class="sub-meta">
              <span class="badge ${esc(w.type)}">${w.type === 'agency' ? 'Agency' : 'Non-agency'}</span>
              <span>${esc(w.emirate || 'no emirate')}</span>
              <span>${esc(when)}</span>
              ${r.kind === 'edit' ? `<span class="edit-flag">edit of: ${esc(r.target || 'existing entry')}</span>` : ''}
            </div>
          </div>
          <span class="sub-status ${esc(r.status)}">${esc(r.status)}</span>
        </div>
        <dl class="sub-fields">
          <dt>Address</dt><dd>${esc(w.address) || '—'}</dd>
          <dt>Phone</dt><dd>${esc(w.phone) || '—'}</dd>
          <dt>Hours</dt><dd>${esc(w.hours) || '—'}</dd>
          <dt>Makes</dt><dd>${esc((w.makes || []).join(', ')) || '—'}</dd>
          ${w.type === 'nonagency' ? `<dt>Insurers</dt><dd>${esc((w.insurers || []).join(', ')) || '—'}</dd>` : ''}
          <dt>Notes</dt><dd>${esc(w.notes) || '—'}</dd>
        </dl>
        <div class="sub-actions">
          <button data-act="copy" data-id="${esc(r.id)}">Copy block</button>
          ${r.status !== 'merged'   ? `<button data-act="merged"   data-id="${esc(r.id)}">Mark merged</button>` : ''}
          ${r.status !== 'rejected' ? `<button data-act="rejected" data-id="${esc(r.id)}">Reject</button>` : ''}
          ${r.status !== 'pending'  ? `<button data-act="pending"  data-id="${esc(r.id)}">Back to pending</button>` : ''}
          <button class="del" data-act="delete" data-id="${esc(r.id)}">Delete</button>
        </div>
      </div>`;
  }).join('');
}

// ---- block generation (mirrors the layout of the data files) ---------------

function q(v){ return JSON.stringify(v == null ? '' : String(v)); }

function list(items){
  const arr = (items || []).filter(Boolean);
  if(!arr.length) return '[]';
  const inline = '[' + arr.map(q).join(', ') + ']';
  if(arr.length === 1 || inline.length <= 72) return inline;
  return '[\n' + arr.map(i => '      ' + q(i)).join(',\n') + '\n    ]';
}

function blockFor(w){
  const fields = w.type === 'agency'
    ? [
        ['name',    q(w.name)],
        ['makes',   list(w.makes && w.makes.length ? w.makes : ['All makes'])],
        ['emirate', q(w.emirate)],
        ['address', q(w.address)],
        ['phone',   q(w.phone)],
        ['hours',   q(w.hours)],
        ['notes',   q(w.notes)]
      ]
    : [
        ['name',     q(w.name)],
        ['emirate',  q(w.emirate)],
        ['address',  q(w.address)],
        ['phone',    q(w.phone)],
        ['hours',    q(w.hours)],
        ['insurers', list(w.insurers)],
        ['notes',    q(w.notes)]
      ];
  const width = Math.max.apply(null, fields.map(f => f[0].length)) + 1;
  const lines = fields.map(f => '    ' + (f[0] + ':').padEnd(width + 1) + f[1]);
  return '  {\n' + lines.join(',\n') + '\n  },';
}

function renderExport(){
  const pending = rows.filter(r => r.status === 'pending' && (r.workshop || {}).type === exportType);
  $('export-count').textContent = pending.length + ' pending ' + (exportType === 'agency' ? 'agency' : 'non-agency');
  $('export-text').value = pending.length
    ? pending.map(r => blockFor(r.workshop)).join('\n\n')
    : 'No pending ' + (exportType === 'agency' ? 'agency' : 'non-agency') + ' submissions.';
}

// ---- events ---------------------------------------------------------------

document.querySelectorAll('.admin-filters button').forEach(b => {
  b.addEventListener('click', () => {
    document.querySelectorAll('.admin-filters button').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    statusFilter = b.dataset.s;
    renderList();
  });
});

document.querySelectorAll('.export-tabs button').forEach(b => {
  b.addEventListener('click', () => {
    document.querySelectorAll('.export-tabs button').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    exportType = b.dataset.x;
    renderExport();
  });
});

async function copyText(text){
  try{
    await navigator.clipboard.writeText(text);
    return true;
  }catch(e){
    const ta = $('export-text');
    ta.focus();
    ta.select();
    return false;
  }
}

$('copy-btn').addEventListener('click', async () => {
  const ok = await copyText($('export-text').value);
  $('copy-msg').textContent = ok ? 'Copied.' : 'Selected — press Ctrl+C / Cmd+C.';
  setTimeout(() => { $('copy-msg').textContent = ''; }, 3000);
});

$('sub-list').addEventListener('click', async (e) => {
  const btn = e.target.closest('button[data-act]');
  if(!btn) return;
  const id = btn.dataset.id;
  const act = btn.dataset.act;
  const row = rows.find(r => r.id === id);

  try{
    if(act === 'copy'){
      const ok = await copyText(blockFor(row.workshop));
      btn.textContent = ok ? 'Copied' : 'Copy failed';
      setTimeout(() => { btn.textContent = 'Copy block'; }, 2000);
      return;
    }
    if(act === 'delete'){
      if(!confirm('Delete this submission permanently?')) return;
      await api({action: 'delete', id: id});
    }else{
      await api({action: 'status', id: id, status: act});
    }
    await load();
  }catch(err){
    alert(err.message);
  }
});

$('clear-btn').addEventListener('click', async () => {
  if(!confirm('Remove every submission already marked merged or rejected? Pending ones are kept.')) return;
  try{
    await api({action: 'clear-handled'});
    await load();
  }catch(e){ alert(e.message); }
});

// auto-unlock if the key is still in this tab's session
if(adminKey){
  load().then(() => {
    $('gate').style.display = 'none';
    $('panel').style.display = 'block';
  }).catch(() => { adminKey = ''; sessionStorage.removeItem('gf_admin_key'); });
}
