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
const MAIN=['home','reg','att','acc']; /* التبويبات اللي بتظهر في شريط الموبايل، الباقي في «المزيد» */
const GROUPS=[['عام',['home']],['الطلاب',['reg','att','eval','an','prof','cert']],['المالية',['due','acc','shop','exp']],['النظام',['log']]];
buildNav=function(){
 const a=isAdmin();if(a===navAdmin)return;navAdmin=a;
 const cur=(document.querySelector('.sec.on')||{id:'s-home'}).id.slice(2),used=new Set();
 const btn=([k,i,n])=>`<button data-t="${k}" class="${k===cur?'on':''}${MAIN.includes(k)?'':' mo'}" onclick="tab('${k}')"><span>${i}</span>${n}${k==='due'?'<em class="nb" id="nb" style="display:none"></em>':''}</button>`;
 const ok=t=>t&&(t[0]!=='log'||a);
 let h=GROUPS.map(([title,keys])=>{const items=keys.map(k=>TABS.find(t=>t[0]===k)).filter(ok);items.forEach(t=>used.add(t[0]));
  return items.length?`<div class="ng">${title}</div>`+items.map(btn).join(''):''}).join('');
 const rest=TABS.filter(t=>ok(t)&&!used.has(t[0]));if(rest.length)h+='<div class="ng">أخرى</div>'+rest.map(btn).join('');
 const DOTS='<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/></svg>';
 $('nav').innerHTML=h+`<button class="mbtn" id="moBtn" onclick="openMore()"><span>${DOTS}</span>المزيد</button>`;
 let sh=$('moSheet');if(!sh){sh=document.createElement('div');sh.id='moSheet';sh.className='mo-sheet';sh.onclick=e=>{if(e.target===sh)closeMore()};document.body.appendChild(sh)}
 sh.innerHTML=`<div class="mo-box"><div class="mo-grab"></div><div class="mo-grid">${TABS.filter(t=>ok(t)&&!MAIN.includes(t[0])).map(([k,i,n])=>`<button data-t="${k}" class="${k===cur?'on':''}" onclick="tab('${k}')"><span>${i}</span>${n}</button>`).join('')}</div></div>`;
 updMore()};

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
 $('prev').innerHTML=`<div class="sm"><span>المدفوع${$('rBill').value==='session'?' (من كل حصة)':''}</span><b>${money(amt)}</b></div><div class="sm"><span>ربح الأكاديمية</span><b>${money(a)}</b></div><div class="sm"><span>مستحق المدرب${t?' ('+esc(t.name)+')':''}</span><b>${money(amt-a)}</b></div>`};

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

/* ---------- 4) الثيم الأزرق (الموقع + التحليل + التقارير) ---------- */
const bl=document.createElement('style');bl.textContent=`
:root{--g1:#bfdbfe;--g2:#2563eb;--g3:#1d4ed8;--gold:linear-gradient(135deg,#2563eb,#0ea5e9);--ink:#0b1b3f;--ink2:#334155;--bg:#f1f5fc;--line:#dbe4f5;--blue:#0ea5e9;--sh:0 1px 2px rgba(11,27,63,.04),0 10px 28px -14px rgba(29,78,216,.22);--shh:0 2px 4px rgba(11,27,63,.05),0 22px 40px -16px rgba(29,78,216,.36)}
body{background:radial-gradient(900px 460px at 92% -8%,rgba(37,99,235,.14),transparent 60%),radial-gradient(760px 420px at 0% 100%,rgba(14,165,233,.10),transparent 60%),var(--bg);background-attachment:fixed}
::selection{background:#bfdbfe;color:#0b1b3f}
::-webkit-scrollbar-thumb{background:#bccae8}
aside{background:linear-gradient(185deg,#071433 0%,#0b2255 55%,#12358a 100%);box-shadow:-18px 0 50px -22px rgba(7,20,51,.7)}
aside::before{background:radial-gradient(260px 200px at 100% 0%,rgba(96,165,250,.28),transparent 70%),radial-gradient(220px 200px at 0% 100%,rgba(56,189,248,.18),transparent 70%)}
.brand img{filter:drop-shadow(0 8px 18px rgba(96,165,250,.45))}
.brand b{background-image:linear-gradient(90deg,#e0f2fe,#93c5fd,#e0f2fe)}
.brand small{color:#8fa8d8}.ng{color:#8fb0e8}
nav button{color:#b3c4e6}
nav button.on{background:linear-gradient(90deg,#2563eb,#0ea5e9);box-shadow:0 12px 24px -10px rgba(37,99,235,.85),inset 0 1px 0 rgba(255,255,255,.22)}
.top{background:rgba(241,245,252,.82);border-bottom-color:rgba(37,99,235,.10)}
h1.pt::before{box-shadow:0 6px 14px -4px rgba(37,99,235,.7)}
input:focus,select:focus{border-color:#2563eb;box-shadow:0 0 0 4px rgba(37,99,235,.16)}
.b-gold{background:linear-gradient(135deg,#2563eb,#0ea5e9);box-shadow:0 12px 22px -10px rgba(37,99,235,.8)}.b-gold:hover{box-shadow:0 16px 26px -10px rgba(37,99,235,.95)}
.b-ink{background:#0f2a5c}.b-ink:hover{background:#1e3a8a}
.b-out{color:#1d4ed8;border-color:#cfdcf5}.b-out:hover{background:#eff6ff;border-color:#93c5fd}
.wa button{background:#0f2a5c;color:#bfdbfe}.wa button:hover{background:#1d4ed8}
th{background:#f3f7fe}tbody tr:hover td{background:#eff6ff}
.bd{background:#e0ecff;color:#1d4ed8}
.av{background:linear-gradient(135deg,#2563eb,#0ea5e9);box-shadow:0 6px 12px -5px rgba(37,99,235,.65)}
.kpi{border-right-color:#2563eb}.kpi .ki{background:#e0ecff}
.kpi.main{background:linear-gradient(135deg,#0f2a5c 0%,#1d4ed8 55%,#0ea5e9 100%);box-shadow:0 18px 34px -16px rgba(29,78,216,.8);border-right-color:#bfdbfe}.kpi.main .l{color:#dbeafe}
.verdict,.phead{background:linear-gradient(135deg,#0b1b3f 0%,#12358a 60%,#1d4ed8 100%);border-right-color:#60a5fa;box-shadow:0 20px 38px -20px rgba(18,53,138,.85)}
.verdict b{color:#bfdbfe}.phead .av{background:linear-gradient(135deg,#bfdbfe,#7dd3fc);color:#0b1b3f}
.stu:hover{border-color:#93c5fd}.stu.on{border-color:#2563eb;background:linear-gradient(180deg,#f3f8ff,#eaf2ff)}
.cnt,.status{background:#eaf2ff;color:#1d4ed8}.status{border-color:#bfdbfe}
.prev{background:linear-gradient(135deg,#f3f8ff,#eaf2ff);border-color:#93c5fd;color:#0f2a5c}
.li{background:#f5f8fe;border-color:#e3ebfa}.li:hover{background:#eaf2ff}
.modal{background:rgba(7,20,51,.6)}.box{border-top-color:#2563eb}
#login{background:linear-gradient(160deg,#071433,#0b2255 55%,#1e40af)}#login::before{background:#2563eb}#login::after{background:#0ea5e9}
#login img{filter:drop-shadow(0 8px 16px rgba(37,99,235,.35))}
/* التحليل */
.an .btn.b-gold{background:linear-gradient(135deg,#60a5fa,#2563eb 60%,#1d4ed8);color:#fff;box-shadow:0 10px 18px -10px rgba(37,99,235,.8)}
.an .btn.b-out{border-color:rgba(147,197,253,.6)}.an .btn.b-out:hover{background:rgba(147,197,253,.16)}
.an .an-tbl .btn.b-out{color:#0f2a5c;border-color:#2563eb}.an .an-tbl .btn.b-ink{background:#0f2a5c;color:#bfdbfe}
.an-hero{background:linear-gradient(135deg,#071433 0%,#0b2255 60%,#12358a 100%);border-bottom-color:#2563eb}
.an-hero::before{background:radial-gradient(circle,rgba(96,165,250,.3),transparent 65%)}
.an-hero::after{background:repeating-linear-gradient(135deg,rgba(147,197,253,.05) 0 2px,transparent 2px 16px)}
.an-av{background:linear-gradient(135deg,#bfdbfe,#2563eb,#1e3a8a);box-shadow:0 0 0 6px rgba(96,165,250,.16),0 14px 26px -10px rgba(37,99,235,.7)}
.an-av span{background:#071433;color:#93c5fd}
.an-chips span{background:rgba(147,197,253,.14);color:#dbeafe;border-color:rgba(147,197,253,.35)}
.an-sum{color:#cbd9f2}.an-score small,.rnum small{color:#a9bde0}.rnum b{color:#93c5fd}
.st-vg{background:#2563eb;color:#fff}.st-g{background:#dbeafe;color:#1e3a8a}.st-n{background:#e2e8f0;color:#475569}
.an-st{border-top-color:#2563eb}.an-st .v{color:#0b1b3f}
.an-st.dark{background:linear-gradient(135deg,#0b1b3f,#12358a);border-color:#0b1b3f;border-top-color:#60a5fa}.an-st.dark .v{color:#93c5fd}.an-st.dark .l,.an-st.dark .s{color:#cbd9f2!important}
.an-h{color:#0b1b3f}.an-h::before{background:linear-gradient(#60a5fa,#2563eb,#1e3a8a)}
.sk-bar{background:#e2eaf8}.sk-bar u{background:#0b1b3f}.sk-v{color:#0b1b3f}
.an-cb h3{color:#0b1b3f}.an-cb h3::before{background:#2563eb}
.ins li::before{color:#2563eb}.ins.watch{border-right-color:#2563eb}.ins.watch h4{color:#1d4ed8}
.tipbox{background:linear-gradient(135deg,#0b1b3f,#12358a);border-right-color:#60a5fa;color:#e0ecff}.tipbox b{color:#93c5fd}
.tl .y{border-top-color:#2563eb;background:#f3f8ff}.tl .n{border-top-color:#0b1b3f;background:#eef1f7}.tl em{background:#0b1b3f;color:#93c5fd}
.an-tbl thead th{background:#0b1b3f!important;color:#bfdbfe!important}
.an-tbl tr.avr td{background:#eff6ff;border-top-color:#2563eb}
.h3{background:#dbeafe;color:#1e3a8a}
.mb{background:#e2eaf8}.mb b{background:linear-gradient(90deg,#1d4ed8,#60a5fa)}
.rb{background:#e2eaf8;color:#334155}.rb.g1{background:linear-gradient(135deg,#60a5fa,#2563eb);color:#fff}.rb.g2{background:#0b1b3f;color:#93c5fd}.rb.g3{background:#1e3a8a;color:#fff}
.pod-av{background:#0b1b3f;color:#93c5fd;border-color:#2563eb}.pod-c.p1 .pod-av{box-shadow:0 0 0 6px rgba(37,99,235,.2)}
.pod-base{background:linear-gradient(#12358a,#0b1b3f)}.pod-c.p1 .pod-base{background:linear-gradient(#60a5fa,#2563eb 70%,#1d4ed8);color:#fff}.pod-c.p3 .pod-base{background:linear-gradient(#1e3a8a,#0f2a5c)}
.an .bd{background:#dbeafe;color:#1e3a8a}.an .bd.b{background:#0b1b3f;color:#93c5fd}.an .bd.r{background:#fbe1dd;color:#a82e20}
.an .av{background:linear-gradient(135deg,#60a5fa,#2563eb);color:#fff}
/* التقارير A4 */
.rp-head{background:linear-gradient(120deg,#071433,#0b2255 65%,#12358a);border-bottom-color:#2563eb}.rp-head::after{background:linear-gradient(90deg,transparent,#60a5fa)}
.rp-mono{background:linear-gradient(135deg,#60a5fa,#2563eb);color:#fff}.rp-head h1{color:#bfdbfe}.rp-head p,.rp-ttl span{color:#a9bde0}.rp-ttl b{border-color:#60a5fa}
.rp-stu{background:#f3f7fe;border-color:#dbe4f5;border-right-color:#2563eb}.rp-av{background:#0b1b3f;color:#93c5fd;border-color:#2563eb}
.rp-chips span{border-color:#93c5fd;color:#1e3a8a}.rp-per b{background:#dbeafe;color:#0b1b3f}
.rp-box{border-color:#dbe4f5}.rp-box h3{border-bottom-color:#2563eb}
.rp-sb .tr{background:#e2eaf8}.rp-sb .tr u{background:#0b1b3f}
.rp-k div{border-color:#dbe4f5;border-top-color:#2563eb}
.rp-v{background:linear-gradient(120deg,#0b1b3f,#12358a);color:#e0ecff;border-right-color:#60a5fa}.rp-v b{color:#93c5fd}
.rp-i .w{background:#eff6ff;border-color:#bfdbfe;border-right-color:#2563eb}.rp-i .w b{color:#1d4ed8}
.rp th{background:#0b1b3f;color:#bfdbfe}.rp td{border-bottom-color:#e2eaf8}
.rp-f{border-top-color:#2563eb;background:#f6f9fe}
.rp-par{background:#0b1b3f;color:#e0ecff;border-right-color:#60a5fa}.rp-par b{color:#93c5fd}
/* الموبايل: شريط سفلي + المزيد */
.mbtn{display:none!important}
.mo-sheet{position:fixed;inset:0;z-index:40;background:rgba(7,20,51,.55);backdrop-filter:blur(4px);display:none;align-items:flex-end}
.mo-sheet.show{display:flex;animation:fadeIn .2s}
.mo-box{width:100%;background:#fff;border-radius:22px 22px 0 0;padding:10px 14px calc(92px + env(safe-area-inset-bottom));animation:rise .3s var(--ease)}
.mo-grab{width:42px;height:4px;border-radius:4px;background:#cbd5e1;margin:2px auto 14px}
.mo-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.mo-grid button{all:unset;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:6px;padding:14px 6px;border-radius:16px;background:#f3f7fe;color:#0b1b3f;font-weight:600;font-size:12.5px;text-align:center}
.mo-grid button span{display:grid;place-items:center;width:40px;height:40px;border-radius:13px;background:#fff;color:#1d4ed8;box-shadow:0 4px 10px -6px rgba(29,78,216,.5)}
.mo-grid button span svg{width:20px;height:20px}
.mo-grid button.on{background:linear-gradient(135deg,#2563eb,#0ea5e9);color:#fff}.mo-grid button.on span{background:rgba(255,255,255,.2);color:#fff}
@media(max-width:860px){
 aside{background:rgba(7,20,51,.95)}
 nav{justify-content:space-around;overflow:visible}
 nav button.mo{display:none}
 nav button.mbtn{display:flex!important}
 nav button{flex:1;min-width:0;justify-content:center}
 nav button.on{background:rgba(37,99,235,.38)}nav button.on span{background:linear-gradient(135deg,#2563eb,#0ea5e9)}
}
@media(min-width:861px){.mo-sheet{display:none!important}}
/* الموبايل: الجداول تتحول لكروت */
@media(max-width:640px){
 main .tw:not(.an-tbl){border:0;background:transparent;overflow:visible}
 main table.rsp,main table.rsp tbody{display:block}
 main table.rsp thead{display:none}
 main table.rsp tr{display:block;background:#fff;border:1px solid var(--line);border-radius:16px;margin:0 0 10px;padding:8px 14px;box-shadow:var(--sh)}
 main table.rsp td{display:flex;justify-content:space-between;align-items:center;gap:12px;text-align:right;padding:7px 0;border-bottom:1px dashed #e8eef9;background:transparent!important}
 main table.rsp td:last-child{border-bottom:0}
 main table.rsp td::before{content:attr(data-label);color:var(--mut);font-weight:600;font-size:12px;flex:none}
 main table.rsp td[data-label=""]::before{display:none}
 main table.rsp td[data-label=""]{flex-wrap:wrap;justify-content:flex-start}
 main table.rsp td.empty{display:block;text-align:center}main table.rsp td.empty::before{display:none}
 main table.rsp td input.sc,main table.rsp td input.pr{width:84px}
}
`;document.head.appendChild(bl);

/* المزيد (موبايل) */
function openMore(){const s=$('moSheet');if(s)s.classList.add('show')}
function closeMore(){const s=$('moSheet');if(s)s.classList.remove('show')}
function updMore(){const cur=(document.querySelector('.sec.on')||{id:'s-home'}).id.slice(2),mb=$('moBtn');
 if(mb)mb.classList.toggle('on',!MAIN.includes(cur));
 document.querySelectorAll('#moSheet button').forEach(b=>b.classList.toggle('on',b.dataset.t===cur))}
window.openMore=openMore;window.closeMore=closeMore;
const _tab=tab;
tab=function(t){const r=_tab(t);closeMore();updMore();return r};

/* الجداول → كروت على الموبايل (بنحط اسم العمود على كل خلية) */
function rsp(){document.querySelectorAll('main .tw table').forEach(t=>{if(t.closest('.an-tbl'))return;
 const h=[...t.querySelectorAll('thead th')].map(x=>x.textContent.trim());if(!h.length)return;t.classList.add('rsp');
 t.querySelectorAll('tbody tr').forEach(r=>{if(r.dataset.l)return;r.dataset.l=1;[...r.children].forEach((c,i)=>{if(c.colSpan>1)return;c.setAttribute('data-label',h[i]||'')})})})}
let rt=null;new MutationObserver(()=>{if(!rt)rt=setTimeout(()=>{rt=null;rsp()},40)}).observe(document.querySelector('main'),{childList:true,subtree:true});

/* ألوان الرسوم البيانية (بيتحوّل للأزرق قبل الرسم، وفي PDF كمان) */
const CMAP={'#d9a400':'#2563eb','#0b0b0e':'#0f2a5c','#8a6500':'#0ea5e9','#9a9482':'#94a3b8','#6366f1':'#2563eb','#8b5cf6':'#0ea5e9','#1e1b4b':'#0f2a5c','#a5b4fc':'#bfdbfe','#c7d2fe':'#bfdbfe','#fda4af':'#fda4af',
 'rgba(217,164,0,.30)':'rgba(37,99,235,.28)','rgba(99,102,241,.28)':'rgba(37,99,235,.28)','rgba(11,11,14,.05)':'rgba(15,42,92,.06)'};
function recolor(o){if(!o||typeof o!=='object')return;for(const k of Object.keys(o)){const v=o[k];if(typeof v==='string'){const m=CMAP[v.toLowerCase()];if(m)o[k]=m}else if(v&&typeof v==='object')recolor(v)}}
SKB[0][3]='#2563eb';SKB[1][3]='#0f2a5c';SKB[2][3]='#0ea5e9';SKB[3][3]='#94a3b8';
const _mk=mk;mk=function(id,cfg){recolor(cfg);return _mk(id,cfg)};
const _ci=chartImg;chartImg=function(cfg,...a){recolor(cfg);return _ci(cfg,...a)};

/* ---------- 5) تقسيمة الصفحات + وضوح الخط ---------- */
(function(){const l=document.createElement('link');l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap';document.head.appendChild(l)})();
const ly=document.createElement('style');ly.textContent=`
/* ===== الأساس: خط واضح + مسافات منتظمة ===== */
body{font-size:15px;line-height:1.75;color:#0f172a}
main,aside,.modal,#login{font-family:'Cairo','IBM Plex Sans Arabic','Segoe UI',Tahoma,Arial,sans-serif}
main input,main select,main textarea,main button,main table,aside button,.modal input,.modal select,.modal textarea,.modal button,#login input,#login button{font-family:inherit}
main{max-width:1280px;padding:0 36px 80px;font-size:15px}
h1.pt{font-size:28px;font-weight:800;margin-bottom:4px;letter-spacing:0}
h1.pt::after{display:none}
.pg-sub{color:#64748b;font-size:14.5px;font-weight:500;margin:0 0 24px}
.card{padding:24px 26px;border:1px solid #e2e8f4;margin-bottom:20px}
.card>h2{font-size:17px;font-weight:700;margin-bottom:18px;padding-bottom:14px;border-bottom:1px solid #eef2fa;color:#0f172a}
.grid{gap:16px 18px}
.hint{font-size:12.5px;color:#64748b;margin-top:6px;line-height:1.7}
/* ===== الخانات ===== */
main label,.modal label,#login label{font-size:13.5px;font-weight:700;color:#334155;margin-bottom:8px}
main input:not([type=checkbox]):not([type=radio]):not([type=file]),main select,.modal input:not([type=checkbox]):not([type=radio]),.modal select,#login input{height:48px;padding:0 14px;font-size:16px;font-weight:500;line-height:1.4;color:#0f172a;background-color:#fff;border:1.5px solid #cbd5e8;border-radius:12px;letter-spacing:0}
main input:hover,main select:hover{border-color:#94a8cf}
main select,.modal select{appearance:none;-webkit-appearance:none;padding-left:38px;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path d='M1 1.5l5 5 5-5' fill='none' stroke='%2364748b' stroke-width='1.8' stroke-linecap='round'/></svg>");background-repeat:no-repeat;background-position:left 14px center}
main td input:not([type=checkbox]):not([type=radio]),.stu input.amt{height:40px;padding:0 8px;font-size:15px}
input::placeholder{color:#8a97b5;font-weight:400}
input[type=number],input[type=tel],input[dir=ltr]{font-variant-numeric:tabular-nums}
/* ===== الأزرار ===== */
.btn{height:42px;padding:0 20px;font-size:14.5px;font-weight:700;border-radius:12px}
.b-sm{height:34px;padding:0 13px;font-size:13px;border-radius:10px}
.acts{gap:10px;margin-top:20px}
/* ===== الجداول ===== */
.tw{border:1px solid #e2e8f4;border-radius:16px;box-shadow:none}
th{background:#f1f5fb;color:#334155;font-size:13px;font-weight:700;padding:14px 12px;border-bottom:1px solid #e2e8f4}
td{padding:13px 12px;font-size:14.5px;color:#0f172a;border-bottom:1px solid #eef2fa;vertical-align:middle}
tbody tr:last-child td{border-bottom:0}
td:last-child{white-space:nowrap}
td .btn.b-sm{margin:2px}
/* ===== القايمة الجانبية ===== */
nav button{font-size:14px;font-weight:600}
.fbar{grid-template-columns:2fr 1fr 1fr 1fr}
@media(max-width:760px){.fbar{grid-template-columns:1fr}.card{padding:18px 16px}h1.pt{font-size:24px}}
@media(max-width:860px){main{padding:0 14px 96px}}
/* ===== صفحة تسجيل الطلاب ===== */
#s-reg>.card:first-of-type{background:none;border:0;box-shadow:none;padding:0;backdrop-filter:none}
#s-reg>.card:first-of-type>h2{font-size:19px;border:0;padding:0;margin-bottom:16px}
#s-reg .rg{display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:22px;align-items:start}
#s-reg .rm{display:flex;flex-direction:column;gap:20px}
#s-reg .fs{background:#fff;border:1px solid #e2e8f4;border-radius:18px;padding:22px 24px 24px;box-shadow:var(--sh)}
#s-reg .fs h3{display:flex;align-items:center;gap:12px;font-size:16.5px;font-weight:700;margin-bottom:20px;padding-bottom:14px;border-bottom:1px solid #eef2fa;color:#0f172a}
#s-reg .fs h3 i{display:grid;place-items:center;width:30px;height:30px;border-radius:10px;background:linear-gradient(135deg,#2563eb,#0ea5e9);color:#fff;font-style:normal;font-size:14px;font-weight:700}
#s-reg .fg{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px 20px}
#s-reg .fg #rPayW{grid-column:1/-1}
#s-reg .rs{position:sticky;top:88px;display:flex;flex-direction:column;gap:16px}
#s-reg .rs-box{background:#fff;border:1px solid #e2e8f4;border-radius:18px;padding:18px 20px;box-shadow:var(--sh)}
#s-reg .rs-box>h3{font-size:15px;font-weight:700;margin-bottom:12px;color:#0f172a}
#s-reg .rs-box>label{font-size:15px;margin-bottom:14px}
#s-reg .phrow{flex-direction:column;text-align:center;gap:14px}
#s-reg .phprev{width:120px;height:120px;font-size:38px}
#s-reg .prev{background:#f6f9fe;border:1px dashed #b6c8ea;border-radius:14px;padding:6px 16px;font-weight:500;color:#0f172a}
#s-reg .prev .sm{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:11px 0;border-bottom:1px dashed #d5e0f4;font-size:14.5px}
#s-reg .prev .sm:last-child{border-bottom:0}
#s-reg .prev .sm b{font-size:16px;color:#1d4ed8}
#s-reg .prev .nt{padding:8px 0 0;font-size:12.5px;color:#64748b}
#s-reg .rs-acts{display:flex;flex-direction:column;gap:10px;margin:0}
#s-reg .rs-acts .btn{justify-content:center;width:100%;height:46px;font-size:15px}
#s-reg .rs-acts .b-gold{height:52px;font-size:16.5px}
@media(max-width:1100px){#s-reg .rg{grid-template-columns:1fr}#s-reg .rs{position:static}}
@media(max-width:640px){#s-reg .fg{grid-template-columns:1fr}#s-reg .fs{padding:18px 16px}}
`;document.head.appendChild(ly);

function layoutReg(){
 const f=document.querySelector('#s-reg form');if(!f||f.dataset.done)return;f.dataset.done=1;
 const W=id=>{const e=$(id);return e?(e.closest('.grid > div')||e.parentElement):null};
 const acts=f.querySelector('.acts');
 const sec=(n,t,ids)=>{const s=document.createElement('div');s.className='fs';s.innerHTML=`<h3><i>${n}</i>${t}</h3><div class="fg"></div>`;const g=s.lastChild;ids.forEach(id=>{const w=W(id);if(w)g.appendChild(w)});return s};
 const s1=sec(1,'بيانات الطالب',['rName','rNameEn','rPhone','rBirth']);
 const s2=sec(2,'الأكاديمية والمستوى',['rAc','rTr','rLv','rJoin']);
 const s3=sec(3,'الاشتراك والحساب',['rAcct','rBill','rAmt','rAcAmt','rPayW']);
 const rm=document.createElement('div');rm.className='rm';rm.append(s1,s2,s3);
 const ph=W('phFile');ph.removeAttribute('style');ph.className='rs-box';
 const pw=W('prev');pw.removeAttribute('style');pw.className='rs-box';pw.insertAdjacentHTML('afterbegin','<h3>ملخص الحساب</h3>');
 acts.className='rs-acts';
 const rs=document.createElement('div');rs.className='rs';rs.append(ph,pw,acts);
 const rg=document.createElement('div');rg.className='rg';rg.append(rm,rs);
 f.textContent='';f.appendChild(rg);
 const q=$('q');if(q&&q.parentElement)q.parentElement.classList.add('fbar');
}

/* ---------- تشغيل ---------- */
relabel($('s-acc'));
navAdmin=undefined;buildNav();
try{refresh()}catch(e){console.error('extras.js',e)}
rsp();
layoutReg();
/* عنوان فرعي تحت اسم كل صفحة */
const SUBS={home:'نظرة سريعة على الطلاب والإيرادات والتنبيهات',reg:'سجّل الطلاب الجدد، عدّل بياناتهم، وتابع قائمة المسجلين',att:'سجّل حضور الطلاب وحصّل الاشتراكات',eval:'قيّم الطلاب من 100 في الواجب والإملاء والأيباكس والسرعة',due:'تابع الاشتراكات المؤجلة وحصّلها',an:'تحليل أداء الطالب أو الأكاديمية أو المدرب',prof:'ملف الطالب الكامل: حضور ودرجات ودفعات ومشتريات',acc:'إيراداتك وأرباحك ومستحقات المدربين',shop:'المخزون والمبيعات والمشتريات',exp:'سجّل مصروفاتك وتابعها شهرياً',log:'كل العمليات اللي اتعملت على النظام',cert:'اطبع شهادات التقدير للطلاب'};
for(const k in SUBS){const h=document.querySelector('#s-'+k+' > h1.pt');if(h&&!h.nextElementSibling?.classList.contains('pg-sub')){const p=document.createElement('p');p.className='pg-sub';p.textContent=SUBS[k];h.after(p)}}
})();
