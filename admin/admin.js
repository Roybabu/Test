'use strict';
const ENDPOINT='submit.php';
let csrfToken='';
let rows=[], statusFilter='pending', verificationRows=[], verificationVisible=false, auditVisible=false;
const $=id=>document.getElementById(id);
const esc=window.GF_SECURITY.escapeHTML;

async function request(action, payload={}, method='POST', mutate=false){
  const options={method,credentials:'same-origin',headers:{'Accept':'application/json'}};
  if(method==='POST'){
    options.headers['Content-Type']='application/json';
    if(csrfToken) options.headers['X-CSRF-Token']=csrfToken;
    options.body=JSON.stringify(Object.assign({action},payload));
  } else {
    options.url=`${ENDPOINT}?action=${encodeURIComponent(action)}`;
  }
  const url=options.url||ENDPOINT;
  delete options.url;
  const res=await fetch(url,options);
  let data; try{data=await res.json()}catch(e){throw new Error('Server returned invalid JSON.')}
  if(!data.ok) throw new Error(data.error||'Request failed.');
  return data;
}

async function api(payload, mutate=false){ return request(payload.action,payload, 'POST', mutate); }

async function unlock(){
  const key=$('admin-key').value;
  if(!key){$('gate-msg').textContent='Enter the admin secret.';return}
  try{
    const data=await request('login',{key},'POST',false);
    csrfToken=data.csrfToken||'';
    $('admin-key').value='';
    $('gate').classList.add('is-hidden');
    $('panel').classList.remove('is-hidden');
    $('gate-msg').textContent='Authenticated server-side. The admin secret is not stored in this browser.';
    await load();
  }catch(e){
    csrfToken='';
    $('gate-msg').textContent=e.message;
  }
}

async function restoreSession(){
  try{
    const data=await request('session',{},'GET',false);
    csrfToken=data.csrfToken||'';
    $('gate').classList.add('is-hidden');
    $('panel').classList.remove('is-hidden');
    await load();
  }catch(e){
    csrfToken='';
    $('panel').classList.add('is-hidden');
    $('gate').classList.remove('is-hidden');
  }
}

async function lock(){
  try{if(csrfToken) await request('logout',{},'POST',true)}catch(e){}
  csrfToken=''; rows=[]; verificationRows=[]; verificationVisible=false; auditVisible=false;
  $('panel').classList.add('is-hidden');$('gate').classList.remove('is-hidden');$('admin-key').value='';$('pending-stamp').textContent='locked';
}

$('unlock-btn').addEventListener('click',unlock);
$('admin-key').addEventListener('keydown',e=>{if(e.key==='Enter')unlock()});
$('lock-btn').addEventListener('click',lock);
$('refresh-btn').addEventListener('click',()=>load().catch(e=>alert(e.message)));

async function load(){
  const data=await api({action:'list'}); rows=data.rows||[];
  const pending=rows.filter(r=>r.status==='pending').length;
  const approved=rows.filter(r=>r.status==='approved').length;
  $('pending-stamp').textContent=`${pending} pending · ${approved} approved`;
  renderList();
  if(verificationVisible)await loadVerification();
  if(auditVisible)await loadAudit();
}

function renderList(){
  const shown=rows.filter(r=>statusFilter==='all'||r.status===statusFilter);
  $('showing').textContent=`Showing ${shown.length} of ${rows.length}`;
  $('sub-list').innerHTML=shown.length?shown.map(r=>{const w=r.workshop||{};const when=r.received?new Date(r.received).toLocaleString():'';return `<div class="sub-card ${esc(r.status)}"><div class="sub-head"><div><h3>${esc(w.name||'(no name)')}</h3><div class="sub-meta"><span class="badge ${esc(w.type)}">${w.type==='agency'?'Agency':'Non-agency'}</span><span>${esc(w.emirate||'')}</span><span>${esc(when)}</span>${w.duplicateReview?'<span class="edit-flag">possible duplicate — review</span>':''}</div></div><span class="sub-status ${esc(r.status)}">${esc(r.status)}</span></div><dl class="sub-fields"><dt>Address</dt><dd>${esc(w.address)||'—'}</dd><dt>Phone</dt><dd>${esc(w.phone)||'—'}</dd><dt>Hours</dt><dd>${esc(w.hours)||'—'}</dd><dt>Makes</dt><dd>${esc((w.makes||[]).join(', '))||'—'}</dd>${w.type==='nonagency'?`<dt>Insurers</dt><dd>${esc((w.insurers||[]).join(', '))||'—'}`:''}<dt>Notes</dt><dd>${esc(w.notes)||'—'}</dd></dl><div class="sub-actions">${r.status==='pending'?`<button data-act="approve" data-id="${esc(r.id)}">Approve</button>`:''}${r.status==='approved'?`<button data-act="publish" data-id="${esc(r.id)}">Publish</button>`:''}${r.status!=='rejected'&&r.status!=='published'?`<button data-act="reject" data-id="${esc(r.id)}">Reject</button>`:''}${r.status!=='published'?`<button data-act="edit" data-id="${esc(r.id)}">Edit</button>`:''}<button class="del" data-act="delete" data-id="${esc(r.id)}">Delete</button></div></div>`}).join(''):'<div class="empty">Nothing here yet.</div>'
}

$('sub-list').addEventListener('click',async e=>{const b=e.target.closest('button[data-act]');if(!b)return;const id=b.dataset.id,act=b.dataset.act;try{if(act==='edit')return await editSubmission(id);if(act==='approve')await api({action:'approve',id},true);else if(act==='reject')await api({action:'reject',id},true);else if(act==='publish')await api({action:'publish',id},true);else if(act==='delete'){if(!confirm('Delete this submission permanently?'))return;await api({action:'delete',id},true);}await load()}catch(err){alert(err.message)}});

async function editSubmission(id){const r=rows.find(x=>x.id===id);if(!r)return;const w=Object.assign({},r.workshop);for(const field of ['name','address','phone','hours','notes']){const next=prompt(`Edit ${field}:`,w[field]||'');if(next===null)return;w[field]=next}await api({action:'edit',id,workshop:w},true);await load()}
Array.from(document.querySelectorAll('.admin-filters button')).forEach(b=>b.addEventListener('click',()=>{Array.from(document.querySelectorAll('.admin-filters button')).forEach(x=>x.classList.remove('active'));b.classList.add('active');statusFilter=b.dataset.s;renderList()}));
$('clear-btn').addEventListener('click',async()=>{if(!confirm('Clear rejected and published submissions from the submission queue?'))return;try{await api({action:'clear'},true);await load()}catch(e){alert(e.message)}});

async function loadVerification(){const data=await api({action:'verification-list'});verificationRows=data.workshops||[];$('verification-showing').textContent=`${verificationRows.length} workshops`;$('verification-list').innerHTML=verificationRows.map(w=>`<article class="verification-card"><div class="verification-head"><div><h3>${esc(w.name||'(no name)')}</h3><div class="verification-meta"><span>${esc(w.emirate||'')}</span><span>${esc(w.type||'')}</span><span>Source: ${esc(w.source||'—')}</span><span>Last verified: ${esc(w.lastVerified||'Never')}</span></div></div><span class="verification-status ${esc(w.verificationStatus||'review')}">${esc(w.verificationStatus||'review')}</span></div><div class="verification-actions"><button data-verify-status="verified" data-id="${esc(w.id)}">Verified</button><button data-verify-status="outdated" data-id="${esc(w.id)}">Outdated</button><button data-verify-status="review" data-id="${esc(w.id)}">Review</button></div></article>`).join('')||'<div class="empty">No published workshops.</div>'}
$('verify-btn').addEventListener('click',async()=>{verificationVisible=!verificationVisible;$('verification-panel').hidden=!verificationVisible;if(verificationVisible)try{await loadVerification()}catch(e){alert(e.message)}});
$('verification-list').addEventListener('click',async e=>{const b=e.target.closest('button[data-verify-status]');if(!b)return;try{await api({action:'verification',id:b.dataset.id,status:b.dataset.verifyStatus},true);await loadVerification()}catch(err){alert(err.message)}});
async function loadAudit(){const data=await api({action:'audit-list'});const list=data.rows||[];$('audit-showing').textContent=`${list.length} entries`;$('audit-list').innerHTML=list.length?list.map(x=>`<article class="audit-card"><div class="audit-meta"><span class="audit-action">${esc(x.actionType)}</span><span>${esc(x.timestamp)}</span><span>Submission: ${esc(x.submissionId||'—')}</span><span>${esc(x.previousStatus||'—')} → ${esc(x.newStatus||'—')}</span><span>Admin: ${esc(x.administrator||'admin')}</span></div><div>${esc(JSON.stringify(x.metadata||{}))}</div></article>`).join(''):'<div class="empty">No audit entries.</div>'}
$('audit-btn').addEventListener('click',async()=>{auditVisible=!auditVisible;$('audit-panel').hidden=!auditVisible;if(auditVisible)try{await loadAudit()}catch(e){alert(e.message)}});

restoreSession();
