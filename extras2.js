/* =====================================================================
   extras2.js — بيتحمّل بعد extras.js
   1) ملف الطالب: طباعة/PDF بصفحات A4 مقسّمة
   2) تقرير التحليل: كل التقييمات في صفحة واحدة
   3) كارت الـ ID بتصميم الشهادات + الظهر معكوس للطباعة على الوجهين
   ===================================================================== */
(function(){
const $=id=>document.getElementById(id);

/* ---------- CSS ---------- */
const st=document.createElement('style');st.textContent=`
/* هيكل صفحة التقرير (الهيرو + الصفوف بارتفاعات ثابتة عشان كله يدخل في صفحة) */
.ra-b{flex:1;min-height:0;display:grid;gap:8px;padding:0 30px 8px;margin-top:-34px;position:relative;z-index:2;grid-template-rows:112px 56px 190px 150px 32px 1fr}
.ra-b.ra-e{grid-template-rows:112px 1fr}
.ra-b.pf1{grid-template-rows:112px 88px 56px 34px 180px 150px 1fr}
.ra-hero{display:flex;align-items:center;gap:14px;background:#fff;border-radius:18px;padding:8px 16px;box-shadow:0 14px 30px -12px rgba(11,27,63,.35);border:1px solid #e2e8f4;border-top:4px solid #2563eb;overflow:hidden}
.ra-hero .rq-hi h2{font-size:19px;margin:0 0 4px}.ra-hero .rq-pd{margin-top:3px}
.ra-sc{margin-right:auto;display:flex;flex-direction:column;align-items:center;gap:3px}
.ra-rg{position:relative;width:70px;height:70px}.ra-rg svg{width:100%;height:100%}.ra-rg .rq-rn b{font-size:21px}.ra-rg .rq-rn small{font-size:8px}
.ra-sc .stp{font-size:10.5px;padding:1px 12px}
.ra-b .rq-kp{gap:6px}.ra-b .rq-k{height:56px;padding:5px 4px}.ra-b .rq-k b{font-size:17px;margin-top:2px}.ra-b .rq-k span{font-size:9px}
.ra-b .rq-cd{display:flex;flex-direction:column;min-height:0;padding:7px 10px;overflow:hidden}
.ra-b .rq-cd h3{margin:0 0 5px;font-size:11.5px}.ra-b .rq-cd h3 small{font-weight:500;color:#64748b;font-size:9px}
.ra-c{display:grid;grid-template-columns:1fr 1.5fr .9fr;gap:8px;min-height:0}
.ra-d{display:grid;grid-template-columns:1.25fr 1fr;gap:8px;min-height:0}
.ra-im{flex:1;min-height:0;display:flex;align-items:center;justify-content:center}
.ra-b .ra-im img{width:auto;height:auto;max-width:100%;max-height:100%;object-fit:contain}
.ra-b .rq-sk{height:auto;flex:1;min-height:0}
.ra-ins{display:flex;flex-direction:column;gap:6px;min-height:0}
.ra-ins>div{flex:1;min-height:0;overflow:hidden;border-radius:12px;padding:4px 10px;font-size:9.5px;line-height:1.5}
.ra-ins b{display:block;font-size:10.5px}.ra-ins p{margin:0}
.ra-ins .g{background:linear-gradient(135deg,#ecfdf5,#fff);border:1px solid #bfe9d2;border-right:5px solid #10b981}.ra-ins .g b{color:#047857}
.ra-ins .w{background:linear-gradient(135deg,#eff6ff,#fff);border:1px solid #bfd5f7;border-right:5px solid #2563eb}.ra-ins .w b{color:#1d4ed8}
.ra-b .rq-pr,.ra-b .rq-vd{padding:4px 14px;font-size:10px;line-height:1.55;overflow:hidden}
.ra-avs{margin-right:auto;font-weight:600;font-size:9.5px;color:#1e3a8a}
.ra-evg{display:grid;gap:8px;align-items:start;flex:1;min-height:0;overflow:hidden}
.rp .ra-ev{width:100%;border-collapse:collapse;table-layout:fixed}
.rp .ra-ev th,.rp .ra-ev td{height:var(--rh);padding:0 2px;line-height:1;font-size:var(--fs);text-align:center;border-bottom:1px solid #e2eaf8}
/* ملف الطالب */
.pf-info{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;grid-auto-rows:1fr}
.pf-info div{background:#f5f8fe;border:1px solid #dbe4f5;border-right:4px solid #2563eb;border-radius:10px;padding:2px 9px;display:flex;flex-direction:column;justify-content:center;overflow:hidden}
.pf-info span{font-size:9px;color:#64748b;font-weight:700}.pf-info b{font-size:11.5px;color:#0b1b3f;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pf-ch{display:flex;flex-wrap:wrap;gap:5px;align-content:flex-start;overflow:hidden;flex:1;min-height:0}
.pf-ch span{border-radius:999px;padding:1px 9px;font-size:10px;font-weight:700}.pf-ch .y{background:#dcfce7;color:#047857}.pf-ch .n{background:#ffe4e6;color:#be123c}
.pf-b{flex:1;min-height:0;display:flex;flex-direction:column;gap:9px;padding:8px 30px 0;overflow:hidden}
.pf-mini{flex:none;display:flex;justify-content:space-between;align-items:center;background:#f3f7fe;border:1px solid #dbe4f5;border-right:5px solid #2563eb;border-radius:12px;padding:6px 14px;font-size:11px}
.pf-mini b{font-size:13px;color:#0b1b3f}.pf-mini span{color:#475569}
.pf-t{padding:8px 12px 10px!important;flex:none}
.rp .pf-t table{width:100%;border-collapse:collapse}
.rp .pf-t th,.rp .pf-t td{height:26px;padding:0 6px;line-height:1.2;font-size:10.5px;text-align:center}
.pf-em{color:#64748b}.pf-avg td{background:#eff6ff;font-weight:800;border-top:2px solid #2563eb}
/* ===== كارت الـ ID بتصميم الشهادات ===== */
.idc.n3{background:#fff;color:#0a2c80;font-family:'Cairo','Montserrat',sans-serif}.idc.n3::after{display:none}
.idc-gap{width:85.6mm;height:54mm}
.n3 .n3-bg{position:absolute;left:0;top:0;width:100%;height:100%}
.n3 .n3-lg{position:absolute;left:3.6mm;top:2.2mm;width:12mm;height:12mm;border-radius:50%;object-fit:contain;background:#fff;padding:.9mm;box-shadow:0 0 0 .4mm #ffd84a,0 .5mm 1.2mm rgba(0,0,0,.35)}
.n3 .n3-lgb{position:absolute;left:50%;margin-left:-8mm;top:3mm;width:16mm;height:16mm;border-radius:50%;object-fit:contain;background:#fff;padding:1.2mm;box-shadow:0 0 0 .5mm #ffd84a,0 .6mm 1.5mm rgba(0,0,0,.3)}
.n3 .n3-mono{display:grid;place-items:center;background:linear-gradient(135deg,#ffe36e,#e0a30a);color:#041440;font-weight:800;font-size:5mm;padding:0}
.n3 .n3-ar{position:absolute;left:17.8mm;top:3.2mm;font-weight:800;font-size:3.2mm;line-height:1.3;color:#ffd84a;white-space:nowrap;unicode-bidi:plaintext}
.n3 .n3-en{position:absolute;left:17.8mm;top:8.2mm;font:600 1.45mm 'Montserrat',sans-serif;letter-spacing:.2mm;color:#fff;white-space:nowrap}
.n3 .n3-chip{position:absolute;right:4mm;top:3.4mm;font:800 1.6mm 'Montserrat',sans-serif;letter-spacing:.3mm;color:#0a2c80;background:linear-gradient(90deg,#ffe36e,#e0a30a);border-radius:2mm;padding:.5mm 2mm}
.n3 .n3-ph{position:absolute;left:4.4mm;top:19.5mm;width:19mm;height:24.6mm;border-radius:2mm;padding:.6mm;background:linear-gradient(135deg,#fff1a8,#e0a30a 55%,#8a6500);box-shadow:0 .6mm 1.6mm rgba(0,0,0,.35)}
.n3 .n3-ph img,.n3 .n3-ph span{display:block;width:100%;height:100%;border-radius:1.5mm;border:.3mm solid #fff;object-fit:cover;object-position:50% 20%;background:#fff}
.n3 .n3-ph span{display:grid;place-items:center;background:#0a2c80;color:#ffd84a;font-size:9mm;font-weight:800}
.n3 .n3-nm{position:absolute;left:27.5mm;right:4.2mm;top:19.4mm}
.n3 .n3-nm b{display:block;font-family:'Montserrat',sans-serif;font-weight:800;line-height:1.12;color:#0a2c80;max-height:9.2mm;overflow:hidden}
.n3 .n3-nm span{display:block;margin-top:.5mm;direction:rtl;text-align:left;font-weight:700;font-size:2.7mm;color:#a56f25;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.n3 .n3-r{position:absolute;left:27.5mm;right:20mm}
.n3 .n3-r small{display:block;font:700 1.3mm 'Montserrat',sans-serif;letter-spacing:.3mm;color:#a56f25;line-height:1.3}
.n3 .n3-r b{display:block;font:600 2.35mm 'Montserrat',sans-serif;color:#0b1b3f;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:1.3}
.n3 .n3-lv{position:absolute;right:4mm;top:30.4mm;width:14.5mm;height:14.5mm;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#041440}
.n3 .n3-lv svg{position:absolute;left:0;top:0;width:100%;height:100%}
.n3 .n3-lv small{position:relative;font:800 1.3mm 'Montserrat',sans-serif;letter-spacing:.25mm;line-height:1}.n3 .n3-lv b{position:relative;font:800 6mm 'Montserrat',sans-serif;line-height:1.05}
.n3 .n3-bar{position:absolute;left:0;right:0;bottom:1.1mm;display:flex;align-items:center;justify-content:space-between;padding:0 4.4mm}
.n3 .n3-bar span{font:800 1.5mm 'Montserrat',sans-serif;letter-spacing:.4mm;color:#fff}.n3 .n3-bc{width:17mm;height:2.6mm}
.n3 .n3-bt{position:absolute;left:0;right:0;top:20.4mm;text-align:center;line-height:1.35}
.n3 .n3-bt b{display:block;direction:rtl;font-weight:800;font-size:3.7mm;color:#0a2c80}.n3 .n3-bt small{display:block;font:600 1.5mm 'Montserrat',sans-serif;letter-spacing:.25mm;color:#a56f25}
.n3 .n3-bn{position:absolute;left:5mm;top:29.4mm;width:56mm;font:500 1.5mm/1.7 'Montserrat',sans-serif;color:#334155}.n3 .n3-bn .ar{direction:rtl;text-align:left;font-family:'Cairo',sans-serif;font-size:1.9mm;color:#0a2c80}
.n3 .n3-ct{position:absolute;left:5mm;top:38.6mm;width:56mm;display:flex;flex-direction:column;gap:.8mm}
.n3 .n3-ct span{font:700 2.1mm/1.3 'Montserrat',sans-serif;color:#0a2c80;display:flex;align-items:center;gap:1.4mm}
.n3 .n3-ct i{font-style:normal;font-size:1.2mm;font-weight:800;background:#0a2c80;color:#ffd84a;border-radius:.8mm;padding:.2mm 1mm;letter-spacing:.2mm}
.n3 .n3-qr{position:absolute;right:5mm;top:27.2mm;width:16.5mm;height:16.5mm;background:#fff;padding:.6mm;border:.2mm solid #cbd5e8}
`;document.head.appendChild(st);

/* ---------- هيدر وفوتر مشتركين (A4) ---------- */
let _x2=0;
function x2Head(ttl,safe){
 const g=++_x2,logo=safe?(LOGO_SAFE||''):(document.querySelector('.brand img').getAttribute('src')||''),
 dt=new Date().toLocaleDateString('ar-EG',{day:'numeric',month:'long',year:'numeric'});
 const art=`<svg class="rq-hbg" viewBox="0 0 794 132"><defs><linearGradient id="xa${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#041440"/><stop offset=".55" stop-color="#0a2c80"/><stop offset="1" stop-color="#1d4ed8"/></linearGradient><linearGradient id="xb${g}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#b8860b"/><stop offset=".5" stop-color="#ffe36e"/><stop offset="1" stop-color="#d9a400"/></linearGradient></defs>
  <rect width="794" height="132" fill="url(#xa${g})"/><circle cx="730" cy="6" r="124" fill="#fff" opacity=".06"/><circle cx="40" cy="150" r="112" fill="#38bdf8" opacity=".14"/>
  <path d="M-10 112C150 78 300 132 470 102S700 80 804 104" fill="none" stroke="url(#xb${g})" stroke-width="3.2"/>
  <path d="M0 132V120C200 100 420 134 794 110V132Z" fill="#fff"/></svg>`;
 const lg=logo?`<img class="rq-lg" src="${logo}" alt="" onerror="this.outerHTML='<div class=&quot;rq-lg rq-mn&quot;>إ</div>'">`:'<div class="rq-lg rq-mn">إ</div>';
 return`<div class="rq-head">${art}<div class="rq-ht">${lg}<div class="rq-org"><h1>منظمة إيدوس الدولية للسوروبان</h1><p>International Delta Organization for Soroban</p></div><div class="rq-ttl"><b>${ttl}</b><span>${dt}</span></div></div></div>`}
function x2Foot(mid){const dt=new Date().toLocaleDateString('ar-EG',{day:'numeric',month:'long',year:'numeric'});
 return`<div class="rq-f"><div class="rp-sig"><i></i>توقيع المدرب</div><div class="rp-fi">${mid||'تم إنشاء هذا التقرير آلياً من نظام منظمة إيدوس الدولية للسوروبان'}<br>${dt}</div><div class="rp-sig"><i></i>اعتماد الإدارة</div></div>`}
function x2Ring(ov,perf,has){const C=2*Math.PI*52,p=Math.max(0,Math.min(100,ov||0)),g=++_x2;
 return`<div class="ra-sc"><div class="ra-rg"><svg viewBox="0 0 120 120"><defs><linearGradient id="xr${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#38bdf8"/><stop offset="1" stop-color="#1d4ed8"/></linearGradient></defs><circle cx="60" cy="60" r="52" fill="none" stroke="#e2eaf8" stroke-width="11"/>${has?`<circle cx="60" cy="60" r="52" fill="none" stroke="url(#xr${g})" stroke-width="11" stroke-linecap="round" transform="rotate(-90 60 60)" stroke-dasharray="${C.toFixed(2)}" stroke-dashoffset="${(C*(1-p/100)).toFixed(2)}"/>`:''}</svg><div class="rq-rn"><b>${has?ov:'—'}</b><small>من 100</small></div></div><span class="stp ${statusCls(perf)}">${perf==='—'?'لا يوجد تقييم':perf}</span></div>`}
function x2Hero(s,pt,ring,chips){const ph=PF[s.id]||PH[s.id];
 return`<div class="ra-hero"><div class="rq-av" style="width:70px;height:70px;padding:3px">${ph?`<img src="${ph}" alt="">`:`<span>${esc(ini(s.name))}</span>`}</div><div class="rq-hi"><h2>${esc(s.name)}</h2><div class="rq-ch"><span>${esc(acName(s.academy))}</span><span>${lvN(s.level)}</span><span>المدرب: ${esc(trNameOf(s))}</span>${chips||''}</div><div class="rq-pd">فترة التقرير: <b>${pt}</b></div></div>${ring}</div>`}
const x2Bars=(s2,cmp)=>[['الحضور',s2.rate,cmp?cmp[0]:null,'#0f2a5c'],...SKB.map((k,i)=>[k[1],s2[k[2]],cmp?cmp[i+1]:null,k[3]])].map(([n,val,c,col])=>`<div class="rq-sb"><span>${n}</span><div class="tr"><i style="width:${val||0}%;background:${col}"></i>${c?`<u style="right:${Math.min(98,c)}%"></u>`:''}</div><b>${val==null?'—':Math.round(val)}</b></div>`).join('');
const x2Ins=ins=>`<div class="ra-ins"><div class="g"><b>نقاط القوة</b>${ins.g.length?ins.g.slice(0,2).map(x=>`<p>${x}</p>`).join(''):'<p>لا توجد بيانات كافية بعد</p>'}</div><div class="w"><b>نقاط تحتاج متابعة</b>${ins.w.length?ins.w.slice(0,2).map(x=>`<p>${x}</p>`).join(''):'<p>لا توجد نقاط ضعف ملحوظة</p>'}</div></div>`;
const x2Kp=(s2)=>{const k=(c,a,b)=>`<div class="rq-k ${c}"><b>${a}</b><span>${b}</span></div>`;return`<div class="rq-kp">${k('k1',s2.total,'الحصص المقررة')}${k('k2',s2.present,'حضور')}${k('k3',s2.absent,'غياب')}${k('k4',s2.rate+'%','نسبة الحضور')}${k('k5',s2.aTot??'—','متوسط التقييم')}${k('k6',trendOf(s2),'الاتجاه')}</div>`};

/* ---------- ٢) تقرير التحليل: كل التقييمات في صفحة واحدة ---------- */
function evTable(evs){ // بيوزّع التقييمات على أعمدة حسب العدد عشان كلها تظهر
 const n=evs.length,cols=n<=12?1:n<=30?2:n<=60?3:4,per=Math.ceil(n/cols);
 const rh=Math.max(11,Math.min(26,Math.floor(330/(per+1)))),fs=Math.max(7.5,Math.min(10.5,rh*.6));
 const th='<tr><th>التاريخ</th><th>الواجب</th><th>الإملاء</th><th>الأيباكس</th><th>السرعة</th><th>الكلي</th></tr>';
 const row=e=>`<tr><td>${sd(e.d)}</td><td class="${heat(e.hw)}">${e.hw??'—'}</td><td class="${heat(e.dict)}">${e.dict??'—'}</td><td class="${heat(e.abc)}">${e.abc??'—'}</td><td class="${heat(e.spd)}">${e.spd??'—'}</td><td class="${heat(e.total)}"><b>${e.total??'—'}</b></td></tr>`;
 let h='';for(let c=0;c<cols;c++)h+=`<table class="ra-ev" style="--rh:${rh}px;--fs:${fs}px"><thead>${th}</thead><tbody>${evs.slice(c*per,(c+1)*per).map(row).join('')}</tbody></table>`;
 return`<div class="ra-evg" style="grid-template-columns:repeat(${cols},1fr)">${h}</div>`}
reportHTML=function(s,mode,month,pt,safe){
 const s2=calcStats(s,mode,month),head=x2Head('تقرير أداء الطالب',safe),foot=x2Foot();
 if(!s2.recorded&&!s2.evs.length)return`<section class="rp rq">${head}<div class="ra-b ra-e">${x2Hero(s,pt,x2Ring(0,'—',false))}<div class="rq-empty">لا توجد بيانات حضور أو تقييم لهذا الطالب في الفترة المحددة</div></div>${foot}</section>`;
 const cmp=acadCmp(s,mode,month),C=cfgs(s2,cmp,true),ov=OV(s2),v=verdict(s2.rate,s2.aTot,s2.aAtt),ins=insights(s2,cmp),n=s2.evs.length;
 const cI=chartImg(C.radar,520,240,18),lI=chartImg(C.line,700,230,17),dI=chartImg(C.dn,300,240,18);
 const av=f=>{const a=avg(s2.evs.map(e=>e[f]).filter(q=>q!=null));return a==null?'—':a};
 return`<section class="rp rq">${head}<div class="ra-b">
 ${x2Hero(s,pt,x2Ring(ov,v.perf,true))}
 ${x2Kp(s2)}
 <div class="ra-c"><div class="rq-cd"><h3>مستوى المهارات <small>| الخط = متوسط الأكاديمية</small></h3><div class="rq-sk">${x2Bars(s2,cmp)}</div></div><div class="rq-cd"><h3>خريطة المهارات</h3><div class="ra-im"><img src="${cI}" alt=""></div></div><div class="rq-cd"><h3>الحضور والغياب</h3><div class="ra-im"><img src="${dI}" alt=""></div></div></div>
 <div class="ra-d"><div class="rq-cd"><h3>تطور المهارات عبر الحصص</h3><div class="ra-im"><img src="${lI}" alt=""></div></div>${x2Ins(ins)}</div>
 ${ins.tip?`<div class="rq-pr"><b>إلى ولي الأمر الكريم:</b>${ins.tip}.</div>`:`<div class="rq-vd"><b>الخلاصة:</b> ${v.n}</div>`}
 <div class="rq-cd"><h3>جميع التقييمات (${n}) <span class="ra-avs">المتوسط — واجب ${av('hw')} • إملاء ${av('dict')} • أيباكس ${av('abc')} • سرعة ${av('spd')} • كلي ${av('total')}</span></h3>${n?evTable(s2.evs):'<div class="empty" style="padding:14px">لا توجد تقييمات في هذه الفترة</div>'}</div>
 </div>${foot}</section>`};

/* ---------- ١) ملف الطالب: صفحات A4 مقسّمة ---------- */
const tr4=(...c)=>'<tr>'+c.map(x=>`<td>${x}</td>`).join('')+'</tr>';
function paginate(blocks){ // بيقسّم الجداول على الصفحات حسب المساحة المتاحة
 const H=830,ROW=27,OH=85,pages=[];let cur=[],used=0;
 const flush=()=>{if(cur.length)pages.push(cur.join(''));cur=[];used=0};
 blocks.forEach(b=>{let rows=b.rows.slice(),first=true;
  while(rows.length){
   let n=Math.floor((H-used-OH)/ROW);
   if(n<Math.min(4,rows.length)){if(used>0){flush();continue}n=Math.floor((H-OH)/ROW)}
   const part=rows.splice(0,n);
   cur.push(`<div class="rq-cd pf-t"><h3>${b.t}${first?'':' <small>(تابع)</small>'}</h3><table><thead><tr>${b.th}</tr></thead><tbody>${part.join('')}</tbody></table></div>`);
   used+=OH+part.length*ROW+9;first=false;if(rows.length)flush()}});
 flush();return pages}
function profilePages(s,mode,mo,pt,safe){
 const all=mode==='all',ym=today().slice(0,7),s2=calcStats(s,mode,mo),tr=trById(s.trainer),jd=s.join||'';
 const mths=jd?Math.max(0,Math.floor((new Date()-new Date(jd+'T00:00:00'))/2629800000)):0;
 const owed=r2(DB.dues.filter(d=>d.studentId===s.id).reduce((a,d)=>a+d.amount,0)),price=baseOf(s),mp=monthPay(s.id,ym),du=dueOf(s.id,ym);
 const subSt=billOf(s)==='session'?'اشتراك بالحصة':mp?'اشتراك الشهر مدفوع':du?'اشتراك الشهر مؤجل':'اشتراك الشهر غير مسجل';
 const pays=DB.payments.filter(p=>p.studentId===s.id&&(all||p.date.slice(0,7)===mo)).sort((a,b)=>b.date.localeCompare(a.date)),paid=r2(pays.reduce((a,p)=>a+p.amount,0));
 const books=DB.sales.filter(x=>x.studentId===s.id&&(all||x.date.slice(0,7)===mo)).sort((a,b)=>b.date.localeCompare(a.date)),bt=r2(books.reduce((a,x)=>a+x.sell*x.qty,0));
 const cmp=acadCmp(s,mode,mo),ov=OV(s2),v=verdict(s2.rate,s2.aTot,s2.aAtt),ins=insights(s2,cmp),has=!!(s2.recorded||s2.evs.length);
 let cI='',lI='',dI='';if(has){const C=cfgs(s2,cmp,true);cI=chartImg(C.radar,520,240,18);lI=chartImg(C.line,700,230,17);dI=chartImg(C.dn,300,240,18)}
 const img=(u)=>u?`<div class="ra-im"><img src="${u}" alt=""></div>`:'<div class="empty" style="padding:10px">لا توجد بيانات</div>';
 const I=(l,v2)=>`<div><span>${l}</span><b>${v2}</b></div>`;
 const info=[I('بدأ معنا',jd?new Date(jd+'T00:00:00').toLocaleDateString('ar-EG',{day:'numeric',month:'long',year:'numeric'}):'—'),I('مدة الانضمام',mths+' شهر'),I('السن',ageOf(s.birth)||'—'),I('التليفون',esc(s.phone||'—')),
  I('المدرب',tr?esc(tr.name):'—'),I('الاشتراك',billOf(s)==='month'?'شهري '+money(price):'بالحصة '+(price?money(price):'')),I('ربح الأكاديمية',s.acct==='academy'?money(acadAmtOf(s)):'برايفت'),I('متأخرات مؤجلة',owed?money(owed):'لا يوجد')].join('');
 const ses=s2.ses.slice(-60);
 const p1=`<div class="ra-b pf1">${x2Hero(s,pt,x2Ring(ov,v.perf,has),`<span>${subSt}</span>`)}
  <div class="pf-info">${info}</div>${x2Kp(s2)}
  <div class="rq-vd"><b>الخلاصة:</b> الحضور ${s2.rate}% (${s2.present} من ${s2.total}) — ${v.cm} • الأداء: ${v.perf} • ${v.n} • المدفوع في الفترة: ${money(paid)}</div>
  <div class="ra-c"><div class="rq-cd"><h3>مستوى المهارات</h3><div class="rq-sk">${x2Bars(s2,cmp)}</div></div><div class="rq-cd"><h3>خريطة المهارات</h3>${img(cI)}</div><div class="rq-cd"><h3>الحضور والغياب</h3>${img(dI)}</div></div>
  <div class="ra-d"><div class="rq-cd"><h3>تطور المهارات عبر الحصص</h3>${img(lI)}</div>${x2Ins(ins)}</div>
  <div class="rq-cd"><h3>أيام الحصص — ${pt} <small>حضر ${s2.present} • غاب ${s2.absent}</small></h3>${ses.length?`<div class="pf-ch">${ses.map(x=>`<span class="${x.p?'y':'n'}">${sd(x.d)} ${x.p?'✔':'✖'}</span>`).join('')}</div>`:'<div class="empty" style="padding:8px">مفيش حصص مسجلة</div>'}</div></div>`;
 /* باقي الصفحات (جداول) */
 const T=(t,th,rows,em)=>({t,th:th.map(x=>`<th>${x}</th>`).join(''),rows:rows.length?rows:[`<tr><td colspan="${th.length}" class="pf-em">${em}</td></tr>`]});
 const av=f=>avg(s2.evs.map(e=>e[f]).filter(q=>q!=null))??'—';
 const gr=s2.evs.slice().reverse().map(e=>tr4(sd(e.d),e.hw??'—',e.dict??'—',e.abc??'—',e.spd??'—',`<b>${e.total??'—'}</b>`));
 if(gr.length)gr.push(`<tr class="pf-avg"><td>المتوسط</td><td>${av('hw')}</td><td>${av('dict')}</td><td>${av('abc')}</td><td>${av('spd')}</td><td>${av('total')}</td></tr>`);
 const ms=[];{let[y,m]=(jd||ym).slice(0,7).split('-').map(Number);const[cy,cm]=ym.split('-').map(Number);while((y<cy||(y===cy&&m<=cm))&&ms.length<36){ms.push(y+'-'+String(m).padStart(2,'0'));m++;if(m>12){m=1;y++}}}
 const hist=ms.reverse().map(m=>{const t=calcStats(s,'month',m),pd=r2(DB.payments.filter(p=>p.studentId===s.id&&p.date.slice(0,7)===m).reduce((a,p)=>a+p.amount,0));return tr4(`<b>${monthN(m)}</b>`,t.present+' / '+t.total,t.rate+'%',t.aTot??'—',money(pd))});
 const pr=pays.map(p=>tr4(esc(p.date),(p.kind||'month')==='session'?'حصة':'شهري',`<b>${money(p.amount)}</b>`,money(remOf(p)),money(p.acad||0)));if(pr.length)pr.push(`<tr class="pf-avg"><td colspan="2">الإجمالي</td><td>${money(paid)}</td><td>${money(r2(pays.reduce((a,p)=>a+remOf(p),0)))}</td><td>${money(r2(pays.reduce((a,p)=>a+(p.acad||0),0)))}</td></tr>`);
 const bk=books.map(x=>tr4(esc(x.date),`<b>${esc(x.itemName)}</b>`,x.qty,money(x.sell),`<b>${money(x.sell*x.qty)}</b>`));if(bk.length)bk.push(`<tr class="pf-avg"><td colspan="4">الإجمالي</td><td>${money(bt)}</td></tr>`);
 const lh=(s.lvHist&&s.lvHist.length?s.lvHist:[{d:jd,level:s.level}]).map(x=>tr4(lvN(x.level),x.d?dayName(x.d):'—'));
 const blocks=[T(`درجات التقييم — ${pt} (${s2.evs.length})`,['التاريخ','الواجب','الإملاء','الأيباكس','السرعة','الكلي'],gr,'مفيش تقييمات'),
  T('السجل الشهري',['الشهر','الحضور','النسبة','متوسط التقييم','المدفوع'],hist,'—'),
  T(`الدفعات — ${pt}`,['التاريخ','النوع','المبلغ','مستحق المدرب','ربح الأكاديمية'],pr,'مفيش دفعات في الفترة'),
  T(`مشتريات الكتب والمستلزمات — ${pt}`,['التاريخ','الصنف','الكمية','سعر القطعة','الإجمالي'],bk,'لم يشترِ كتب أو مستلزمات في الفترة دي'),
  T('تاريخ المستوى',['المستوى','التاريخ'],lh,'—')];
 const rest=paginate(blocks),N=1+rest.length;
 const mini=`<div class="pf-mini"><b>${esc(s.name)}</b><span>${esc(acName(s.academy))} • ${lvN(s.level)} • ${pt}</span></div>`;
 return[`<section class="rp rq">${x2Head('ملف الطالب',safe)}${p1}${x2Foot('صفحة 1 من '+N)}</section>`,
  ...rest.map((b,i)=>`<section class="rp rq">${x2Head('ملف الطالب',safe)}<div class="pf-b">${mini}${b}</div>${x2Foot('صفحة '+(i+2)+' من '+N)}</section>`)]}
async function pfBuild(){const id=$('pfSt').value;if(!id){toast('اختار طالب الأول','err');return null}
 const s=stuById(id),all=$('pfAll').checked,mo=$('pfMo').value||today().slice(0,7);
 await document.fonts.ready;Chart.defaults.font.family='IBM Plex Sans Arabic';LOGO_SAFE=await prepLogo();
 return profilePages(s,all?'all':'month',mo,all?'كل الأيام':monthN(mo),true)}
window.exportProfPDF=async function(){
 if(typeof html2canvas==='undefined'||!window.jspdf)return toast('المكتبات محتاجة اتصال بالنت','err');
 const pages=await pfBuild();if(!pages)return;const s=stuById($('pfSt').value);
 const{jsPDF}=window.jspdf,stg=$('pdfStage'),ov=$('pdfOv');pdfCancel=false;scrollTo(0,0);stg.style.display='block';ov.style.display='flex';let pdf=null,n=0;
 try{for(let i=0;i<pages.length&&!pdfCancel;i++){$('pdfN').textContent=s.name;$('pdfC').textContent=(i+1)+' / '+pages.length;
   stg.innerHTML=pages[i];await waitImgs(stg);await new Promise(r=>setTimeout(r,80));
   const cv=await html2canvas(stg,{scale:2,backgroundColor:'#fff',useCORS:true,scrollX:0,scrollY:0,width:794,height:1122,windowWidth:794});
   if(!pdf)pdf=new jsPDF({orientation:'p',unit:'mm',format:'a4'});else pdf.addPage();
   pdf.addImage(cv.toDataURL('image/jpeg',.95),'JPEG',0,0,210,297);n++;$('pdfB').style.width=(n/pages.length*100)+'%'}
  if(pdf&&!pdfCancel){pdf.save(('ملف - '+s.name+'.pdf').replace(/[\\/:*?"<>|]/g,''));toast('تم التصدير ✔')}}
 catch(e){console.error(e);toast('حصل خطأ في التصدير','err')}
 finally{stg.style.display='none';stg.innerHTML='';ov.style.display='none';$('pdfB').style.width='0'}};
window.printProfile=async function(){const pages=await pfBuild();if(!pages)return;toast('جاري تجهيز الملف...');
 const pa=$('printArea');pa.innerHTML=pages.join('');await waitImgs(pa);document.body.classList.add('pr-rep');
 const done=()=>{document.body.classList.remove('pr-rep');pa.innerHTML='';window.removeEventListener('afterprint',done)};
 window.addEventListener('afterprint',done);setTimeout(()=>window.print(),150)};
{const bs=document.querySelectorAll('#s-prof .acts button');if(bs[0])bs[0].setAttribute('onclick','exportProfPDF()');if(bs[1])bs[1].setAttribute('onclick','printProfile()')}

/* ---------- ٣) كارت الـ ID بتصميم الشهادات ---------- */
let _n3=0;
function lgImg(safe,cls){const src=safe?(LOGO_SAFE||''):((document.querySelector('.brand img')||{}).src||'');
 return src?`<img class="${cls}" src="${src}" alt="" onerror="this.style.display='none'">`:`<div class="${cls} n3-mono">I</div>`}
function n3Code(seed,col){let h=0;for(const c of String(seed))h=(h*31+c.charCodeAt(0))>>>0;let x=0,o='';
 for(let i=0;i<36;i++){h=(h*1103515245+12345)>>>0;const w=.35+((h>>>16)%3)*.28;o+=`<rect x="${x.toFixed(2)}" y="0" width="${w.toFixed(2)}" height="10" fill="${col}"/>`;x+=w+.32+((h>>>8)%2)*.2}
 return`<svg class="n3-bc" viewBox="0 0 ${x.toFixed(2)} 10" preserveAspectRatio="none">${o}</svg>`}
const n3Bg=g=>`<svg class="n3-bg" viewBox="0 0 85.6 54" preserveAspectRatio="none"><defs><linearGradient id="n3a${g}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#062a73"/><stop offset=".6" stop-color="#0a3f9e"/><stop offset="1" stop-color="#0d54c9"/></linearGradient><linearGradient id="n3g${g}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e0a30a"/><stop offset=".5" stop-color="#ffe36e"/><stop offset="1" stop-color="#e0a30a"/></linearGradient></defs>
 <rect width="85.6" height="54" fill="#fff"/><rect width="85.6" height="54" fill="#eef3fb" opacity=".7"/>
 <path d="M0 0H85.6V10C60 13.5 28 12 0 18.5Z" fill="url(#n3a${g})"/><path d="M0 18.5C28 12 60 13.5 85.6 10V11.6C60 15.2 28 13.7 0 20.2Z" fill="url(#n3g${g})"/>
 <path d="M0 54V49.6C26 52.2 58 47 85.6 50V54Z" fill="url(#n3a${g})"/><path d="M0 49.6C26 52.2 58 47 85.6 50V48.6C58 45.6 26 50.8 0 48.2Z" fill="url(#n3g${g})"/>
 <rect x=".5" y=".5" width="84.6" height="53" rx="2.6" fill="none" stroke="#c9d5ee" stroke-width=".18"/></svg>`;
cardF=function(s,o,safe){
 const e=o||idNames(s),ph=PF[s.id]||PH[s.id],g=++_n3,n=e.n||'',code=('IDOS-'+String(s.id).slice(-6)).toUpperCase(),
 fs=n.length<=16?4.2:n.length<=24?3.6:n.length<=32?3.1:2.8;
 const hx=`<svg viewBox="0 0 100 100"><defs><linearGradient id="n3h${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe36e"/><stop offset=".6" stop-color="#e0a30a"/><stop offset="1" stop-color="#b8860b"/></linearGradient></defs><polygon points="50,3 94,26 94,74 50,97 6,74 6,26" fill="url(#n3h${g})" stroke="#fff" stroke-width="3.5"/></svg>`;
 return`<div class="idc n3">${n3Bg(g)}${lgImg(safe,'n3-lg')}<div class="n3-ar">منظمة إيدوس الدولية للسوروبان</div><div class="n3-en">INTERNATIONAL DELTA ORGANIZATION FOR SOROBAN</div><div class="n3-chip">STUDENT ID</div>
 <div class="n3-ph">${ph?`<img src="${ph}" alt="">`:`<span>${esc((n||'?').charAt(0).toUpperCase())}</span>`}</div>
 <div class="n3-nm"><b style="font-size:${fs}mm">${esc(n)}</b><span>${esc(s.name)}</span></div>
 <div class="n3-r" style="top:31.6mm"><small>ACADEMY</small><b>${esc(e.a)}</b></div><div class="n3-r" style="top:36.2mm"><small>TRAINER</small><b>${esc(e.t)}</b></div><div class="n3-r" style="top:40.8mm"><small>ID NO.</small><b>${code}</b></div>
 <div class="n3-lv">${hx}<small>LEVEL</small><b>${s.level}</b></div>
 <div class="n3-bar"><span>STUDENT ID CARD</span>${n3Code(s.id,'#fff')}</div></div>`};
function n3Back(safe){const g=++_n3,L=window.IDOS_LINKS||{},q=window.idQR?idQR(L.web||''):'';
 return`<div class="idc n3 nb">${n3Bg(g)}${lgImg(safe,'n3-lgb')}<div class="n3-bt"><b>منظمة إيدوس الدولية للسوروبان</b><small>INTERNATIONAL DELTA ORGANIZATION FOR SOROBAN</small></div>
 <div class="n3-bn">This card is the property of IDOS. Please present it upon request.<div class="ar">هذه البطاقة خاصة بالطالب ويجب إبرازها عند الطلب</div></div>
 <div class="n3-ct"><span><i>WEB</i>${esc(L.webName||'')}</span><span><i>FB</i>${esc(L.fbName||'')}</span></div>${q?`<img class="n3-qr" src="${q}" alt="">`:''}
 <div class="n3-bar"><span>★ ★ ★</span>${n3Code('idos-back','#fff')}</div></div>`}
/* الصفحات: الظهر بيتعكس أعمدته (كل خليتين يتبدلوا) عشان الطباعة على الوجهين تظبط */
idPages=function(list,backs,safe){
 if(list.length===1)return[`<div class="idp one"><div><div class="idcap">FRONT</div>${cardF(list[0],null,safe)}</div><div><div class="idcap">BACK</div>${n3Back(safe)}</div></div>`];
 const P=[];
 for(let i=0;i<list.length;i+=10){const ch=list.slice(i,i+10);
  P.push(`<div class="idp">${ch.map(s=>cardF(s,null,safe)).join('')}</div>`);
  if(backs){const cells=[];
   for(let k=0;k<ch.length;k+=2){
    if(k+1<ch.length)cells.push(n3Back(safe),n3Back(safe)); // كارت يمين ↔ كارت شمال
    else cells.push('<div class="idc-gap"></div>',n3Back(safe))} // آخر كارت لوحده: ظهره في العمود التاني
   P.push(`<div class="idp">${cells.join('')}</div>`)}}
 return P};
idLive=function(){if(!idCur)return;$('idPrev').innerHTML=cardF(idCur,idVals())+n3Back(false)};
idLoadLogo=async function(){await Promise.all([['800 10px Cairo','محمد'],['700 10px Cairo','محمد'],['700 10px Montserrat','Ab'],['600 10px Montserrat','Ab']].map(([f,t])=>document.fonts.load(f,t).catch(()=>{})));await document.fonts.ready;LOGO_SAFE=await prepLogo()};
})();