/* =====================================================================
   extras.js — تعديلات إيدوس (بيتحمّل بعد certs.js)
   1) الربح = حساب الأكاديمية (المدرب موظف عندك: حقه بيظهر كمستحقات)
   2) مشتريات الكتب والمستلزمات بتظهر في ملف الطالب
   3) تنظيم القايمة الجانبية في مجموعات + ترتيب الأزرار
   لازم يتحط في نفس فولدر index.html
   ===================================================================== */
(function(){
const $=id=>document.getElementById(id);

/* ---------- تسميات الأعمدة ---------- */
const RL={'حساب المدرب':'مستحق المدرب','حساب الأكاديمية':'ربح الأكاديمية'};
function relabel(root){if(!root)return;root.querySelectorAll('th').forEach(th=>{const t=th.textContent.trim();if(RL[t])th.textContent=RL[t]})}

/* ---------- CSS ---------- */
const st=document.createElement('style');st.textContent=`
nav{gap:2px;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.18) transparent}
nav::-webkit-scrollbar{width:5px}nav::-webkit-scrollbar-thumb{background:rgba(255,255,255,.18);border-radius:6px;border:0}
.ng{font-size:10.5px;font-weight:700;letter-spacing:.4px;color:#8088bd;padding:12px 12px 4px;display:flex;align-items:center;gap:8px}
.ng::after{content:"";flex:1;height:1px;background:rgba(255,255,255,.08)}
.ng:first-child{padding-top:2px}
nav button{padding:6px 10px;font-size:13px}
nav button span{width:30px;height:30px;border-radius:9px}
nav button span svg{width:17px;height:17px}
.brand{padding-bottom:12px;margin-bottom:8px}.brand img{width:76px;height:76px}
.side-foot{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:8px;padding-top:10px;border-top:1px solid rgba(255,255,255,.08)}
.side-foot .btn{justify-content:center;font-size:12px;padding:7px 6px;border-radius:10px;white-space:nowrap}
.side-foot #opB,.side-foot .b-ink{grid-column:1/-1}
.side-foot .b-ink{background:rgba(244,63,94,.16);border:1px solid rgba(244,63,94,.35);color:#fecdd3}
.side-foot .b-ink:hover{background:rgba(244,63,94,.32);color:#fff}
@media(max-width:860px){.ng{display:none}nav button{min-width:60px}}
#s-prof .bk-card .bd{font-size:13px}
`;document.head.appendChild(st);

/* ---------- 1) القايمة الجانبية في مجموعات ---------- */
const GROUPS=[['عام',['home']],['الطلاب',['reg','att','eval','an','prof','cert']],['المالية',['due','acc','shop','exp']],['النظام',['log']]];
buildNav=function(){
 const a=isAdmin();if(a===navAdmin)return;navAdmin=a;
 const cur=(document.querySelector('.sec.on')||{id:'s-home'}).id.slice(2),used=new Set();
 const btn=([k,i,n])=>`<button data-t="${k}" class="${k===cur?'on':''}" onclick="tab('${k}')"><span>${i}</span>${n}${k==='due'?'<em class="nb" id="nb" style="display:none"></em>':''}</button>`;
 const ok=t=>t&&(t[0]!=='log'||a);
 let h=GROUPS.map(([title,keys])=>{const items=keys.map(k=>TABS.find(t=>t[0]===k)).filter(ok);items.forEach(t=>used.add(t[0]));
  return items.length?`<div class="ng">${title}</div>`+items.map(btn).join(''):''}).join('');
 const rest=TABS.filter(t=>ok(t)&&!used.has(t[0]));if(rest.length)h+='<div class="ng">أخرى</div>'+rest.map(btn).join('');
 $('nav').innerHTML=h};

/* ---------- 2) الربح = حساب الأكاديمية ---------- */
renderHome=function(){
 const ym=today().slice(0,7),P=DB.payments.filter(p=>p.date.slice(0,7)===ym),T=r2(P.reduce((a,p)=>a+p.amount,0)),A=r2(P.reduce((a,p)=>a+(p.acad||0),0));
 const ta=Object.keys(DB.att).filter(k=>k.startsWith(today()+'|')).reduce((a,k)=>a+(DB.att[k].present||[]).length,0),pend=r2(DB.dues.reduce((a,d)=>a+d.amount,0));
 const it=[['👥','الطلاب',DB.students.length],['✅','حضور اليوم',ta],['💰','إيراد الشهر',money(T)],['🏫','ربح الأكاديمية (الشهر)',money(A)],['🎓','مستحقات المدربين',money(T-A)],['⏳','اشتراكات مؤجلة',money(pend)]];
 $('hmK').innerHTML=it.map(([i,l,v],n)=>`<div class="kpi ${n===3?'main':''}" style="animation-delay:${n*60}ms"><span class="ki">${i}</span><div class="v">${v}</div><div class="l">${l}</div></div>`).join('');
 $('hmAl').innerHTML=alertsHTML(6);
 const top=DB.students.map(s=>({s,t:calcStats(s,'month',ym)})).filter(x=>x.t.aTot!=null).sort((a,b)=>b.t.aTot-a.t.aTot).slice(0,5),md=['🥇','🥈','🥉','4','5'];
 $('hmTop').innerHTML=top.length?top.map((x,i)=>`<div class="li"><span>${md[i]}</span><b>${esc(x.s.name)}</b><span class="bd g">${esc(acName(x.s.academy))}</span><span class="bd">${x.t.aTot}</span></div>`).join(''):'<div class="empty">لسه مفيش تقييمات الشهر ده</div>';
 const labs=[],tv=[],av=[],mv=[];
 for(let i=5;i>=0;i--){const d=new Date(new Date().getFullYear(),new Date().getMonth()-i,1),m=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0'),pp=DB.payments.filter(p=>p.date.slice(0,7)===m);
  labs.push(d.toLocaleDateString('ar-EG',{month:'short'}));tv.push(r2(pp.reduce((a,p)=>a+p.amount,0)));av.push(r2(pp.reduce((a,p)=>a+(p.acad||0),0)));mv.push(r2(pp.reduce((a,p)=>a+remOf(p),0)))}
 Chart.defaults.font.family='IBM Plex Sans Arabic';
 mk('hmRev',{type:'bar',data:{labels:labs,datasets:[{label:'الإجمالي',data:tv,backgroundColor:'#c7d2fe',borderRadius:8},{label:'ربح الأكاديمية',data:av,backgroundColor:'#6366f1',borderRadius:8},{label:'مستحقات المدربين',data:mv,backgroundColor:'#10b981',borderRadius:8}]},options:{maintainAspectRatio:false,plugins:{legend:{position:'bottom'}}}});
 const ac=DB.academies.map(a=>[a.name,DB.students.filter(s=>s.academy===a.id).length]).filter(x=>x[1]);
 mk('hmAc',{type:'doughnut',data:{labels:ac.map(x=>x[0]),datasets:[{data:ac.map(x=>x[1]),backgroundColor:['#6366f1','#0ea5e9','#10b981','#f59e0b','#ec4899','#8b5cf6','#14b8a6','#f97316'],borderColor:'#fff',borderWidth:4}]},options:{maintainAspectRatio:false,cutout:'62%',plugins:{legend:{position:'bottom'}}}})};

renderAcc=function(){
 const all=$('cAll').checked,m=$('cMo').value,t=$('cType').value,trf=$('cTr').value,inR=d=>all||d.slice(0,7)===m,kd=p=>p.kind||'month';
 const pays=DB.payments.filter(p=>inR(p.date)&&(!t||p.acct===t)&&(!trf||p.trId===trf)).sort((a,b)=>b.date.localeCompare(a.date));
 const sum=(f,flt)=>r2(pays.filter(flt||(()=>true)).reduce((x,p)=>x+f(p),0));
 const total=sum(p=>p.amount),acad=sum(p=>p.acad||0),remain=r2(total-acad),mt=sum(p=>p.amount,p=>kd(p)==='month'),sst=sum(p=>p.amount,p=>kd(p)==='session');
 const rev=r2(DB.sales.filter(x=>inR(x.date)).reduce((x,v)=>x+v.sell*v.qty,0)),spent=r2(DB.purchases.filter(x=>inR(x.date)).reduce((x,p)=>x+p.buy*p.qty,0)),ex=r2(DB.expenses.filter(x=>inR(x.date)).reduce((a,x)=>a+x.amount,0));
 /* الربح = حساب الأكاديمية + الكتب − المشتريات − المصروفات (المدرب موظف: حقه مستحقات مش ربح) */
 const net=r2(acad+rev-spent-ex);
 $('cK').innerHTML=[['💰','إجمالي المدفوع',total],['📅','اشتراكات شهرية',mt],['🎟','مدفوعات الحصص',sst],['🏫','ربح الأكاديمية',acad],['🎓','مستحقات المدربين',remain],['📚','مبيعات الكتب',rev],['📦','مشتريات الكتب',spent,'neg'],['🧾','المصروفات',ex,'neg']].map(([i,l,v,c])=>`<div class="kpi"><span class="ki">${i}</span><div class="v ${c||''}">${money(v)}</div><div class="l">${l}</div></div>`).join('')+`<div class="kpi main"><span class="ki">🏆</span><div class="v">${money(net)}</div><div class="l">صافي أرباحك</div></div>`;
 const by={};pays.forEach(p=>{const g=by[p.acId]??={name:DB.academies.find(a=>a.id===p.acId)?.name||p.acName,n:0,t:0,a:0};g.n++;g.t+=p.amount;g.a+=(p.acad||0)});
 const rows=Object.values(by).sort(byName);
 $('cAcB').innerHTML=rows.length?rows.map(g=>`<tr><td><b>${esc(g.name)}</b></td><td>${g.n}</td><td>${money(g.t)}</td><td>${money(g.t-g.a)}</td><td><b class="pos">${money(g.a)}</b></td></tr>`).join(''):'<tr><td colspan="5" class="empty">مفيش حسابات</td></tr>';
 const bt={};pays.forEach(p=>{const k=p.trId||p.trName||'_none',g=bt[k]??={name:p.trId||p.trName?(trById(p.trId)?.name||p.trName):'بدون مدرب',n:0,t:0,a:0};g.n++;g.t+=p.amount;g.a+=(p.acad||0)});
 const tr=Object.values(bt).sort(byName);
 $('cTrB').innerHTML=tr.length?tr.map(g=>`<tr><td><b>${esc(g.name)}</b></td><td>${g.n}</td><td>${money(g.t)}</td><td>${money(g.t-g.a)}</td><td><b class="pos">${money(g.a)}</b></td></tr>`).join(''):'<tr><td colspan="5" class="empty">مفيش حسابات مدربين</td></tr>';
 $('cB').innerHTML=pays.length?pays.map(p=>`<tr><td>${esc(p.date)}</td><td><b>${esc(stuById(p.studentId)?.name||p.name)}</b></td><td>${esc(DB.academies.find(a=>a.id===p.acId)?.name||p.acName)}</td><td>${esc(trById(p.trId)?.name||p.trName||'—')}</td><td>${acB(p.acct)}</td><td>${kd(p)==='session'?'<span class="bd k">حصة</span>':'<span class="bd g">شهري</span>'}</td><td><b>${money(p.amount)}</b></td><td>${money(remOf(p))}</td><td><b class="pos">${money(p.acad||0)}</b></td><td><button class="btn b-ink b-sm" onclick="editPay('${p.id}')">تعديل</button> <button class="btn b-red b-sm" onclick="delPay('${p.id}')">حذف</button></td></tr>`).join(''):'<tr><td colspan="10" class="empty">مفيش دفعات</td></tr>';
 relabel($('s-acc'));
 Chart.defaults.font.family='IBM Plex Sans Arabic';
 mk('cCh',{type:'bar',data:{labels:['إجمالي المدفوع','ربح الأكاديمية','مستحقات المدربين','مبيعات الكتب','مشتريات الكتب','المصروفات','صافي ربحك'],datasets:[{data:[total,acad,remain,rev,-spent,-ex,net],backgroundColor:['#c7d2fe','#6366f1','#10b981','#0ea5e9','#fb7185','#e11d48','#1e1b4b'],borderRadius:10}]},options:{maintainAspectRatio:false,plugins:{legend:{display:false}}}});
 const tc=['#6366f1','#0ea5e9','#10b981','#f59e0b','#ec4899','#8b5cf6','#14b8a6','#f97316'];
 mk('cTrCh',{type:'doughnut',data:{labels:tr.map(g=>g.name),datasets:[{data:tr.map(g=>r2(g.t-g.a)),backgroundColor:tc,borderColor:'#fff',borderWidth:4}]},options:{maintainAspectRatio:false,cutout:'58%',plugins:{legend:{position:'bottom'}}}})};

calcPrev=function(){
 const amt=+$('rAmt').value||0,priv=$('rAcct').value!=='academy',aEl=$('rAcAmt');aEl.disabled=priv;if(priv)aEl.value='';
 const aa=priv?0:(+aEl.value||0),a=acadCalc(amt,aa,amt),t=trById($('rTr').value);
 $('prev').innerHTML=`${$('rBill').value==='session'?'من كل حصة — ':''}المدفوع: <b>${money(amt)}</b> • ربح الأكاديمية: <b>${money(a)}</b> • مستحق المدرب${t?' ('+esc(t.name)+')':''}: <b>${money(amt-a)}</b>`};

/* ---------- 3) مشتريات الكتب في ملف الطالب ---------- */
const _rp=renderProf;
renderProf=function(){
 _rp.apply(this,arguments);
 const out=$('pfOut'),id=$('pfSt').value;if(!id||!out)return;
 relabel(out);
 const all=$('pfAll').checked,mo=$('pfMo').value||today().slice(0,7),ptxt=all?'كل الأيام':monthN(mo);
 const L=DB.sales.filter(x=>x.studentId===id&&(all||x.date.slice(0,7)===mo)).sort((a,b)=>b.date.localeCompare(a.date));
 const tot=r2(L.reduce((a,x)=>a+x.sell*x.qty,0));
 const card=document.createElement('div');card.className='card bk-card';
 card.innerHTML=`<h2>📚 مشتريات الكتب والمستلزمات — ${ptxt} <span class="bd g">${L.length} عملية</span><span class="bd">${money(tot)}</span></h2><div class="tw"><table><thead><tr><th>التاريخ</th><th>الصنف</th><th>الكمية</th><th>سعر القطعة</th><th>الإجمالي</th></tr></thead><tbody>${L.length?L.map(x=>`<tr><td>${esc(x.date)}</td><td><b>${esc(x.itemName)}</b></td><td>${x.qty}</td><td>${money(x.sell)}</td><td><b>${money(x.sell*x.qty)}</b></td></tr>`).join('')+`<tr><td colspan="4"><b>الإجمالي</b></td><td><b>${money(tot)}</b></td></tr>`:'<tr><td colspan="5" class="empty">لم يشترِ كتب أو مستلزمات في الفترة دي</td></tr>'}</tbody></table></div>`;
 out.appendChild(card)};

/* ---------- تشغيل ---------- */
relabel($('s-acc'));
navAdmin=undefined;buildNav();
try{refresh()}catch(e){console.error('extras.js',e)}
})();
