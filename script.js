const seedJobs=[
 {id:1,title:"Delivery Executive",company:"Shadowfax",v:1,sal:"₹18,000–22,000",city:"Pune",dist:"2.3 km",cat:"Delivery",type:"Full-time",shift:"Day",walk:1,women:0,gulf:0,rating:4.2,desc:"30-40 deliveries per day, bike required, valid DL mandatory."},
 {id:2,title:"Telecaller (Women preferred)",company:"Licious",v:1,sal:"₹15,000–17,000",city:"Mumbai",dist:"4.1 km",cat:"Telecalling",type:"Full-time",shift:"Day",walk:0,women:1,gulf:0,rating:4.5,desc:"Handle customer calls, graduation not required."},
 {id:3,title:"Warehouse Picker",company:"Flipkart",v:1,sal:"₹16,500",city:"Bengaluru",dist:"1.1 km",cat:"Warehouse",type:"Walk-in",shift:"Night",walk:1,women:0,gulf:0,rating:4.0,desc:"Night shift with overtime allowance."},
 {id:4,title:"Security Guard",company:"G4S",v:1,sal:"₹14,000",city:"Delhi",cat:"Security",type:"Full-time",shift:"Rotational",walk:1,women:0,gulf:0,dist:"3.6 km",rating:3.9,desc:"12-hour shift, uniform provided by company."},
 {id:5,title:"Housekeeping Staff (Gulf)",company:"Al Rawda Services",v:1,sal:"AED 1200",city:"Dubai",cat:"Housekeeping",type:"Full-time",shift:"Day",walk:0,women:1,gulf:1,dist:"-",rating:4.1,desc:"Visa and flight sponsored by the company."},
];
const ALL_CATS=["Delivery","Telecalling","Retail","Warehouse","Security","Housekeeping","Driver","Back Office"];
let S=JSON.parse(localStorage.getItem('kmState')||'null')||{
 profile:{name:"",skill:"",exp:"",city:"",notice:"Immediate",vehicle:"None",shifts:[]},
 toggles:{},saved:[],applications:[],catFilter:[],compare:[],
 posts:[
   {id:1,name:"Rahul",text:"Interviewed at Shadowfax today, joining tomorrow!",claps:12},
   {id:2,name:"Pooja",text:"Licious pays salary on time, a reliable company.",claps:8}
 ],
 jobs:JSON.parse(JSON.stringify(seedJobs)),
 pipeline:{Applied:[{n:"Amit Kumar",role:"Delivery"}],Shortlisted:[],Interview:[],Hired:[]},
 chat:[{who:"bot",text:"Hi! Ask me anything about jobs or applications."}],
 plan:"Free", streak:3, points:40, mode:'cand', theme:'light'
};
S.compare = S.compare || []; S.catFilter = S.catFilter || [];
function save(){localStorage.setItem('kmState',JSON.stringify(S));}
function greet(){const h=new Date().getHours(); const el=document.getElementById('heroGreet');
 if(!el)return; el.textContent=(h<12?'Good morning 👋':h<17?'Good afternoon 👋':'Good evening 👋')+(S.profile.name?', '+S.profile.name:'');}
function toast(m){const t=document.getElementById('toast');t.textContent=m;t.classList.add('show');clearTimeout(window._tt);window._tt=setTimeout(()=>t.classList.remove('show'),2200);}
function showView(id,btn){document.querySelectorAll('.view').forEach(v=>v.classList.remove('on'));document.getElementById(id).classList.add('on');
 const bar=btn.closest('.tabbar');bar.querySelectorAll('button').forEach(b=>b.classList.remove('on'));btn.classList.add('on');
 if(id==='v-apps')renderApps(); if(id==='v-comm')renderPosts(); if(id==='v-ecand')renderPipeline(); if(id==='v-edash')renderDash(); if(id==='v-profile')fillProfile(); if(id==='v-chat')renderChat();}
function setMode(m){S.mode=m;save();
 document.getElementById('modeCand').classList.toggle('on',m==='cand');
 document.getElementById('modeEmp').classList.toggle('on',m==='emp');
 document.getElementById('tabbarCand').style.display=m==='cand'?'flex':'none';
 document.getElementById('tabbarEmp').style.display=m==='emp'?'flex':'none';
 showView(m==='cand'?'v-home':'v-edash', document.querySelector((m==='cand'?'#tabbarCand':'#tabbarEmp')+' button'));
 if(m==='cand')renderJobs(); else renderDash();
}
function toggleTheme(){const r=document.documentElement;const n=r.getAttribute('data-theme')==='dark'?'light':'dark';r.setAttribute('data-theme',n);S.theme=n;save();document.getElementById('themeIcon').textContent=n==='dark'?'☀️':'🌙';}
const CHIPS=[["all","All"],["walk","Walk-in"],["women","Women-friendly"],["gulf","Gulf Jobs"],["night","Night Shift"]];
let activeChip='all';
function buildChips(){document.getElementById('chipRow').innerHTML=CHIPS.map(c=>`<button class="chip ${activeChip===c[0]?'on':''}" onclick="activeChip='${c[0]}';buildChips();renderJobs()">${c[1]}</button>`).join('');
 document.getElementById('catMS').innerHTML=ALL_CATS.map(c=>`<label class="mschk"><input type="checkbox" value="${c}" ${S.catFilter.includes(c)?'checked':''}> ${c}</label>`).join('');
}
function applyCatFilter(){S.catFilter=[...document.querySelectorAll('#catMS input:checked')].map(i=>i.value); save();
 document.getElementById('catCount').textContent=S.catFilter.length?S.catFilter.length+' selected':'All'; closeSheets(); renderJobs();}
function renderJobs(){
 const q=(document.getElementById('searchBox').value||'').toLowerCase();
 let list=S.jobs.filter(j=>{
   if(activeChip==='walk'&&!j.walk)return false;
   if(activeChip==='women'&&!j.women)return false;
   if(activeChip==='gulf'&&!j.gulf)return false;
   if(activeChip==='night'&&j.shift!=='Night')return false;
   if(S.catFilter.length && !S.catFilter.includes(j.cat)) return false;
   return (j.title+j.company+j.cat+j.city).toLowerCase().includes(q);
 });
 document.getElementById('jobList').innerHTML= list.length? list.map(jobCard).join(''):'<div class="empty">No jobs found. Try changing filters.</div>';
}
function jobCard(j){
 const saved=S.saved.includes(j.id);
 const cmp=S.compare.includes(j.id);
 return `<div class="card">
  <div class="jobtitle">${j.title} ${j.v?'<span class="badge b-verified">✓ Verified</span>':''} ${j.walk?'<span class="badge b-walkin">Walk-in</span>':''} ${j.women?'<span class="badge b-women">Women-friendly</span>':''} ${j.gulf?'<span class="badge b-gulf">International</span>':''}</div>
  <div class="company">${j.company} · ⭐${j.rating}</div>
  <div class="meta"><span>${j.sal}</span><span>${j.city} ${j.dist!=='-'?'· '+j.dist:''}</span><span>${j.type}</span><span>${j.shift} shift</span></div>
  <div class="rowbtns">
    <button class="btn primary" onclick="applyJob(${j.id})">Apply Now</button>
    <button class="btn ghost" onclick="callHR('${j.company}')">📞 Call</button>
    <button class="btn ${saved?'primary':'line'} sm" onclick="toggleSave(${j.id},this)">${saved?'❤️':'🤍'}</button>
    <button class="btn line sm" onclick='openJob(${j.id})'>ℹ️</button>
  </div>
  <label class="mschk" style="margin-top:9px;width:fit-content"><input type="checkbox" ${cmp?'checked':''} onchange="toggleCompare(${j.id},this)"> Add to compare</label>
  </div>`;
}
function toggleCompare(id,el){
 if(el.checked){ if(S.compare.length>=2){toast('You can compare only 2 jobs at a time'); el.checked=false; return;} S.compare.push(id);}
 else{S.compare=S.compare.filter(x=>x!==id);}
 save(); updateCompareBar(); renderJobs();
}
function updateCompareBar(){const bar=document.getElementById('compareBar'); if(!bar)return;
 bar.style.display=S.compare.length?'flex':'none';
 document.getElementById('compareCount').textContent='⚖️ '+S.compare.length+'/2 selected';
}
function clearCompare(){S.compare=[]; save(); updateCompareBar(); renderJobs(); closeSheets();}
function openCompare(){
 if(S.compare.length<2){toast('Select 2 jobs to compare');return;}
 const [a,b]=S.compare.map(id=>S.jobs.find(j=>j.id===id));
 document.getElementById('compareBody').innerHTML=`<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
  ${[a,b].map(j=>`<div class="card"><b>${j.title}</b><div class="company">${j.company}</div>
   <div class="meta"><span>${j.sal}</span></div><div class="meta"><span>${j.city}</span></div>
   <div class="meta"><span>${j.type}</span></div><div class="meta"><span>${j.shift}</span></div>
   <div class="meta"><span>⭐ ${j.rating}</span></div>
   <button class="btn primary sm" style="width:100%;margin-top:6px" onclick="applyJob(${j.id})">Apply</button></div>`).join('')}
 </div>`;
 openSheet('sheetCompare');
}
function openSaved(){
 const list=S.jobs.filter(j=>S.saved.includes(j.id));
 document.getElementById('savedList').innerHTML=list.length? list.map(jobCard).join('') : '<div class="empty">No saved jobs yet. Tap 🤍 on any job to save it.</div>';
 openSheet('sheetSaved');
}
function callHR(c){toast("Calling "+c+"...");}
function toggleSave(id,btn){const i=S.saved.indexOf(id); if(i>-1){S.saved.splice(i,1);}else{S.saved.push(id);} save();renderJobs();updateSavedDot();}
function updateSavedDot(){const d=document.getElementById('savedDot'); if(d)d.style.display=S.saved.length?'block':'none';}
function applyJob(id){const j=S.jobs.find(x=>x.id===id); if(!j)return;
 if(S.applications.find(a=>a.jobId===id)){toast('You have already applied to this job');return;}
 S.applications.push({jobId:id,title:j.title,company:j.company,status:'Applied',date:new Date().toLocaleDateString()});
 S.pipeline.Applied.push({n:S.profile.name||'New Candidate',role:j.title});
 S.points+=10; save(); toast('Applied! Check your Applications tab.'); addNotif('You applied to '+j.title+'.');
}
function openJob(id){const j=S.jobs.find(x=>x.id===id);
 document.getElementById('jobDetailBody').innerHTML=`<button class="x" onclick="closeSheets()">✕</button>
 <h3>${j.title}</h3><div class="company">${j.company} · ${j.city}</div>
 <div class="meta"><span>${j.sal}</span><span>${j.type}</span><span>${j.shift}</span></div>
 <p style="font-size:13.5px">${j.desc}</p>
 <div class="bar"><i style="width:${j.rating*20}%"></i></div><span style="font-size:11.5px;color:var(--sub)">Company rating ${j.rating}/5 (based on peer candidate reviews)</span>
 <div class="rowbtns" style="margin-top:12px">
  <button class="btn primary" onclick="applyJob(${j.id});closeSheets()">Apply</button>
  <button class="btn ghost" onclick="speak('${j.title} at ${j.company}, salary ${j.sal}')">🔊 Listen</button>
 </div>
 <div class="rowbtns" style="margin-top:8px"><button class="btn line sm" onclick="toast('Report submitted, our team will review it')">🚩 Report</button><button class="btn line sm" onclick="toast('Job will be confirmed after e-KYC eligibility check')">🪪 Eligibility Check</button></div>`;
 openSheet('sheetJob');
}
function speak(t){try{const u=new SpeechSynthesisUtterance(t);speechSynthesis.speak(u);}catch(e){toast('Playing audio...');}}
function voiceSearch(){toast('🎙️ Listening... please speak');}
function openSheet(id){document.getElementById(id).classList.add('on'); if(id==='sheetNotif')renderNotif();}
function closeSheets(){document.querySelectorAll('.overlay').forEach(o=>o.classList.remove('on'));}
function renderApps(){
 document.getElementById('appList').innerHTML = S.applications.length? S.applications.map(a=>{
   const stages=['Applied','Shortlisted','Interview','Hired'];const ci=stages.indexOf(a.status);
   return `<div class="card"><b>${a.title}</b><div class="company">${a.company} · ${a.date}</div>
   <div class="meta">${stages.map((s,i)=>`<span style="background:${i<=ci?'var(--good)':'var(--chip)'};color:${i<=ci?'#fff':'var(--sub)'}">${s}</span>`).join('')}</div>
   <div class="rowbtns"><button class="btn ghost sm" onclick="openSheet('sheetQuiz')">🎯 Mock Interview</button><button class="btn ghost sm" onclick="toast('Reminder set')">⏰ Reminder</button>${a.status==='Hired'?'<button class="btn primary sm" onclick="toast(\'Offer letter e-signed ✅\')">📄 Sign Offer</button>':''}</div></div>`;
 }).join('') : '<div class="empty">No applications yet. Go to the Home tab to apply.</div>';
}
function renderPosts(){
 document.getElementById('streakN').textContent=S.streak;
 document.getElementById('pointsN').textContent=S.points;
 document.getElementById('postList').innerHTML=S.posts.map(p=>`<div class="post"><div style="font-size:12px;color:var(--sub);margin-bottom:6px"><b style="color:var(--ink)">${p.name}</b></div><div>${p.text}</div>
 <div class="rowbtns" style="margin-top:8px"><button class="btn ghost sm" onclick="clap(${p.id},this)">👏 ${p.claps}</button><button class="btn ghost sm" onclick="toast('Followed')">➕ Follow</button></div></div>`).join('');
}
function clap(id,btn){const p=S.posts.find(x=>x.id===id);p.claps++;save();renderPosts();}
function addPost(){const t=document.getElementById('postBox').value.trim(); if(!t)return;
 S.posts.unshift({id:Date.now(),name:S.profile.name||'You',text:t,claps:0}); S.points+=5; document.getElementById('postBox').value=''; save(); renderPosts(); toast('Posted');}
function copyRef(){toast('Referral code copied — share it!');}
function mockVoice(t){toast(t==='cv'?'🎤 Recording voice CV...':'🎤 Recording voice post...');}
function fillProfile(){const p=S.profile;
 document.getElementById('pf_name').value=p.name; document.getElementById('pf_skill').value=p.skill;
 document.getElementById('pf_exp').value=p.exp; document.getElementById('pf_city').value=p.city;
 document.getElementById('pf_notice').value=p.notice; document.getElementById('pf_vehicle').value=p.vehicle;
 document.querySelectorAll('#shiftMS input').forEach(i=>i.checked=(p.shifts||[]).includes(i.value));
 document.getElementById('profName').textContent=p.name||'Add your name';
 document.getElementById('avatarInit').textContent=p.name?p.name[0]:'👤';
 const fields=['name','skill','exp','city']; const filled=fields.filter(f=>p[f]).length;
 const pct=Math.round((filled/fields.length)*100);
 document.getElementById('profBar').style.width=pct+'%'; document.getElementById('profPct').textContent=pct+'% complete';
 ['hide','women','pwd','lock','notif'].forEach(k=>{const el=document.getElementById('sw_'+k); if(el)el.classList.toggle('on',!!S.toggles[k]);});
}
function saveProfile(){const p=S.profile;
 p.name=document.getElementById('pf_name').value; p.skill=document.getElementById('pf_skill').value;
 p.exp=document.getElementById('pf_exp').value; p.city=document.getElementById('pf_city').value;
 p.notice=document.getElementById('pf_notice').value; p.vehicle=document.getElementById('pf_vehicle').value;
 p.shifts=[...document.querySelectorAll('#shiftMS input:checked')].map(i=>i.value);
 save(); fillProfile(); toast('Profile saved');}
function tg(key,el){el.classList.toggle('on'); if(key!=='_'){S.toggles[key]=el.classList.contains('on'); save();}}
function genResume(){const p=S.profile; if(!p.name){toast('Please fill your profile first');return;}
 toast('Resume ready: '+p.name+' — '+(p.skill||'Skill')+' ('+(p.exp||'0')+' yrs exp), '+p.city);}
function genCover(){const p=S.profile; toast('Cover letter ready: "I am applying for '+(p.skill||'this role')+' with '+(p.exp||'some')+' years of experience..."');}
function quizAns(ok){closeSheets(); if(ok){S.points+=15;save();toast('Correct! +15 points, skill badge earned 🏅');}else{toast('Practice a bit more and try again');}}
function exportProfile(){toast('Generating profile PDF...'); setTimeout(()=>window.print(),400);}
function sos(){toast('🆘 Your location has been shared with your emergency contact');}
function renderChat(){document.getElementById('chatBox').innerHTML=S.chat.map(m=>`<div class="msg ${m.who==='me'?'me':'them'}">${m.text}</div>`).join('');}
function sendChat(){const inp=document.getElementById('chatInput'); const t=inp.value.trim(); if(!t)return;
 S.chat.push({who:'me',text:t});
 const reply=/salary|pay/i.test(t)?'Most entry-level jobs pay between ₹14,000–22,000.': /interview/i.test(t)?'Open your application and tap "Mock Interview".':'Our team will get back soon. Meanwhile, check new jobs on the Home tab.';
 S.chat.push({who:'bot',text:reply}); inp.value=''; save(); renderChat();}
function openWhatsapp(){window.open('https://wa.me/910000000000?text=Hi','_blank'); toast('Opening WhatsApp bot');}
function startVideo(){toast('📹 Starting video interview...');}
function submitDispute(){const t=document.getElementById('disputeTxt').value.trim(); if(!t){toast('Please write the details');return;}
 closeSheets(); toast('Complaint submitted, our team will respond within 48 hours');}
function addNotif(t){window._notifs=window._notifs||[]; window._notifs.unshift(t);}
function renderNotif(){const n=window._notifs||['New jobs available in your city','Interview reminder: tomorrow at 11 AM'];
 document.getElementById('notifList').innerHTML=n.map(x=>`<div class="card" style="margin-bottom:8px">${x}</div>`).join('');}
// ---- Employer side ----
function renderDash(){
 document.getElementById('st_posted').textContent=S.jobs.length;
 document.getElementById('st_apps').textContent=S.applications.length + Object.values(S.pipeline).flat().length;
 document.getElementById('st_hired').textContent=S.pipeline.Hired.length;
 document.getElementById('st_plan').textContent=S.plan;
 const cats={}; S.jobs.forEach(j=>cats[j.cat]=(cats[j.cat]||0)+1);
 document.getElementById('heatmap').innerHTML=Object.entries(cats).map(([c,n])=>`<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px"><span style="width:90px;font-size:11.5px;color:var(--sub)">${c}</span><div class="bar" style="flex:1"><i style="width:${n*25}%"></i></div></div>`).join('');
}
function setPlan(p){S.plan=p; save(); toast(p+' plan activated'); renderDash();}
function postJob(){
 const t=document.getElementById('ej_title').value.trim(); if(!t){toast('Please enter a job title');return;}
 const j={id:Date.now(),title:t,company:document.getElementById('co_name')?.value||'Your Company',v:1,
  sal:'₹'+(document.getElementById('ej_sal').value||'—'), city:document.getElementById('ej_city').value||'—',
  dist:'New', cat:document.getElementById('ej_cat').value, type:document.getElementById('ej_type').value,
  shift:document.getElementById('ej_shift').value, walk:document.getElementById('ej_type').value==='Walk-in'?1:0,
  women:document.getElementById('sw_ejw').classList.contains('on')?1:0,
  gulf:document.getElementById('sw_ejg').classList.contains('on')?1:0, rating:4.0,
  desc:'Newly posted job. The company will call you soon.'};
 S.jobs.unshift(j); save(); toast('✅ Job is live — it now appears on the candidate side');
 ['ej_title','ej_sal','ej_city'].forEach(id=>document.getElementById(id).value='');
}
function renderPipeline(){
 const cols=['Applied','Shortlisted','Interview','Hired'];
 document.getElementById('pipeline').innerHTML=cols.map(c=>`<div class="kcol"><h4>${c} (${S.pipeline[c].length})</h4>${
   S.pipeline[c].map((cd,i)=>`<div class="kcard"><b>${cd.n}</b><br><span style="color:var(--sub)">${cd.role||''}</span>
    <div class="rowbtns" style="margin-top:6px"><button class="btn ghost sm" onclick="moveCand('${c}',${i})">➡️ Move</button><button class="btn line sm" onclick="toast('Contact unlocked: 98XXXXXX21')">📞</button></div></div>`).join('')||'<span style="font-size:11.5px;color:var(--sub)">None</span>'
 }</div>`).join('');
}
function moveCand(stage,i){const cols=['Applied','Shortlisted','Interview','Hired'];const idx=cols.indexOf(stage);
 if(idx===cols.length-1){toast('This candidate is already hired');return;}
 const [cd]=S.pipeline[stage].splice(i,1); S.pipeline[cols[idx+1]].push(cd); save(); renderPipeline(); renderDash(); toast(cd.n+' moved to '+cols[idx+1]);}
function addTeam(){const e=document.getElementById('teamMail').value.trim(); if(!e){toast('Enter an email');return;} closeSheets(); toast(e+' invited to the team');}
// init
buildChips(); renderJobs(); fillProfile(); renderDash(); greet(); updateCompareBar(); updateSavedDot();
document.getElementById('catCount').textContent=S.catFilter.length?S.catFilter.length+' selected':'All';
if(S.theme==='dark'){document.documentElement.setAttribute('data-theme','dark');document.getElementById('themeIcon').textContent='☀️';}
