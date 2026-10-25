/* =====================================================================
   certs.js — شهادات إيدوس (A4 طولي) بتصميم شهادتك
   تصميمين: «شهادة التقدير» و «Level Up»
   ===================================================================== */
(function(){
'use strict';
const $=id=>document.getElementById(id);
const W=794,H=1122,LS='idos_cert_v2',BL='#05408f';
/* true = بنرسم كلمة IDOS جنب الدرع | false = لو logo.png فيه الدرع والكلمة كاملين */
const LOCKUP=true;
/* روابط الـ QR — عدّل رابط الفيسبوك بتاعك هنا */
window.IDOS_LINKS=Object.assign({fb:'https://www.facebook.com/',fbName:'IDOS EGYPT Org',web:'https://www.idosabacus.com',webName:'www.idosabacus.com'},window.IDOS_LINKS||{});
window.idQR=t=>{try{if(!window.qrcode)return'';const q=qrcode(0,'M');q.addData(t);q.make();return q.createDataURL(6,0)}catch(e){return''}};

/* ---------- خطوط + مكتبة الـ QR ---------- */
(function(){
 const l=document.createElement('link');l.rel='stylesheet';
 l.href='https://fonts.googleapis.com/css2?family=Anton&family=Cairo:wght@600;700;800;900&family=Great+Vibes&family=Montserrat:wght@600;700;800&family=UnifrakturCook:wght@700&display=swap';
 document.head.appendChild(l);
 const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js';document.head.appendChild(s)})();
const loadFonts=()=>Promise.all([['800 30px Cairo','محمد'],['900 30px Cairo','محمد'],['700 30px Cairo','محمد'],['64px "Great Vibes"','Ab'],['700 30px UnifrakturCook','Ab'],['30px Anton','Ab'],['700 12px Montserrat','Ab']].map(([f,t])=>document.fonts.load(f,t).catch(()=>{}))).then(()=>document.fonts.ready);

/* ---------- الإعدادات (بتتحفظ في المتصفح) ---------- */
const DEFS={design:'award',president:'عصام الحنفاوي',place:'الأول',line:'في المسابقة التشجيعية فبراير ٢٠٢٦ تقديرًا لتميزه وأدائه المشرف',branch:'',lvl:'',showTrainer:true,sideL:'REPUBLIC CHAMPIONSHIP FOR MENTAL ARITHMETIC 2025',sideR:'INTERNATIONAL DELTA ORGANIZATION FOR SOROBAN',separate:false,per:{}};
let CT=Object.assign({},DEFS);try{Object.assign(CT,JSON.parse(localStorage.getItem(LS)||'{}'))}catch(e){}
if(!CT.per||typeof CT.per!=='object')CT.per={};
if(!['award','levelup'].includes(CT.design))CT.design='award';
const saveCT=()=>{try{localStorage.setItem(LS,JSON.stringify(CT))}catch(e){}};
const SEL=new Set();
const DESIGNS=[{k:'award',n:'شهادة التقدير',d:'مركز / مستوى / ترتيب + كأس وأباكس'},{k:'levelup',n:'Level Up',d:'اجتياز مستوى + QR'}];
const LW=['الصفر','الأول','الثاني','الثالث','الرابع','الخامس','السادس','السابع','الثامن','التاسع'];
const E=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const logoSrc=safe=>safe?((typeof LOGO_SAFE!=='undefined'&&LOGO_SAFE)||''):((document.querySelector('.brand img')||{}).src||'');
const awFs=n=>n.length<=14?58:n.length<=20?52:n.length<=26?44:n.length<=34?36:30;
const lvFs=n=>n.length<=14?46:n.length<=18?42:n.length<=24?34:28;
const sp=t=>Math.max(1,Math.min(4,400/Math.max(1,t.length)-5.9)).toFixed(1);

/* ---------- رسومات ---------- */
const gGrad=id=>`<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff1a8"/><stop offset=".35" stop-color="#ffd84a"/><stop offset=".7" stop-color="#d9a400"/><stop offset="1" stop-color="#9a6a10"/></linearGradient>`;
function sealSVG(g){let pet='';for(let i=0;i<24;i++){const a=Math.PI*2*i/24;pet+=`<circle cx="${(60+Math.cos(a)*53).toFixed(1)}" cy="${(60+Math.sin(a)*53).toFixed(1)}" r="7.5" fill="url(#sg${g})"/>`}
 return`<svg width="112" height="112" viewBox="0 0 120 120"><defs>${gGrad('sg'+g)}<path id="sp${g}" d="M60 60m-34 0a34 34 0 1 1 68 0a34 34 0 1 1 -68 0"/></defs>${pet}<circle cx="60" cy="60" r="52" fill="url(#sg${g})" stroke="#9a6a10" stroke-width="1"/><circle cx="60" cy="60" r="44" fill="#c98f06"/><text font-size="7.4" font-weight="700" fill="#fff6c9" font-family="Arial,Helvetica,sans-serif" letter-spacing=".4"><textPath href="#sp${g}" startOffset="0" textLength="205" lengthAdjust="spacing">INTERNATIONAL DELTA ORGANIZATION • FOR SOROBAN •</textPath></text><circle cx="60" cy="60" r="27" fill="#f6f6f6" stroke="#fff1a8" stroke-width="2"/></svg>`}
function awardArt(g){
 const coins=[[44,48,17],[92,22,12],[138,64,19],[20,104,14],[160,20,10],[176,108,13],[66,84,11]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="url(#tr${g})" stroke="#8a6500"/><circle cx="${x}" cy="${y}" r="${(r*.68).toFixed(1)}" fill="none" stroke="#fff1a8" stroke-width="1.2"/>`).join('');
 const trophy=`<g transform="translate(88 106) scale(.85)"><path d="M-52 8C-94 8-98 72-50 84" fill="none" stroke="url(#tr${g})" stroke-width="10" stroke-linecap="round"/><path d="M52 8C94 8 98 72 50 84" fill="none" stroke="url(#tr${g})" stroke-width="10" stroke-linecap="round"/><path d="M-54 0H54C54 58 34 104 0 122C-34 104-54 58-54 0Z" fill="url(#tr${g})" stroke="#8a6500" stroke-width="1.5"/><ellipse rx="54" ry="10" fill="url(#tr${g})" stroke="#8a6500" stroke-width="1.5"/><path d="M-36 16C-36 54-24 86-9 106" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="6" stroke-linecap="round"/><path d="M-10 118L-13 142H13L10 118Z" fill="url(#tr${g})"/><rect x="-34" y="142" width="68" height="12" rx="3" fill="url(#tr${g})" stroke="#8a6500"/><rect x="-48" y="154" width="96" height="15" rx="4" fill="url(#tr${g})" stroke="#8a6500"/></g>`;
 let rods='';for(let i=0;i<7;i++){const x=48+i*19;rods+=`<line x1="${x}" y1="46" x2="${x}" y2="186" stroke="#9a6a10" stroke-width="2"/><ellipse cx="${x}" cy="62" rx="8.5" ry="5.5" fill="url(#tr${g})" stroke="#8a6500" stroke-width=".8"/>`;for(let j=0;j<4;j++)rods+=`<ellipse cx="${x}" cy="${110+j*11+(i%3)*4}" rx="8.5" ry="5.5" fill="url(#tr${g})" stroke="#8a6500" stroke-width=".8"/>`}
 return`<svg class="bg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
 <path d="M0 0H794V10C560 18 270 30 0 46Z" fill="#fdc810"/>
 <path d="M0 44C262 36 540 8 794 -14V40C560 70 262 102 0 112Z" fill="#05408f"/>
 <path d="M0 112C262 102 560 70 794 40V47C560 77 262 109 0 119Z" fill="#fdc810"/>
 <path d="M690 0H734V222L712 202L690 222Z" fill="#05408f"/>
 <path d="M0 1122V1096C250 1126 540 1088 794 1066V1122Z" fill="#05408f"/>
 <path d="M300 1122C520 1100 690 1080 794 1042V1062C690 1096 520 1116 420 1122Z" fill="#fdc810"/></svg>
 <svg style="position:absolute;left:0;top:870px" width="210" height="252" viewBox="0 0 210 252"><defs>${gGrad('tr'+g)}</defs>${coins}${trophy}</svg>
 <svg style="position:absolute;left:584px;top:900px" width="210" height="222" viewBox="0 0 220 230"><g transform="rotate(-30 110 125)"><rect x="34" y="40" width="152" height="152" rx="7" fill="#fff6c8" fill-opacity=".35" stroke="url(#tr${g})" stroke-width="9"/><rect x="38" y="80" width="144" height="6" fill="url(#tr${g})"/>${rods}</g></svg>`}
function lvArt(){return`<svg class="bg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="#f3f3f3"/>
 <path d="M0 0H74C78 96 56 196 0 262Z" fill="#05408f"/><path d="M74 0C78 96 56 196 0 262" fill="none" stroke="#e0a30a" stroke-width="5"/>
 <path d="M794 0H720C716 96 738 196 794 262Z" fill="#05408f"/><path d="M720 0C716 96 738 196 794 262" fill="none" stroke="#e0a30a" stroke-width="5"/>
 <path d="M0 1122V1092C260 1074 540 1114 794 1086V1122Z" fill="#05408f"/><path d="M0 1092C260 1074 540 1114 794 1086V1080C540 1108 260 1068 0 1085Z" fill="#e0a30a"/></svg>`}
/* لوجو الدرع + كلمة IDOS (قاعدته 410×150 وبيتكبّر بـ scale) */
function lockup(safe,k,x,y){const src=logoSrc(safe),st=`left:${x}px;top:${y}px;transform:scale(${k});transform-origin:0 0`;
 if(!LOCKUP)return`<div class="ab lk" style="${st}">${src?`<img style="width:85%;height:85%;object-fit:contain" src="${src}" alt="">`:''}</div>`;
 return`<div class="ab lk" style="${st}"><div class="lk-shw">${src?`<img class="lk-sh" src="${src}" alt="">`:'<div class="lk-sh lk-mono">IDOS</div>'}</div><div class="lk-w"><div class="lk-id">IDOS<i>E<br>G<br>Y<br>P<br>T</i></div><div class="lk-ar">منظمة أيدوس الدولية للسوروبان</div><div class="lk-en">INTERNATIONAL DELTA ORGANIZATION FOR SOROBAN</div></div></div>`}

/* ---------- الشهادات ---------- */
let _g=0;
function award(s,o,safe,g,per){
 const tr=trById(s.trainer)||{},ac=DB.academies.find(x=>x.id===s.academy)||{},nm=s.name||'',src=logoSrc(safe);
 const place=(per.place!=null&&per.place!==''?per.place:o.place||'').trim(),rank=(per.rank||'').trim();
 const items=[];if(place)items.push('المركز : '+E(place));items.push('المستوى : '+E(LW[s.level]||s.level));if(rank)items.push('الترتيب : '+E(rank));
 const branch=(o.branch||ac.name||'').trim(),lines=[];
 if(o.line)lines.push(E(o.line));if(o.showTrainer&&tr.name)lines.push('مع المدرب المعتمد / '+E(tr.name));if(branch)lines.push('فرع / '+E(branch));
 return`<div class="ct d-award"><div class="ct-in">${awardArt(g)}
 ${src?`<img class="ab a-wmi" src="${src}" alt="">`:''}<div class="ab a-wmt">منظمة أيدوس الدولية للسوروبان</div>
 <div class="ab a-seal">${sealSVG(g)}${src?`<img src="${src}" alt="">`:''}</div>
 <div class="ab a-sc">Certificate</div>
 <div class="ab a-in">بكل فخر وامتنان<br>تمنح منظمة أيدوس الدولية للسوروبان<br>لتدريب الحساب الذهني وإقامة البطولات<br>شهادة تقدير للطالب</div>
 <div class="ab a-nm" style="font-size:${awFs(nm)}px">${E(nm)}</div>
 ${lockup(safe,1,192,486)}
 <div class="ab a-of">وذلك لحصوله على</div>
 <div class="ab a-it">${items.map(x=>`<span>${x}</span>`).join('')}</div>
 <div class="ab a-tx">${lines.map(x=>`<div>${x}</div>`).join('')}</div>
 <div class="ab a-sg" style="left:90px">رئيس منظمة أيدوس<br>${E(o.president)}</div><div class="ab a-ln" style="left:90px"></div>
 <img class="ab a-sig" src="signature.png" alt="" onerror="this.remove()">
 <div class="ab a-sg" style="left:470px;top:824px">توقيع المدرب</div><div class="ab a-ln" style="left:470px"></div>
 <div class="ab a-bt">مع تمنياتنا بدوام التوفيق</div>
 <div class="ab" style="left:0;top:212px;width:11px;height:412px;background:${BL}"></div><div class="ab" style="left:783px;top:407px;width:11px;height:412px;background:${BL}"></div>
 <div class="ab a-sd" style="left:18px;top:624px;transform:rotate(-90deg);letter-spacing:${sp(o.sideL||'')}px">${E(o.sideL)}</div>
 <div class="ab a-sd" style="left:778px;top:407px;transform:rotate(90deg);letter-spacing:${sp(o.sideR||'')}px">${E(o.sideR)}</div>
 </div></div>`}
function levelUp(s,o,safe,g,per){
 const src=logoSrc(safe),nm=s.name||'',lv=String((per.lvl!=null&&per.lvl!==''?per.lvl:o.lvl)||s.level).trim(),L=window.IDOS_LINKS,
 qf=window.idQR?idQR(L.fb):'',qw=window.idQR?idQR(L.web):'',qb=(u,x)=>`<div class="ab lv-qr" style="left:${x}px">${u?`<img src="${u}" alt="">`:''}</div>`;
 return`<div class="ct d-lvl"><div class="ct-in">${lvArt()}
 ${src?`<img class="ab lv-wm" src="${src}" alt="">`:''}<div class="ab lv-wt">منظمة أيدوس الدولية للسوروبان</div>
 <div class="ab lv-c">Certificate</div>
 <div class="ab lv-t"><span class="a">LEVEL</span><svg width="38" height="104" viewBox="0 0 38 104" style="position:static;flex:none"><path d="M19 0L38 34H25V104H13V34H0Z" fill="#e0a30a"/></svg><span class="b">UP</span></div>
 <div class="ab lv-s">INTERNATIONAL DELTA ORGANIZATION FOR SOROBAN</div>
 ${lockup(safe,1.5,90,300)}
 <div class="ab lv-l1">منظمة أيدوس الدولية للسوروبان</div>
 <div class="ab lv-box"><div class="h">مستوى</div><div class="n">${E(lv)}</div></div>
 <div class="ab lv-l2">تشهد باجتياز الطالب</div>
 <div class="ab lv-nm" style="font-size:${lvFs(nm)}px">${E(nm)}</div>
 <div class="ab lv-l4">متمنين له التوفيق الدائم والنجاح</div>
 <div class="ab lv-pr">رئيس المنظمة : ${E(o.president)}</div><div class="ab lv-prl"></div>
 ${qb(qf,168)}${qb(qw,529)}
 <div class="ab lv-lb" style="left:112px"><i class="ic">f</i>${E(L.fbName)}</div><div class="ab lv-lb" style="left:475px"><i class="ic">W</i>${E(L.webName)}</div>
 </div></div>`}
function certHTML(s,o,safe){const g=++_g,per=(o.per&&o.per[s.id])||{};return o.design==='levelup'?levelUp(s,o,safe,g,per):award(s,o,safe,g,per)}

/* ---------- CSS ---------- */
const css=`
.ct{position:relative;width:${W}px;height:${H}px;overflow:hidden;background:#fff;direction:rtl;text-align:center;color:${BL};font-family:'Cairo','Segoe UI',Tahoma,sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact;page-break-after:always;break-after:page}
.ct *{box-sizing:border-box;margin:0}.ct-in{position:absolute;left:0;top:0;right:0;bottom:0}
.ct .ab{position:absolute}.ct svg.bg{position:absolute;left:0;top:0}
.lk{width:410px;height:150px;direction:ltr;text-align:left}
.lk-shw{position:absolute;left:0;top:0;width:124px;height:100px}.lk-sh{width:85%;object-fit:contain;display:block}.lk-mono{display:grid;place-items:center;background:#e0a30a;color:#111;font:900 30px serif;border-radius:12px}
.lk-w{position:absolute;left:138px;top:0;width:272px;height:150px}
.lk-id{position:relative;font:800 104px/85px 'Times New Roman',Georgia,serif;color:${BL};letter-spacing:-1px;white-space:nowrap}
.lk-id i{position:absolute;left:146px;top:16px;width:14px;font:600 9px/11px 'Times New Roman',serif;font-style:normal;text-align:center;letter-spacing:0}
.lk-ar{margin-top:1px;font:700 21px/26px 'Cairo',sans-serif;color:${BL};white-space:nowrap;direction:rtl;text-align:left}
.lk-en{font:700 9px/14px 'Times New Roman',serif;color:${BL};white-space:nowrap}
/* ===== شهادة التقدير ===== */
.d-award .a-wmi{left:147px;top:330px;width:500px;opacity:.05}
.d-award .a-wmt{left:-10px;width:814px;top:690px;font:900 78px/90px Cairo;color:rgba(5,64,143,.05);white-space:nowrap}
.d-award .a-seal{left:658px;top:68px;width:112px;height:112px}.d-award .a-seal svg{position:absolute;left:0;top:0}.d-award .a-seal img{position:absolute;left:34px;top:34px;width:44px;height:44px;object-fit:contain}
.d-award .a-sc{left:140px;width:560px;top:58px;height:150px;font:400 112px/150px 'Great Vibes','Brush Script MT',cursive;color:${BL};white-space:nowrap;direction:ltr}
.d-award .a-in{left:47px;width:700px;top:238px;font:800 27px/41px Cairo}
.d-award .a-nm{left:27px;width:740px;top:404px;height:70px;line-height:70px;font-weight:900;color:#111;white-space:nowrap;overflow:hidden}
.d-award .a-of{left:47px;width:700px;top:606px;font:800 27px/42px Cairo}
.d-award .a-it{left:130px;width:634px;top:639px;display:flex;justify-content:space-between;direction:rtl;font:800 26px/42px Cairo}
.d-award .a-tx{left:47px;width:700px;top:682px;direction:rtl;text-align:right;font:700 24px/34px Cairo}
.d-award .a-sg{top:790px;width:250px;font:800 26px/32px Cairo}
.d-award .a-ln{top:858px;width:250px;height:3px;background:${BL}}
.d-award .a-sig{left:120px;top:866px;width:240px;height:110px;object-fit:contain}
.d-award .a-bt{left:47px;width:700px;top:1016px;font:800 27px/42px Cairo}
.d-award .a-sd{width:412px;height:14px;font:700 8.5px/14px Montserrat,sans-serif;color:${BL};white-space:nowrap;text-align:center;direction:ltr;transform-origin:0 0}
/* ===== Level Up ===== */
.d-lvl{background:#f3f3f3}
.d-lvl .lv-wm{left:147px;top:330px;width:500px;opacity:.05}
.d-lvl .lv-wt{left:-10px;width:814px;top:818px;font:900 84px/100px Cairo;color:rgba(5,64,143,.05);white-space:nowrap}
.d-lvl .lv-c{left:97px;width:600px;top:14px;font:700 64px/72px 'UnifrakturCook','Times New Roman',serif;letter-spacing:12px;direction:ltr}
.d-lvl .lv-t{left:150px;width:494px;top:84px;height:112px;display:flex;align-items:center;justify-content:center;gap:6px;direction:ltr;font:400 112px/112px 'Anton','Impact',sans-serif}
.d-lvl .lv-t .a{color:${BL}}.d-lvl .lv-t .b{color:#e0a30a}
.d-lvl .lv-s{left:150px;width:494px;top:198px;font:400 21px/26px 'Anton','Impact',sans-serif;direction:ltr;letter-spacing:-.2px;white-space:nowrap}
.d-lvl .lv-l1{left:90px;width:614px;top:598px;font:800 42px/56px Cairo;white-space:nowrap}
.d-lvl .lv-box{left:96px;top:659px;width:151px;height:110px;border:2px solid ${BL};background:#fff;overflow:hidden}
.d-lvl .lv-box .h{height:42px;background:${BL};color:#fff;font:800 32px/42px Cairo}
.d-lvl .lv-box .n{height:66px;font:400 60px/66px 'Times New Roman',serif;color:${BL}}
.d-lvl .lv-l2{left:255px;width:442px;top:652px;text-align:right;font:800 40px/56px Cairo}
.d-lvl .lv-nm{left:255px;width:442px;top:712px;height:56px;line-height:56px;text-align:right;font-weight:800;color:#dca00b;white-space:nowrap;overflow:hidden}
.d-lvl .lv-l4{left:90px;width:614px;top:776px;font:800 40px/56px Cairo;white-space:nowrap}
.d-lvl .lv-pr{left:150px;width:494px;top:896px;font:700 25px/32px Cairo}
.d-lvl .lv-prl{position:absolute;left:248px;top:934px;width:264px;height:3px;background:${BL}}
.d-lvl .lv-qr{top:970px;width:86px;height:88px;background:#fff;padding:3px}.d-lvl .lv-qr img{width:100%;height:100%;display:block}
.d-lvl .lv-lb{top:1066px;width:200px;display:flex;align-items:center;justify-content:center;gap:6px;font:700 17px/24px Montserrat,Cairo,sans-serif;color:${BL};direction:ltr}
.d-lvl .ic{display:inline-grid;place-items:center;width:20px;height:20px;border-radius:50%;background:${BL};color:#fff;font:700 12px/20px Arial,sans-serif;font-style:normal}
/* ===== الواجهة ===== */
#s-cert .ctlist{max-height:340px;overflow:auto;border:1px solid var(--line,#e7e2d3);border-radius:14px;background:#fff}
#s-cert .ctrow{display:flex;align-items:center;gap:10px;padding:8px 12px;border-bottom:1px solid #f0f1f8;cursor:pointer}#s-cert .ctrow:hover{background:#f6f7ff}
#s-cert .ctrow input[type=checkbox]{width:18px;height:18px;flex:none}#s-cert .ctrow .nmx{margin-right:auto;display:flex;flex-direction:column}#s-cert .ctrow small{color:#7a7566}
#s-cert .pp{display:flex;gap:6px}#s-cert .pp input{height:34px!important;padding:0 8px!important;font-size:13px!important;border-radius:9px!important}#s-cert .pp .pl{width:96px}#s-cert .pp .pk{width:72px}
#s-cert.lu .pp,#s-cert.lu .aw{display:none}#s-cert:not(.lu) .lu{display:none}
#s-cert .ctpv{max-width:520px;margin:0 auto;overflow:hidden;border-radius:14px;border:1px solid var(--line,#e7e2d3);background:#eceefb;position:relative}
#s-cert .ctpv .ct{position:absolute;left:0;top:0;transform-origin:0 0;box-shadow:0 10px 30px rgba(0,0,0,.25)}
#s-cert textarea{width:100%;min-height:70px;padding:10px 14px;border-radius:12px;border:1px solid var(--line,#e7e2d3);font:inherit}
#s-cert .chk{display:flex;align-items:center;gap:8px;font-weight:600}#s-cert .chk input{width:18px;height:18px}
#s-cert .dsg-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:12px;margin-bottom:18px}
#s-cert .dsg{all:unset;cursor:pointer;box-sizing:border-box;display:flex;flex-direction:column;gap:6px;padding:10px;border:2px solid #e2e8f4;border-radius:14px;background:#fff;transition:.2s}
#s-cert .dsg:hover{transform:translateY(-3px)}#s-cert .dsg.on{border-color:#2563eb;box-shadow:0 0 0 4px rgba(37,99,235,.15)}
#s-cert .dsg-pv{position:relative;width:100%;aspect-ratio:${W}/${H};overflow:hidden;border-radius:8px;background:#eee}
#s-cert .dsg-in{position:absolute;left:0;top:0;transform-origin:0 0}
#s-cert .dsg b{font-size:14px}#s-cert .dsg small{color:#64748b;font-size:12px}
#certStage{display:none;position:fixed;left:0;top:0;width:${W}px;height:${H}px;background:#fff;z-index:100;direction:ltr}#certStage .ct{page-break-after:auto}
@media print{body.pr-rep .ct{width:793px;height:1121px}body.pr-rep .ct:last-child{break-after:auto;page-break-after:auto}}
`;
const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);

const section=document.createElement('section');section.id='s-cert';section.className='sec';
section.innerHTML=`<h1 class="pt">شهادات التقدير</h1>
 <div class="card"><h2>١) اختار الطلاب <span class="bd" id="ctN">0 محدد</span></h2>
  <div class="grid"><div><label>الأكاديمية</label><select id="ctAc" onchange="CERT.list()"></select></div><div><label>المدرب</label><select id="ctTr" onchange="CERT.list()"></select></div><div><label>بحث</label><input id="ctQ" placeholder="🔍 اسم الطالب" oninput="CERT.list()"></div></div>
  <div class="acts"><button class="btn b-ink b-sm" onclick="CERT.all(true)">تحديد المعروضين</button><button class="btn b-out b-sm" onclick="CERT.all(false)">إلغاء التحديد</button></div>
  <div class="hint aw">في «شهادة التقدير» تقدر تكتب المركز والترتيب لكل طالب من الخانتين اللي جنب اسمه (لو فاضيين بياخد المركز الافتراضي).</div>
  <div class="ctlist" id="ctList"></div></div>
 <div class="card"><h2>٢) اختار التصميم والبيانات</h2>
  <div class="dsg-grid" id="ctDsg"></div>
  <div class="grid">
   <div><label>رئيس المنظمة</label><input id="ctPres" oninput="CERT.set()"></div>
   <div class="aw"><label>المركز الافتراضي</label><input id="ctPlace" oninput="CERT.set()"></div>
   <div class="aw"><label>الفرع (لو فاضي = اسم الأكاديمية)</label><input id="ctBranch" oninput="CERT.set()"></div>
   <div class="aw"><label>النص الجانبي الأيسر</label><input id="ctSL" dir="ltr" oninput="CERT.set()"></div>
   <div class="aw"><label>النص الجانبي الأيمن</label><input id="ctSR" dir="ltr" oninput="CERT.set()"></div>
   <div class="lu"><label>رقم المستوى (لو فاضي = ليفل الطالب)</label><input id="ctLvl" oninput="CERT.set()"></div></div>
  <div class="aw" style="margin-top:12px"><label>سطر التقدير</label><textarea id="ctLine" oninput="CERT.set()"></textarea></div>
  <div class="acts" style="gap:22px"><label class="chk aw"><input type="checkbox" id="ctTrn" onchange="CERT.set()">اسم المدرب على الشهادة</label><label class="chk"><input type="checkbox" id="ctSep" onchange="CERT.set()">ملف PDF منفصل لكل طالب</label></div></div>
 <div class="card"><h2>٣) معاينة وتصدير</h2><div class="ctpv" id="ctPv"></div>
  <div class="acts"><button class="btn b-gold" onclick="CERT.pdf()">📄 تصدير PDF للمحددين</button><button class="btn b-ink" onclick="CERT.print()">🖨 طباعة</button></div>
  <div class="hint">المعاينة لأول طالب محدد. توقيع الرئيس: حط صورة PNG شفافة باسم signature.png جنب index.html.</div></div>`;
(document.querySelector('main')||document.body).appendChild(section);
const stage=document.createElement('div');stage.id='certStage';document.body.appendChild(stage);
try{const ico='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="13" rx="2"/><circle cx="12" cy="10.5" r="2.6"/><path d="M9.5 17v4l2.5-1.6 2.5 1.6v-4"/></svg>';
 const i=TABS.findIndex(t=>t[0]==='log');TABS.splice(i<0?TABS.length:i,0,['cert',ico,'الشهادات']);RENDER.cert=()=>CERT.render();navAdmin=undefined;buildNav()}catch(e){console.error('certs.js: nav',e)}

/* ---------- المنطق ---------- */
const opts=()=>Object.assign({},CT);
const chosen=()=>DB.students.filter(s=>SEL.has(s.id)).sort((a,b)=>a.name.localeCompare(b.name,'ar'));
function visible(){const ac=$('ctAc').value,tr=$('ctTr').value,q=$('ctQ').value.trim();return DB.students.filter(s=>(!ac||s.academy===ac)&&(!tr||s.trainer===tr)&&(!q||s.name.includes(q))).sort((a,b)=>a.name.localeCompare(b.name,'ar'))}
function fillSel(){const a=$('ctAc'),t=$('ctTr'),va=a.value,vt=t.value;
 a.innerHTML='<option value="">كل الأكاديميات</option>'+DB.academies.map(x=>`<option value="${x.id}">${E(x.name)}</option>`).join('');
 t.innerHTML='<option value="">كل المدربين</option>'+DB.trainers.map(x=>`<option value="${x.id}">${E(x.name)}</option>`).join('');a.value=va;t.value=vt}
function list(){const l=visible();$('ctList').innerHTML=l.length?l.map(s=>{const p=CT.per[s.id]||{};return`<div class="ctrow" onclick="if(event.target.tagName!=='INPUT')this.querySelector('input').click()"><input type="checkbox" ${SEL.has(s.id)?'checked':''} onchange="CERT.pick('${s.id}',this.checked)"><div class="nmx"><b>${E(s.name)}</b><small>${E(acName(s.academy))} • ${E((trById(s.trainer)||{}).name||'—')} • ${lvN(s.level)}</small></div><span class="pp"><input class="pl" placeholder="المركز" value="${E(p.place||'')}" onclick="event.stopPropagation()" onchange="CERT.per('${s.id}','place',this.value)"><input class="pk" placeholder="الترتيب" value="${E(p.rank||'')}" onclick="event.stopPropagation()" onchange="CERT.per('${s.id}','rank',this.value)"></span></div>`}).join(''):'<div class="empty" style="padding:18px;text-align:center">مفيش طلاب</div>';cnt()}
const cnt=()=>{$('ctN').textContent=SEL.size+' محدد'};
function pick(id,on){on?SEL.add(id):SEL.delete(id);cnt();preview()}
function all(on){visible().forEach(s=>on?SEL.add(s.id):SEL.delete(s.id));if(!on)SEL.clear();list();preview()}
function perSet(id,k,v){CT.per[id]=Object.assign(CT.per[id]||{},{[k]:v.trim()});saveCT();preview()}
function setFromUI(){CT.president=$('ctPres').value;CT.place=$('ctPlace').value;CT.branch=$('ctBranch').value;CT.sideL=$('ctSL').value;CT.sideR=$('ctSR').value;CT.lvl=$('ctLvl').value;CT.line=$('ctLine').value;CT.showTrainer=$('ctTrn').checked;CT.separate=$('ctSep').checked;saveCT();preview()}
function toUI(){$('ctPres').value=CT.president;$('ctPlace').value=CT.place;$('ctBranch').value=CT.branch;$('ctSL').value=CT.sideL;$('ctSR').value=CT.sideR;$('ctLvl').value=CT.lvl;$('ctLine').value=CT.line;$('ctTrn').checked=!!CT.showTrainer;$('ctSep').checked=!!CT.separate;section.classList.toggle('lu',CT.design==='levelup')}
function setDesign(k){CT.design=k;saveCT();toUI();thumbs();preview()}
const sample=()=>chosen()[0]||DB.students[0]||{id:'sample',name:'محمد وليد محمد',level:1};
function thumbs(){const box=$('ctDsg');if(!box)return;const s=sample();
 box.innerHTML=DESIGNS.map(d=>`<button class="dsg ${CT.design===d.k?'on':''}" onclick="CERT.design('${d.k}')"><div class="dsg-pv"><div class="dsg-in">${certHTML(s,Object.assign(opts(),{design:d.k}),false)}</div></div><b>${d.n}</b><small>${d.d}</small></button>`).join('');
 requestAnimationFrame(()=>box.querySelectorAll('.dsg-pv').forEach(pv=>{pv.querySelector('.dsg-in').style.transform=`scale(${(pv.clientWidth||190)/W})`}))}
function preview(){const pv=$('ctPv');if(!pv)return;const s=chosen()[0]||DB.students[0];const sc=Math.min(1,(pv.clientWidth||520)/W);pv.style.height=(H*sc)+'px';
 if(!s){pv.innerHTML='<div class="empty" style="padding:30px;text-align:center">مفيش طلاب لعرضهم</div>';return}
 pv.innerHTML=certHTML(s,opts(),false);pv.querySelector('.ct').style.transform=`scale(${sc})`}
async function ensure(){await loadFonts();LOGO_SAFE=await prepLogo()}
const pages=l=>l.map(s=>certHTML(s,opts(),true));
async function print(){const l=chosen();if(!l.length)return toast('اختار طالب واحد على الأقل','err');
 if(l.length>40&&!confirm(`هيتطبع ${l.length} شهادة. تكمل؟`))return;toast('جاري تجهيز الشهادات...');
 await ensure();const pa=$('printArea');pa.innerHTML=pages(l).join('');await waitImgs(pa);
 document.body.classList.add('pr-rep');const done=()=>{document.body.classList.remove('pr-rep');pa.innerHTML='';window.removeEventListener('afterprint',done)};
 window.addEventListener('afterprint',done);setTimeout(()=>window.print(),200)}
async function pdf(){const l=chosen();if(!l.length)return toast('اختار طالب واحد على الأقل','err');
 if(typeof html2canvas==='undefined'||!window.jspdf)return toast('المكتبات محتاجة اتصال بالنت','err');
 const sep=CT.separate&&l.length>1;if(sep&&!confirm(`هيتنزّل ${l.length} ملف PDF. تكمل؟`))return;
 const{jsPDF}=window.jspdf,ov=$('pdfOv');pdfCancel=false;scrollTo(0,0);stage.style.display='block';ov.style.display='flex';let doc=null,done=0;
 const mk=()=>new jsPDF({orientation:'p',unit:'mm',format:'a4'}),fn=s=>(s.name||'').replace(/[\\/:*?"<>|]/g,'');
 try{await ensure();const P=pages(l);
  for(let i=0;i<P.length&&!pdfCancel;i++){$('pdfN').textContent=l[i].name;$('pdfC').textContent=(i+1)+' / '+P.length;
   stage.innerHTML=P[i];await waitImgs(stage);await new Promise(r=>setTimeout(r,250));
   const cv=await html2canvas(stage,{scale:2,backgroundColor:'#fff',scrollX:0,scrollY:0,width:W,height:H,windowWidth:W,windowHeight:H});
   const img=cv.toDataURL('image/jpeg',.95);
   if(sep){const d=mk();d.addImage(img,'JPEG',0,0,210,297);d.save('شهادة - '+fn(l[i])+'.pdf');await new Promise(r=>setTimeout(r,450))}
   else{if(!doc)doc=mk();else doc.addPage();doc.addImage(img,'JPEG',0,0,210,297)}
   done++;$('pdfB').style.width=(done/P.length*100)+'%'}
  if(doc&&!pdfCancel)doc.save(l.length===1?'شهادة - '+fn(l[0])+'.pdf':'شهادات - '+l.length+' طالب.pdf');
  toast(pdfCancel?`تم الإيقاف بعد ${done} شهادة`:`تم تصدير ${done} شهادة ✔`)}
 catch(e){console.error(e);toast('حصل خطأ في التصدير','err')}
 finally{stage.style.display='none';stage.innerHTML='';ov.style.display='none';$('pdfB').style.width='0'}}
function render(){fillSel();toUI();list();thumbs();setTimeout(preview,60)}
window.addEventListener('resize',()=>{if(section.classList.contains('on'))preview()});
window.CERT={render,list,all,pick,per:perSet,set:setFromUI,design:setDesign,pdf,print,html:certHTML,opts,sel:SEL};
})();