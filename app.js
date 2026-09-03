const DEMO_CREATORS=[
 {name:'Aarav',handle:'@aarav',bio:'building things on the internet ✦',seed:'Aarav',badge:'✓'},
 {name:'Nova',handle:'@nova',bio:'art • music • late nights',seed:'Nova',badge:'★'},
 {name:'Pixel',handle:'@pixel',bio:'designer & digital creator',seed:'Pixel',badge:'✦'},
 {name:'Lumi',handle:'@lumi',bio:'just making the web prettier',seed:'Lumi',badge:'✓'},
 {name:'Kai',handle:'@kai',bio:'games, code and coffee',seed:'Kai',badge:'★'},
 {name:'Milo',handle:'@milo',bio:'photography / motion / life',seed:'Milo',badge:'✦'}
];
const OWNER_EMAIL='aaravg78201333@gmail.com';
const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
const getUsers=()=>JSON.parse(localStorage.getItem('spiderSenseUsers')||'[]');
const saveUsers=u=>localStorage.setItem('spiderSenseUsers',JSON.stringify(u));
const current=()=>JSON.parse(localStorage.getItem('spiderSenseCurrent')||'null');
const setCurrent=u=>u?localStorage.setItem('spiderSenseCurrent',JSON.stringify(u)):localStorage.removeItem('spiderSenseCurrent');
const esc=s=>String(s??'').replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[m]));

function show(view){
  $$('.view').forEach(v=>v.classList.remove('active'));
  const el=$('#'+view); if(el){el.classList.add('active');window.scrollTo({top:0,behavior:'smooth'});}
}
function creatorList(){
  const users=getUsers().map(u=>({name:u.name,handle:'@'+u.username,bio:u.bio||'creator on Spider Sense',seed:u.username,badge:u.badge||'✦'}));
  return [...users,...DEMO_CREATORS];
}
function renderCreators(list=creatorList()){
  const grid=$('#creatorGrid'); if(!grid)return;
  grid.innerHTML=list.map(c=>`<article class="creator" data-profile="${esc(c.handle.replace('@',''))}"><div class="creator-top"><img src="https://api.dicebear.com/9.x/glass/svg?seed=${encodeURIComponent(c.seed)}" alt=""><div><h3>${esc(c.name)} <span class="badge">${esc(c.badge)}</span></h3><small>${esc(c.handle)}</small></div></div><p>${esc(c.bio)}</p><button class="link-demo profile-open" data-user="${esc(c.handle.replace('@',''))}">Visit profile <span>↗</span></button></article>`).join('')||'<p>No creators found.</p>';
  $$('.profile-open').forEach(b=>b.addEventListener('click',()=>openPublicProfile(b.dataset.user)));
}
function openPublicProfile(username){
  const u=getUsers().find(x=>x.username.toLowerCase()===username.toLowerCase());
  if(!u){alert('That creator profile is only a demo profile in this prototype.');return;}
  const links=(u.links||[]).filter(x=>x.enabled!==false);
  document.body.innerHTML=`<div class="profile-page" style="min-height:100vh;padding:48px 20px;background:radial-gradient(circle at 50% 0%,${esc(u.accent||'#9b6cff')}33,transparent 42%),#09090f;color:#fff;font-family:DM Sans,sans-serif"><div style="max-width:620px;margin:auto;text-align:center"><button id="backHome" class="ghost" style="margin-bottom:28px">← Back</button><img src="https://api.dicebear.com/9.x/glass/svg?seed=${encodeURIComponent(u.username)}" style="width:112px;height:112px;border-radius:50%;border:3px solid ${esc(u.accent||'#9b6cff')}" alt=""><h1 style="margin:18px 0 4px">${esc(u.name)} <span class="badge">${esc(u.badge||'✦')}</span></h1><div style="opacity:.65">@${esc(u.username)}</div><p style="opacity:.85;line-height:1.6">${esc(u.bio||'')}</p><div style="display:grid;gap:12px;margin-top:28px">${links.map(l=>`<a href="${esc(l.url)}" target="_blank" rel="noopener" class="link-demo" style="padding:18px;text-decoration:none;color:inherit;background:#ffffff10;border:1px solid #ffffff18;border-radius:16px;display:flex;justify-content:space-between"><b>${esc(l.title)}</b><span>↗</span></a>`).join('')||'<div style="opacity:.6">No links yet.</div>'}</div><div style="margin-top:32px;opacity:.45;font-size:13px">✦ Spider Sense</div></div></div>`;
  $('#backHome').onclick=()=>location.reload();
}
function openAuth(mode){
  const signup=mode==='signup';
  $('#modalTitle').textContent=signup?'Create your Spider Sense':'Welcome back';
  $('#modalText').textContent=signup?'Create one account and claim your unique username.':'Sign in to manage your profile.';
  const modal=$('#modal');
  modal.querySelectorAll('.auth-extra').forEach(x=>x.remove());
  const email=modal.querySelector('input[type="email"]');
  const password=modal.querySelector('input[type="password"]');
  const button=modal.querySelector('.primary.full');
  email.value=''; password.value='';
  if(signup){
    const username=document.createElement('input'); username.className='modal-input auth-extra'; username.placeholder='Username (letters, numbers, _)'; username.id='authUsername'; username.autocomplete='username'; email.parentNode.insertBefore(username,email);
    const name=document.createElement('input'); name.className='modal-input auth-extra'; name.placeholder='Display name'; name.id='authName'; email.parentNode.insertBefore(name,email);
  }
  button.textContent=signup?'Create account':'Sign in';
  button.onclick=()=>handleAuth(signup);
  modal.classList.add('show');
}
function handleAuth(signup){
  const modal=$('#modal');
  const email=modal.querySelector('input[type="email"]').value.trim().toLowerCase();
  const password=modal.querySelector('input[type="password"]').value;
  if(!email||!password||!email.includes('@'))return alert('Enter a valid email and password.');
  const users=getUsers();
  if(signup){
    const username=$('#authUsername').value.trim().toLowerCase();
    const name=$('#authName').value.trim()||username;
    if(!/^[a-z0-9_]{3,24}$/.test(username))return alert('Username must be 3–24 characters: letters, numbers or _.');
    if(users.some(u=>u.email===email))return alert('An account already exists for this email. Please sign in.');
    if(users.some(u=>u.username===username))return alert('That username is already taken.');
    const u={id:crypto.randomUUID(),email,password,name,username,bio:'creator on Spider Sense ✦',accent:'#9b6cff',badge:'✦',links:[],createdAt:Date.now(),role:email===OWNER_EMAIL?'owner':'user'};
    users.push(u);saveUsers(users);setCurrent({id:u.id,email:u.email,username:u.username,role:u.role});modal.classList.remove('show');loadUserIntoDashboard();show('dashboard');alert('Account created! Your username is @'+u.username);
  }else{
    const u=users.find(x=>x.email===email&&x.password===password);
    if(!u)return alert('Incorrect email or password.');
    setCurrent({id:u.id,email:u.email,username:u.username,role:u.role});modal.classList.remove('show');loadUserIntoDashboard();show('dashboard');
  }
}
function getCurrentUser(){const c=current();return c?getUsers().find(u=>u.id===c.id):null;}
function loadUserIntoDashboard(){
  const u=getCurrentUser(); if(!u)return;
  if($('#nameInput'))$('#nameInput').value=u.name;
  if($('#bioInput'))$('#bioInput').value=u.bio;
  if($('#previewName'))$('#previewName').textContent=u.name;
  if($('#previewBio'))$('#previewBio').textContent=u.bio;
  document.documentElement.style.setProperty('--accent',u.accent||'#9b6cff');
  renderLinkManager();
}
function saveProfile(){
  const u=getCurrentUser(); if(!u)return alert('Sign in first.');
  u.name=$('#nameInput').value.trim()||u.name;u.bio=$('#bioInput').value.trim();
  const active=$('.swatch.active'); if(active)u.accent=active.dataset.accent;
  const users=getUsers().map(x=>x.id===u.id?u:x);saveUsers(users);loadUserIntoDashboard();
  const b=$('#saveProfile');if(b){const old=b.textContent;b.textContent='✓ Saved';setTimeout(()=>b.textContent=old,1200);}
}
function renderLinkManager(){
  const panel=$('#linkManager'); if(!panel)return; const u=getCurrentUser(); if(!u)return;
  panel.innerHTML=`<div class="panel-title"><b>Link manager</b><button class="primary" id="addLink">+ Add link</button></div><div id="linksList"></div>`;
  const list=$('#linksList');
  (u.links||[]).forEach((l,i)=>{const row=document.createElement('div');row.className='user-row';row.innerHTML=`<div style="flex:1"><input class="modal-input" value="${esc(l.title)}" data-title="${i}"><input class="modal-input" value="${esc(l.url)}" data-url="${i}"></div><button class="ghost" data-up="${i}">↑</button><button class="ghost" data-down="${i}">↓</button><button class="ghost" data-del="${i}">Delete</button>`;list.appendChild(row);});
  if(!u.links.length)list.innerHTML='<p style="opacity:.6">No links yet. Add your first link.</p>';
  $('#addLink').onclick=()=>{u.links.push({title:'New link',url:'https://example.com'});persistUser(u);renderLinkManager();};
  $$('[data-title]').forEach(x=>x.onchange=()=>{u.links[+x.dataset.title].title=x.value;persistUser(u)});
  $$('[data-url]').forEach(x=>x.onchange=()=>{u.links[+x.dataset.url].url=x.value;persistUser(u)});
  $$('[data-del]').forEach(x=>x.onclick=()=>{u.links.splice(+x.dataset.del,1);persistUser(u);renderLinkManager()});
  $$('[data-up]').forEach(x=>x.onclick=()=>moveLink(u,+x.dataset.up,-1));
  $$('[data-down]').forEach(x=>x.onclick=()=>moveLink(u,+x.dataset.down,1));
}
function moveLink(u,i,d){const j=i+d;if(j<0||j>=u.links.length)return;[u.links[i],u.links[j]]=[u.links[j],u.links[i]];persistUser(u);renderLinkManager();}
function persistUser(u){saveUsers(getUsers().map(x=>x.id===u.id?u:x));}

renderCreators();
$$('[data-view]').forEach(b=>b.addEventListener('click',()=>{const v=b.dataset.view;if(v==='dashboard'){loadUserIntoDashboard();}show(v)}));
$$('[data-modal]').forEach(b=>b.addEventListener('click',()=>openAuth(b.dataset.modal)));
$('#closeModal').onclick=()=>$('#modal').classList.remove('show');
$('#modal').onclick=e=>{if(e.target.id==='modal')$('#modal').classList.remove('show')};
$('#search').oninput=e=>{const q=e.target.value.toLowerCase();renderCreators(creatorList().filter(c=>(c.name+c.handle+c.bio).toLowerCase().includes(q)))};
$('#nameInput').oninput=e=>$('#previewName').textContent=e.target.value||'Spider';
$('#bioInput').oninput=e=>$('#previewBio').textContent=e.target.value||'Your bio goes here';
$$('.swatch').forEach(s=>s.onclick=()=>{$$('.swatch').forEach(x=>x.classList.remove('active'));s.classList.add('active');document.documentElement.style.setProperty('--accent',s.dataset.accent)});
$('#saveProfile').onclick=saveProfile;
$$('.side-link').forEach(btn=>btn.addEventListener('click',()=>{
  if(btn.classList.contains('admin')){const u=getCurrentUser();if(!u||u.email!==OWNER_EMAIL)return alert('Owner access only.');show('admin');return;}
  $$('.side-link').forEach(x=>x.classList.remove('active'));btn.classList.add('active');
  const label=btn.textContent.toLowerCase();
  if(label.includes('profile'))document.querySelector('#nameInput')?.focus();
  if(label.includes('links'))document.querySelector('#linkManager')?.scrollIntoView({behavior:'smooth'});
}));

(function initDashboardEnhancements(){
  const editor=document.querySelector('.editor-grid');
  if(editor&&!$('#linkManager')){const p=document.createElement('div');p.id='linkManager';p.className='panel';p.style.marginTop='18px';editor.parentNode.appendChild(p);}
  const user=current();
  if(user)loadUserIntoDashboard();
})();