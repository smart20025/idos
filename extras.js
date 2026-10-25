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

/* ---------- 6) كارت الـ ID الجديد + نموذج التحليل (التقرير) الجديد ---------- */
(function(){const l=document.createElement('link');l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800&display=swap';document.head.appendChild(l)})();
SKB[3][3]='#f59e0b';
const dz=document.createElement('style');dz.textContent=`
/* ===== كارت الـ ID ===== */
.idc.n2{background:#041440;color:#fff;font-family:'Montserrat','Cairo',sans-serif}
.idc.n2::after{display:none}
.idc.n2 .n-bg{position:absolute;left:0;top:0;width:100%;height:100%}
.idc.n2 .nlg,.idc.n2 .nlgb{position:absolute;border-radius:50%;object-fit:contain;background:#fffaf0;box-shadow:0 0 0 .35mm #ffd84a,0 .6mm 1.4mm rgba(0,0,0,.4)}
.idc.n2 .nlg{left:4.2mm;top:2.5mm;width:8.6mm;height:8.6mm;padding:.5mm}
.idc.n2 .nlgb{left:50%;top:5.2mm;width:16mm;height:16mm;margin-left:-8mm;padding:1.1mm}
.idc.n2 .nmono{display:grid;place-items:center;background:linear-gradient(135deg,#ffe36e,#d9a400);color:#041440;font-weight:800;font-size:5mm;padding:0}
.idc.n2 .nlgb.nmono{font-size:9mm}
.idc.n2 .n-org{position:absolute;left:14.6mm;top:3.5mm;line-height:1.5;white-space:nowrap}
.idc.n2 .n-org small{display:block;font-size:1.5mm;letter-spacing:.22mm;color:#ffd84a;font-weight:700}
.idc.n2 .n-org b{display:block;font-size:1.55mm;letter-spacing:.22mm;color:#fff;font-weight:600}
.idc.n2 .n-chip{position:absolute;right:4mm;top:4.6mm;font-size:1.55mm;letter-spacing:.3mm;font-weight:700;color:#ffd84a;border:.2mm solid #ffd84a;border-radius:2mm;padding:.45mm 1.8mm}
.idc.n2 .n-ph{position:absolute;left:4.2mm;top:16.2mm;width:20mm;height:26mm;border-radius:2.3mm;padding:.7mm;background:linear-gradient(135deg,#fff1a8,#d9a400 55%,#8a6500);box-shadow:0 .8mm 2mm rgba(0,0,0,.5)}
.idc.n2 .n-ph img,.idc.n2 .n-ph span{display:block;width:100%;height:100%;border-radius:1.7mm;border:.3mm solid #fff;object-fit:cover;object-position:50% 20%;background:#fff}
.idc.n2 .n-ph span{display:grid;place-items:center;background:#0a2c80;color:#ffd84a;font-size:10mm;font-weight:800}
.idc.n2 .n-rib{position:absolute;left:5.4mm;top:39.8mm;width:17.6mm;height:4mm;line-height:4mm;text-align:center;border-radius:2mm;background:linear-gradient(90deg,#b8860b,#ffe36e 50%,#d9a400);color:#041440;font-size:1.8mm;font-weight:800;letter-spacing:.35mm;box-shadow:0 .5mm 1.2mm rgba(0,0,0,.45)}
.idc.n2 .n-nm{position:absolute;left:28.5mm;right:4.2mm;top:15.6mm;font-weight:800;line-height:1.15;max-height:10.8mm;overflow:hidden;color:#fff;text-shadow:0 .3mm .8mm rgba(0,0,0,.45)}
.idc.n2 .n-ul{position:absolute;left:28.5mm;top:27.1mm;width:18mm;height:.5mm;border-radius:1mm;background:linear-gradient(90deg,#ffe36e,rgba(255,227,110,0))}
.idc.n2 .n-r{position:absolute;left:28.5mm;right:21mm}
.idc.n2 .n-r small{display:block;font-size:1.4mm;letter-spacing:.3mm;color:#ffd84a;font-weight:700;line-height:1.3}
.idc.n2 .n-r b{display:block;font-size:2.55mm;font-weight:600;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:1.3}
.idc.n2 .n-lv{position:absolute;right:3.6mm;top:28.2mm;width:14.8mm;height:14.8mm;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#041440}
.idc.n2 .n-lv svg{position:absolute;left:0;top:0;width:100%;height:100%}
.idc.n2 .n-lv small{position:relative;font-size:1.3mm;font-weight:800;letter-spacing:.25mm;line-height:1}
.idc.n2 .n-lv b{position:relative;font-size:6.2mm;font-weight:800;line-height:1.05}
.idc.n2 .n-bar{position:absolute;left:0;right:0;bottom:0;height:4.7mm;display:flex;align-items:center;justify-content:space-between;padding:0 4.4mm;background:linear-gradient(90deg,#8a6500,#ffe36e 50%,#d9a400)}
.idc.n2 .n-bar span{font-size:1.5mm;font-weight:800;letter-spacing:.4mm;color:#041440}
.idc.n2 .n-bc{width:17mm;height:2.7mm}
.idc.n2 .n-bt{position:absolute;left:0;right:0;top:23.6mm;text-align:center;line-height:1.5}
.idc.n2 .n-bt b{display:block;direction:rtl;font-family:'Cairo',sans-serif;font-size:4.3mm;font-weight:800;color:#ffd84a}
.idc.n2 .n-bt small{display:block;font-size:1.7mm;letter-spacing:.3mm;color:#dbe8ff;font-weight:600}
.idc.n2 .n-bn{position:absolute;left:8mm;right:8mm;top:34.6mm;text-align:center;font-size:1.55mm;line-height:1.7;color:#b9cdf3;font-weight:500}
.idc.n2 .n-bn .ar{direction:rtl;font-family:'Cairo',sans-serif;font-size:1.9mm;color:#dbe8ff}
/* ===== نموذج التحليل (A4) ===== */
.rq{font-family:'Cairo','IBM Plex Sans Arabic',sans-serif;background:#fff}
.rq-head{position:relative;flex:none;height:132px}
.rq-hbg{position:absolute;left:0;top:0;width:794px;height:132px}
.rq-ht{position:absolute;left:30px;right:30px;top:0;height:108px;display:flex;align-items:center;gap:16px;color:#fff}
.rq-lg{flex:none;width:66px;height:66px;border-radius:50%;object-fit:contain;background:#fffaf0;padding:4px;box-shadow:0 0 0 3px #ffd84a,0 8px 18px rgba(0,0,0,.35)}
.rq-mn{display:grid;place-items:center;background:linear-gradient(135deg,#ffe36e,#d9a400);color:#04123a;font-size:34px;font-weight:800;padding:0}
.rq-org h1{font-size:21px;font-weight:800;color:#fff;margin:0;line-height:1.3}
.rq-org p{font-size:10.5px;color:#bcd0f5;margin:2px 0 0;direction:ltr;text-align:right;letter-spacing:.5px}
.rq-ttl{margin-right:auto;text-align:center}
.rq-ttl b{display:block;font-size:15px;font-weight:800;padding:6px 18px;border-radius:999px;background:linear-gradient(135deg,#ffe36e,#d9a400);color:#04123a;box-shadow:0 6px 14px rgba(0,0,0,.25)}
.rq-ttl span{display:block;font-size:10.5px;color:#cfdcf7;margin-top:6px}
.rq-body{flex:1;min-height:0;display:flex;flex-direction:column;gap:9px;padding:0 30px}
.rq-hero{position:relative;z-index:2;margin-top:-38px;display:flex;align-items:center;gap:16px;background:#fff;border-radius:20px;padding:14px 18px;box-shadow:0 14px 30px -12px rgba(11,27,63,.35);border:1px solid #e2e8f4;border-top:4px solid #2563eb}
.rq-av{flex:none;width:76px;height:76px;border-radius:50%;padding:4px;background:linear-gradient(135deg,#ffe36e,#d9a400 55%,#2563eb);box-shadow:0 8px 18px -6px rgba(37,99,235,.55)}
.rq-av img,.rq-av span{display:block;width:100%;height:100%;border-radius:50%;object-fit:cover;object-position:50% 20%;background:#fff}
.rq-av span{display:grid;place-items:center;background:#0b1b3f;color:#93c5fd;font-size:32px;font-weight:800}
.rq-hi h2{font-size:21px;font-weight:800;color:#0b1b3f;margin:0 0 6px}
.rq-ch{display:flex;gap:6px;flex-wrap:wrap}
.rq-ch span{background:#eaf2ff;color:#1e3a8a;border:1px solid #bcd3f7;border-radius:999px;padding:1px 12px;font-size:11px;font-weight:700}
.rq-pd{font-size:11px;color:#64748b;margin-top:6px}.rq-pd b{color:#1d4ed8}
.rq-sc{margin-right:auto;display:flex;flex-direction:column;align-items:center;gap:4px}
.rq-rg{position:relative;width:96px;height:96px}.rq-rg svg{width:100%;height:100%}
.rq-rn{position:absolute;left:0;right:0;top:0;bottom:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
.rq-rn b{font-size:28px;font-weight:800;color:#0b1b3f;line-height:1}.rq-rn small{font-size:9.5px;color:#64748b}
.rq-kp{display:grid;grid-template-columns:repeat(6,1fr);gap:8px}
.rq-k{position:relative;overflow:hidden;height:64px;border-radius:14px;border:1px solid #e2e8f4;padding:8px 6px;text-align:center}
.rq-k::before{content:"";position:absolute;left:0;right:0;top:0;height:4px}
.rq-k::after{content:"";position:absolute;width:46px;height:46px;border-radius:50%;left:-14px;bottom:-18px;opacity:.13}
.rq-k b{position:relative;display:block;font-size:19px;font-weight:800;color:#0b1b3f;line-height:1.3;margin-top:4px}
.rq-k span{position:relative;font-size:9.5px;color:#64748b;font-weight:700}
.rq-k.k1{background:linear-gradient(160deg,#fff,#eaf2ff)}.rq-k.k1::before,.rq-k.k1::after{background:#2563eb}
.rq-k.k2{background:linear-gradient(160deg,#fff,#e8f9f0)}.rq-k.k2::before,.rq-k.k2::after{background:#10b981}
.rq-k.k3{background:linear-gradient(160deg,#fff,#fdecee)}.rq-k.k3::before,.rq-k.k3::after{background:#e11d48}
.rq-k.k4{background:linear-gradient(160deg,#fff,#e6f6fd)}.rq-k.k4::before,.rq-k.k4::after{background:#0ea5e9}
.rq-k.k5{background:linear-gradient(160deg,#fff,#e9edf7)}.rq-k.k5::before,.rq-k.k5::after{background:#0f2a5c}
.rq-k.k6{background:linear-gradient(160deg,#fff,#fff5e3)}.rq-k.k6::before,.rq-k.k6::after{background:#f59e0b}
.rq-cd{position:relative;overflow:hidden;background:#fff;border:1px solid #e2e8f4;border-radius:16px;padding:10px 14px 12px}
.rq-cd::after{content:"";position:absolute;width:90px;height:90px;border-radius:50%;left:-34px;top:-40px;background:#2563eb;opacity:.05}
.rq-cd h3{position:relative;font-size:12.5px;font-weight:800;color:#0b1b3f;margin:0 0 8px;display:flex;align-items:center;gap:8px}
.rq-cd h3::before{content:"";width:6px;height:16px;border-radius:4px;background:linear-gradient(#38bdf8,#1d4ed8)}
.rq-cd img{width:100%;display:block}
.rq-r1{display:grid;grid-template-columns:1fr 1fr;gap:9px}
.rq-r2{display:grid;grid-template-columns:1.7fr 1fr;gap:9px}
.rq-sk{display:flex;flex-direction:column;justify-content:space-around;height:calc(100% - 26px)}
.rq-sb{display:flex;align-items:center;gap:8px}
.rq-sb span{width:50px;font-size:11.5px;font-weight:700;color:#334155}
.rq-sb .tr{position:relative;flex:1;height:12px;border-radius:8px;background:#e8eefa}
.rq-sb .tr i{position:absolute;right:0;top:0;bottom:0;border-radius:8px}
.rq-sb .tr u{position:absolute;top:-4px;width:3px;height:20px;background:#0b1b3f;border-radius:2px}
.rq-sb b{width:28px;text-align:left;font-size:13px;color:#0b1b3f}
.rq-leg{font-size:9.5px;color:#64748b;margin-top:2px}
.rq-in{display:grid;grid-template-columns:1fr 1fr;gap:9px}
.rq-in>div{border-radius:14px;padding:9px 14px;font-size:11px;line-height:1.7}
.rq-in b{display:block;font-size:12px;margin-bottom:3px}.rq-in p{margin:2px 0}
.rq-in .g{background:linear-gradient(135deg,#ecfdf5,#fff);border:1px solid #bfe9d2;border-right:5px solid #10b981}.rq-in .g b{color:#047857}
.rq-in .w{background:linear-gradient(135deg,#eff6ff,#fff);border:1px solid #bfd5f7;border-right:5px solid #2563eb}.rq-in .w b{color:#1d4ed8}
.rq-pr{border-radius:14px;padding:9px 16px;font-size:11px;line-height:1.8;color:#e0ecff;background:linear-gradient(120deg,#0b1b3f,#12358a);border-right:6px solid #ffd84a}
.rq-pr b{color:#ffd84a;margin-left:6px}
.rq-vd{border-radius:14px;padding:8px 16px;font-size:11px;line-height:1.8;color:#1e3a8a;background:#eef4ff;border:1px solid #cfe0fb}
.rq-f{flex:none;height:58px;position:relative;display:flex;align-items:flex-end;justify-content:space-between;gap:12px;padding:0 30px 12px;margin-top:8px}
.rq-f::before{content:"";position:absolute;left:0;right:0;top:0;height:3px;background:linear-gradient(90deg,#1d4ed8,#38bdf8 55%,#ffd84a)}
.rq-empty{margin:50px 0;text-align:center;color:#64748b;font-size:15px}
`;document.head.appendChild(dz);

/* --- كارت الـ ID --- */
let _n2=0;
function nLogo(safe,cls){const mono=`<div class="${cls} nmono">I</div>`;
 if(safe)return LOGO_SAFE?`<img class="${cls}" src="${LOGO_SAFE}" alt="">`:mono;
 const src=(document.querySelector('.brand img')||{}).src;return src?`<img class="${cls}" src="${src}" alt="" onerror="this.outerHTML='<div class=&quot;${cls} nmono&quot;>I</div>'">`:mono}
function nBar(seed){let h=0;for(const c of String(seed))h=(h*31+c.charCodeAt(0))>>>0;let x=0,o='';
 for(let i=0;i<36;i++){h=(h*1103515245+12345)>>>0;const w=.35+((h>>>16)%3)*.28;o+=`<rect x="${x.toFixed(2)}" y="0" width="${w.toFixed(2)}" height="10" fill="#041440"/>`;x+=w+.32+((h>>>8)%2)*.2}
 return`<svg class="n-bc" viewBox="0 0 ${x.toFixed(2)} 10" preserveAspectRatio="none">${o}</svg>`}
const nGold=id=>`<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#b8860b"/><stop offset=".5" stop-color="#ffe36e"/><stop offset="1" stop-color="#d9a400"/></linearGradient>`;
cardF=function(s,o,safe){
 const e=o||idNames(s),ph=PF[s.id]||PH[s.id],g=++_n2,n=e.n||'',code=('IDOS-'+String(s.id).slice(-6)).toUpperCase();
 const fs=n.length<=14?4.7:n.length<=20?4.2:n.length<=28?3.7:3.2;
 const bg=`<svg class="n-bg" viewBox="0 0 85.6 54" preserveAspectRatio="none"><defs><linearGradient id="nb${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#041440"/><stop offset=".5" stop-color="#0a2c80"/><stop offset="1" stop-color="#1650c8"/></linearGradient>${nGold('ng'+g)}</defs>
  <rect width="85.6" height="54" fill="url(#nb${g})"/><circle cx="80" cy="6" r="30" fill="#fff" opacity=".06"/><circle cx="2" cy="58" r="26" fill="#38bdf8" opacity=".12"/>
  <path d="M0 0H85.6V13.4H0Z" fill="#031030" opacity=".38"/>
  <path d="M42 54C58 47 72 34 85.6 17V21C72 37 58 51 46 54Z" fill="url(#ng${g})" opacity=".95"/>
  <path d="M52 54C66 49 77 40 85.6 28V31C77 43 66 52 56 54Z" fill="#fff" opacity=".14"/>
  <rect x="0" y="13.2" width="85.6" height=".35" fill="url(#ng${g})" opacity=".9"/>
  <rect x=".9" y=".9" width="83.8" height="52.2" rx="2.2" fill="none" stroke="#ffd84a" stroke-width=".22" opacity=".55"/></svg>`;
 const hx=`<svg viewBox="0 0 100 100"><defs>${nGold('nh'+g)}</defs><polygon points="50,3 94,26 94,74 50,97 6,74 6,26" fill="url(#nh${g})" stroke="#fff" stroke-width="3.5"/></svg>`;
 return`<div class="idc n2">${bg}${nLogo(safe,'nlg')}<div class="n-org"><small>INTERNATIONAL DELTA ORGANIZATION</small><b>FOR SOROBAN</b></div><div class="n-chip">STUDENT ID</div>
 <div class="n-ph">${ph?`<img src="${ph}" alt="">`:`<span>${esc((n||'?').charAt(0).toUpperCase())}</span>`}</div><div class="n-rib">STUDENT</div>
 <div class="n-nm" style="font-size:${fs}mm">${esc(n)}</div><div class="n-ul"></div>
 <div class="n-r" style="top:29.4mm"><small>ACADEMY</small><b>${esc(e.a)}</b></div><div class="n-r" style="top:35.2mm"><small>TRAINER</small><b>${esc(e.t)}</b></div><div class="n-r" style="top:41mm"><small>ID NO.</small><b>${code}</b></div>
 <div class="n-lv">${hx}<small>LEVEL</small><b>${s.level}</b></div>
 <div class="n-bar"><span>STUDENT ID CARD</span>${nBar(s.id)}</div></div>`};
function cardBk(safe){const g=++_n2;
 const bg=`<svg class="n-bg" viewBox="0 0 85.6 54" preserveAspectRatio="none"><defs><linearGradient id="bb${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#041440"/><stop offset=".55" stop-color="#0a2c80"/><stop offset="1" stop-color="#1650c8"/></linearGradient>${nGold('bg'+g)}</defs>
  <rect width="85.6" height="54" fill="url(#bb${g})"/><circle cx="43" cy="14" r="26" fill="#fff" opacity=".07"/><circle cx="88" cy="56" r="24" fill="#38bdf8" opacity=".14"/><circle cx="-4" cy="52" r="20" fill="#38bdf8" opacity=".1"/>
  <rect x="0" y="22.2" width="85.6" height=".3" fill="url(#bg${g})" opacity=".8"/>
  <rect x=".9" y=".9" width="83.8" height="52.2" rx="2.2" fill="none" stroke="#ffd84a" stroke-width=".22" opacity=".55"/>
  <rect x="2.1" y="2.1" width="81.4" height="49.8" rx="1.6" fill="none" stroke="#ffd84a" stroke-width=".12" opacity=".35"/></svg>`;
 return`<div class="idc n2 nb">${bg}${nLogo(safe,'nlgb')}<div class="n-bt"><b>منظمة إيدوس الدولية للسوروبان</b><small>INTERNATIONAL DELTA ORGANIZATION FOR SOROBAN</small></div>
 <div class="n-bn">This card is the property of IDOS. Please present it upon request.<div class="ar">هذه البطاقة خاصة بالطالب ويجب إبرازها عند الطلب</div></div>
 <div class="n-bar"><span>★ ★ ★</span>${nBar('idos-back')}</div></div>`}
idPages=function(list,backs,safe){
 if(list.length===1)return[`<div class="idp one"><div><div class="idcap">FRONT</div>${cardF(list[0],null,safe)}</div><div><div class="idcap">BACK</div>${cardBk(safe)}</div></div>`];
 const P=[];for(let i=0;i<list.length;i+=10){const ch=list.slice(i,i+10);P.push(`<div class="idp">${ch.map(s=>cardF(s,null,safe)).join('')}</div>`);if(backs)P.push(`<div class="idp">${ch.map(()=>cardBk(safe)).join('')}</div>`)}return P};
idLive=function(){if(!idCur)return;$('idPrev').innerHTML=cardF(idCur,idVals())+cardBk()};
idLoadLogo=async function(){await Promise.all(['700 10px Montserrat','800 10px Montserrat','600 10px Montserrat','800 10px Cairo','500 10px Cairo'].map(f=>document.fonts.load(f).catch(()=>{})));await document.fonts.ready;LOGO_SAFE=await prepLogo()};

/* --- نموذج التحليل (التقرير) --- */
let _rq=0;
reportHTML=function(s,mode,month,pt,safe){
 const st=calcStats(s,mode,month),g=++_rq,logo=safe?(LOGO_SAFE||''):(document.querySelector('.brand img').getAttribute('src')||''),
 dt=new Date().toLocaleDateString('ar-EG',{day:'numeric',month:'long',year:'numeric'});
 const art=`<svg class="rq-hbg" viewBox="0 0 794 132"><defs><linearGradient id="rqa${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#041440"/><stop offset=".55" stop-color="#0a2c80"/><stop offset="1" stop-color="#1d4ed8"/></linearGradient><linearGradient id="rqb${g}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#b8860b"/><stop offset=".5" stop-color="#ffe36e"/><stop offset="1" stop-color="#d9a400"/></linearGradient></defs>
  <rect width="794" height="132" fill="url(#rqa${g})"/><circle cx="730" cy="6" r="124" fill="#fff" opacity=".06"/><circle cx="40" cy="150" r="112" fill="#38bdf8" opacity=".14"/><circle cx="420" cy="-30" r="70" fill="#fff" opacity=".04"/>
  <path d="M-10 112C150 78 300 132 470 102S700 80 804 104" fill="none" stroke="url(#rqb${g})" stroke-width="3.2"/>
  <path d="M-10 122C160 92 310 136 480 110S710 90 804 112" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="1.4"/>
  <path d="M0 132V120C200 100 420 134 794 110V132Z" fill="#fff"/></svg>`;
 const lg=logo?`<img class="rq-lg" src="${logo}" alt="" onerror="this.outerHTML='<div class=&quot;rq-lg rq-mn&quot;>إ</div>'">`:'<div class="rq-lg rq-mn">إ</div>';
 const head=`<div class="rq-head">${art}<div class="rq-ht">${lg}<div class="rq-org"><h1>منظمة إيدوس الدولية للسوروبان</h1><p>International Delta Organization for Soroban</p></div><div class="rq-ttl"><b>تقرير أداء الطالب</b><span>${dt}</span></div></div></div>`;
 const foot=`<div class="rq-f"><div class="rp-sig"><i></i>توقيع المدرب</div><div class="rp-fi">تم إنشاء هذا التقرير آلياً من نظام منظمة إيدوس الدولية للسوروبان<br>${dt}</div><div class="rp-sig"><i></i>اعتماد الإدارة</div></div>`;
 const ringH=(ov,perf,has)=>{const C=2*Math.PI*52,p=Math.max(0,Math.min(100,ov||0));
  return`<div class="rq-sc"><div class="rq-rg"><svg viewBox="0 0 120 120"><defs><linearGradient id="rqr${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#38bdf8"/><stop offset="1" stop-color="#1d4ed8"/></linearGradient></defs><circle cx="60" cy="60" r="52" fill="none" stroke="#e2eaf8" stroke-width="11"/>${has?`<circle cx="60" cy="60" r="52" fill="none" stroke="url(#rqr${g})" stroke-width="11" stroke-linecap="round" transform="rotate(-90 60 60)" stroke-dasharray="${C.toFixed(2)}" stroke-dashoffset="${(C*(1-p/100)).toFixed(2)}"/>`:''}</svg><div class="rq-rn"><b>${has?ov:'—'}</b><small>من 100</small></div></div><span class="stp ${statusCls(perf)}">${perf==='—'?'لا يوجد تقييم':perf}</span></div>`};
 const hero=(ring)=>`<div class="rq-hero"><div class="rq-av">${PH[s.id]?`<img src="${PH[s.id]}" alt="">`:`<span>${esc(ini(s.name))}</span>`}</div><div class="rq-hi"><h2>${esc(s.name)}</h2><div class="rq-ch"><span>${esc(acName(s.academy))}</span><span>${lvN(s.level)}</span><span>المدرب: ${esc(trNameOf(s))}</span></div><div class="rq-pd">فترة التقرير: <b>${pt}</b></div></div>${ring}</div>`;
 if(!st.recorded&&!st.evs.length)return`<section class="rp rq">${head}<div class="rq-body">${hero(ringH(0,'—',false))}<div class="rq-empty">لا توجد بيانات حضور أو تقييم لهذا الطالب في الفترة المحددة</div></div>${foot}</section>`;
 const cmp=acadCmp(s,mode,month),C=cfgs(st,cmp,true),ov=OV(st),v=verdict(st.rate,st.aTot,st.aAtt),ins=insights(st,cmp),last=st.evs.slice(-3).reverse();
 const rImg=chartImg(C.radar,400,230,18),lImg=chartImg(C.line,700,250,17),dImg=chartImg(C.dn,360,230,18);
 const bars=[['الحضور',st.rate,cmp?cmp[0]:null,'#0f2a5c'],...SKB.map((k,i)=>[k[1],st[k[2]],cmp?cmp[i+1]:null,k[3]])].map(([n,val,c,col])=>`<div class="rq-sb"><span>${n}</span><div class="tr"><i style="width:${val||0}%;background:${col}"></i>${c?`<u style="right:${Math.min(98,c)}%"></u>`:''}</div><b>${val==null?'—':Math.round(val)}</b></div>`).join('');
 const k=(c,a,b)=>`<div class="rq-k ${c}"><b>${a}</b><span>${b}</span></div>`;
 return`<section class="rp rq">${head}<div class="rq-body">${hero(ringH(ov,v.perf,true))}
 <div class="rq-kp">${k('k1',st.total,'الحصص المقررة')}${k('k2',st.present,'حضور')}${k('k3',st.absent,'غياب')}${k('k4',st.rate+'%','نسبة الحضور')}${k('k5',st.aTot??'—','متوسط التقييم')}${k('k6',trendOf(st),'الاتجاه')}</div>
 <div class="rq-r1"><div class="rq-cd"><h3>مستوى المهارات</h3><div class="rq-sk">${bars}<div class="rq-leg">الخط الأسود على كل شريط = متوسط الأكاديمية</div></div></div><div class="rq-cd"><h3>خريطة المهارات</h3><img src="${rImg}" alt=""></div></div>
 <div class="rq-r2"><div class="rq-cd"><h3>تطور المهارات عبر الحصص</h3><img src="${lImg}" alt=""></div><div class="rq-cd"><h3>الحضور والغياب</h3><img src="${dImg}" alt=""></div></div>
 <div class="rq-in"><div class="g"><b>نقاط القوة</b>${ins.g.length?ins.g.slice(0,2).map(x=>`<p>${x}</p>`).join(''):'<p>لا توجد بيانات كافية بعد</p>'}</div><div class="w"><b>نقاط تحتاج متابعة</b>${ins.w.length?ins.w.slice(0,2).map(x=>`<p>${x}</p>`).join(''):'<p>لا توجد نقاط ضعف ملحوظة</p>'}</div></div>
 ${ins.tip?`<div class="rq-pr"><b>إلى ولي الأمر الكريم:</b>${ins.tip}.</div>`:`<div class="rq-vd"><b>الخلاصة:</b> ${v.n}</div>`}
 ${last.length?`<div class="rq-cd" style="padding:6px 10px"><table><thead><tr><th>آخر التقييمات</th><th>الواجب</th><th>الإملاء</th><th>الأيباكس</th><th>السرعة</th><th>الكلي</th></tr></thead><tbody>${last.map(e=>`<tr><td>${sd(e.d)}</td><td class="${heat(e.hw)}">${e.hw??'—'}</td><td class="${heat(e.dict)}">${e.dict??'—'}</td><td class="${heat(e.abc)}">${e.abc??'—'}</td><td class="${heat(e.spd)}">${e.spd??'—'}</td><td class="${heat(e.total)}"><b>${e.total??'—'}</b></td></tr>`).join('')}</tbody></table></div>`:''}
 </div>${foot}</section>`};

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
