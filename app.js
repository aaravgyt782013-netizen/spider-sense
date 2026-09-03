const creators=[
 {name:'Aarav',handle:'@aarav',bio:'building things on the internet ✦',seed:'Aarav',badge:'✓'},
 {name:'Nova',handle:'@nova',bio:'art • music • late nights',seed:'Nova',badge:'★'},
 {name:'Pixel',handle:'@pixel',bio:'designer & digital creator',seed:'Pixel',badge:'✦'},
 {name:'Lumi',handle:'@lumi',bio:'just making the web prettier',seed:'Lumi',badge:'✓'},
 {name:'Kai',handle:'@kai',bio:'games, code and coffee',seed:'Kai',badge:'★'},
 {name:'Milo',handle:'@milo',bio:'photography / motion / life',seed:'Milo',badge:'✦'}
];
const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
function show(view){$$('.view').forEach(v=>v.classList.remove('active')); const el=$('#'+view); if(el){el.classList.add('active');window.scrollTo({top:0,behavior:'smooth'})}}
function renderCreators(list=creators){$('#creatorGrid').innerHTML=list.map(c=>`<article class="creator"><div class="creator-top"><img src="https://api.dicebear.com/9.x/glass/svg?seed=${encodeURIComponent(c.seed)}" alt=""><div><h3>${c.name} <span class="badge">${c.badge}</span></h3><small>${c.handle}</small></div></div><p>${c.bio}</p><div class="link-demo">Visit profile <span>↗</span></div></article>`).join('')}
renderCreators();
$$('[data-view]').forEach(b=>b.addEventListener('click',()=>show(b.dataset.view)));
$$('[data-modal]').forEach(b=>b.addEventListener('click',()=>{const signup=b.dataset.modal==='signup';$('#modalTitle').textContent=signup?'Create your Spider Sense':'Welcome back';$('#modalText').textContent=signup?'Make your creator page in minutes.':'Sign in to manage your profile.';$('#modal').classList.add('show')}));
$('#closeModal').addEventListener('click',()=>$('#modal').classList.remove('show'));
$('#modal').addEventListener('click',e=>{if(e.target.id==='modal')$('#modal').classList.remove('show')});
$('#search').addEventListener('input',e=>{const q=e.target.value.toLowerCase();renderCreators(creators.filter(c=>(c.name+c.handle+c.bio).toLowerCase().includes(q)))});
$('#nameInput').addEventListener('input',e=>$('#previewName').textContent=e.target.value||'Spider');
$('#bioInput').addEventListener('input',e=>$('#previewBio').textContent=e.target.value||'Your bio goes here');
$$('.swatch').forEach(s=>s.addEventListener('click',()=>{$$('.swatch').forEach(x=>x.classList.remove('active'));s.classList.add('active');document.documentElement.style.setProperty('--accent',s.dataset.accent)}));
$('#saveProfile').addEventListener('click',e=>{const old=e.target.textContent;e.target.textContent='✓ Saved';setTimeout(()=>e.target.textContent=old,1300)});
$$('.side-link').forEach(btn=>btn.addEventListener('click',()=>{if(btn.classList.contains('admin'))show('admin');else{$$('.side-link').forEach(x=>x.classList.remove('active'));btn.classList.add('active')}}));
