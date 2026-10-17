/* =====================================================================
   certs.js — شهادات التقدير (منظمة إيدوس الدولية للسوروبان)
   ملف خارجي بيتحمّل بعد index.html وبيضيف تبويب «الشهادات» لوحده.
   لازم يتحط في نفس فولدر index.html.
   بيستخدم من index.html: DB, stuById, trById, acName, enName, PH, PF,
   idEnsureFull, prepLogo, waitImgs, toast, esc, today
   ===================================================================== */
(function(){
'use strict';
const $=id=>document.getElementById(id);
const W=1122,H=793;           /* A4 أفقي بالبكسل (96dpi) */
const LS='idos_cert_v1';
const G1='#ffe36e',G2='#d9a400',G3='#8a6500',INK='#0b0b0e';

/* ---------- خطوط الشهادة (إنجليزي) ---------- */
(function(){const l=document.createElement('link');l.rel='stylesheet';
 l.href='https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Great+Vibes&display=swap';document.head.appendChild(l)})();
const loadFonts=()=>Promise.all(['700 40px Cinzel','500 20px Cinzel','64px "Great Vibes"','500 20px "Cormorant Garamond"','italic 500 20px "Cormorant Garamond"','600 20px "Cormorant Garamond"'].map(f=>document.fonts.load(f).catch(()=>{}))).then(()=>document.fonts.ready);

/* ---------- الإعدادات (بتتحفظ في المتصفح) ---------- */
const TPL={
 achievement:'In recognition of outstanding performance, dedication and continuous progress in the Soroban Mental Arithmetic program.',
 excellence:'For demonstrating exceptional skill, speed and accuracy in Abacus and Mental Arithmetic, and for being an inspiring example to fellow students.',
 level:'For successfully completing Level {level} of the Soroban Mental Arithmetic program with distinction.',
 participation:'In appreciation of active participation, commitment and enthusiasm throughout the training program.'};
const DEFS={theme:'blue',title:'CERTIFICATE',sub:'OF ACHIEVEMENT',presented:'This certificate is proudly presented to',body:TPL.achievement,date:'',signer:'',signerTitle:'Director',showMeta:true,showTrainer:true,separate:false};
let CT=Object.assign({},DEFS);try{Object.assign(CT,JSON.parse(localStorage.getItem(LS)||'{}'))}catch(e){}
const saveCT=()=>{try{localStorage.setItem(LS,JSON.stringify(CT))}catch(e){}};
const SEL=new Set();

/* ---------- أدوات ---------- */
const E=s=>(typeof esc==='function'?esc(s):String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])));
const fmtDate=v=>{const d=v?new Date(v+'T00:00:00'):new Date();return d.toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})};
const nameEn=s=>(s.nameEn||enName(s.name)||'').trim();
function namesOf(s){const a=DB.academies.find(x=>x.id===s.academy)||{},t=trById(s.trainer)||{};return{n:nameEn(s),a:a.en||enName(a.name||''),t:t.en||enName(t.name||'')}}
const fill=(txt,s,e)=>String(txt||'').replace(/\{name\}/gi,e.n).replace(/\{level\}/gi,s.level).replace(/\{academy\}/gi,e.a);
const nameFs=n=>n.length<=14?88:n.length<=20?80:n.length<=26?68:n.length<=34?58:48;

/* ---------- ثيمات الألوان ---------- */
const PAL={
 blue:{n1:'#0d3a8a',n2:'#06194a',n3:'#1550b8',hl:'#4d86e8',title:'#a56f25',script:'#9a661c',ink:'#0a2a66',sub:'#0a2a66',txt:'#3f3a30',acc:'#c9a24a'},
 black:{n1:'#2b2308',n2:'#0b0b0e',n3:'#1c1a14',hl:'#8a6500',title:'#8a6500',script:'#0b0b0e',ink:'#0b0b0e',sub:'#8a6500',txt:'#2b2618',acc:'#c9a24a'}};
const pal=()=>PAL[CT.theme]||PAL.blue;
const GOLD=['#fff1a8','#e8c14a','#b8860b','#f6dc7a','#9a6a10'];

/* ---------- زخرفة ---------- */
const _dc={};
function bez(p,dx,dy){const[a,b,c,d]=p;return`M${a[0]+dx} ${a[1]+dy}C${b[0]+dx} ${b[1]+dy} ${c[0]+dx} ${c[1]+dy} ${d[0]+dx} ${d[1]+dy}`}
function decor(){
 const th=CT.theme==='black'?'black':'blue';if(_dc[th])return _dc[th];const P=PAL[th];
 /* خلفية جيلوشيه: موجات متقاطعة خفيفة + روزيت كبيرة */
 let wv='';for(let i=0;i<46;i++){const y0=-20+i*18,A=10+((i*7)%9),k=.012+(i%5)*.0016,ph=i*.55;let d='';for(let x=0;x<=W;x+=14)d+=(x?'L':'M')+x+' '+(y0+A*Math.sin(k*x*3+ph)+A*.6*Math.sin(k*x*7-ph)).toFixed(1);
  wv+=`<path d="${d}" fill="none" stroke="${i%3?'#c6a04a':P.n1}" stroke-opacity="${i%3?.2:.1}" stroke-width=".8"/>`}
 let ro='';[[250,15,7,.6],[236,12,5,0]].forEach(([R,rr,dd,ro2],j)=>{let d='';const Rr=R,r=rr,sc=1;for(let t=0;t<=2*Math.PI*r+.01;t+=.02){const X=(Rr-r)*Math.cos(t)+dd*Math.cos((Rr-r)/r*t),Y=(Rr-r)*Math.sin(t)-dd*Math.sin((Rr-r)/r*t);d+=(t?'L':'M')+(610+X*sc).toFixed(1)+' '+(400+Y*sc*.88).toFixed(1)}
  ro+=`<path d="${d}Z" fill="none" stroke="#c6a04a" stroke-opacity=".22" stroke-width=".7"/>`});
 /* الشكل الأيسر (أزرق) والأيمن السفلي */
 const A=[[0,0],[300,90],[120,250],[0,560]],A0=[430,0],B=[[1122,520],[1050,680],[930,760],[820,793]];
 const shapeA=`M0 0H${A0[0]}C${A0[0]-130} 90 120 250 0 560Z`;
 const shapeB=`M1122 793H820C930 760 1050 680 1122 520Z`;
 const bandsA=[[16,9,'url(#dcG1)',9],[27,15,'url(#dcG2)',3.2],[37,21,'url(#dcG1)',1.4]].map(([dx,dy,f,w])=>`<path d="M${A0[0]+dx} ${dy*0-0}C${A0[0]-130+dx} ${90+dy} ${120+dx} ${250+dy} ${dx*0+0+0} ${560+dy*1.8}" fill="none" stroke="${f}" stroke-width="${w}" stroke-linecap="round"/>`).join('');
 const bandsB=[[-16,-9,9],[-27,-15,3.2],[-37,-21,1.4]].map(([dx,dy,w])=>`<path d="M1122 ${520+dy*1.8}C1050 ${680+dy} ${930+dx} ${760+dy} ${820+dx} 793" fill="none" stroke="url(#dcG1)" stroke-width="${w}" stroke-linecap="round"/>`).join('');
 const swirl=(tx,ty,sc,o)=>[0,1,2,3,4].map(i=>`<path d="M0 ${30+i*22}C${130} ${10+i*30} ${260} ${70+i*24} ${380} ${-20+i*40}" fill="none" stroke="${P.hl}" stroke-opacity="${o}" stroke-width="1.1" transform="translate(${tx} ${ty}) scale(${sc})"/>`).join('');
 _dc[th]=`<svg class="ct-bg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>
  <linearGradient id="dcG1" x1="0" y1="0" x2="1" y2="1">${GOLD.map((c,i)=>`<stop offset="${i/(GOLD.length-1)}" stop-color="${c}"/>`).join('')}</linearGradient>
  <linearGradient id="dcG2" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b8860b"/><stop offset=".5" stop-color="#fff1a8"/><stop offset="1" stop-color="#d9a400"/></linearGradient>
  <linearGradient id="dcN" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${P.n3}"/><stop offset=".55" stop-color="${P.n1}"/><stop offset="1" stop-color="${P.n2}"/></linearGradient>
  <linearGradient id="dcN2" x1="1" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${P.n3}"/><stop offset=".6" stop-color="${P.n1}"/><stop offset="1" stop-color="${P.n2}"/></linearGradient>
  <radialGradient id="dcW" cx="50%" cy="48%" r="70%"><stop offset="0" stop-color="#ffffff"/><stop offset=".7" stop-color="#fffdf6"/><stop offset="1" stop-color="#f6efdc"/></radialGradient>
  <clipPath id="dcC"><rect x="9" y="9" width="${W-18}" height="${H-18}" rx="3"/></clipPath></defs>
  <rect width="${W}" height="${H}" fill="url(#dcW)"/>
  <g clip-path="url(#dcC)">${wv}${ro}
   <path d="${shapeA}" fill="url(#dcN)"/>${swirl(0,40,1,.28)}${swirl(-30,170,.8,.2)}<path d="M0 0H300C210 70 90 190 0 400Z" fill="#fff" fill-opacity=".05"/>${bandsA}
   <path d="${shapeB}" fill="url(#dcN2)"/><path d="M1122 793H900C990 770 1070 700 1122 600Z" fill="#fff" fill-opacity=".05"/>${bandsB}</g>
  <rect x="7" y="7" width="${W-14}" height="${H-14}" rx="4" fill="none" stroke="url(#dcG1)" stroke-width="5"/>
  <rect x="15" y="15" width="${W-30}" height="${H-30}" rx="2" fill="none" stroke="${P.n1}" stroke-width="1.2" stroke-opacity=".8"/></svg>`;
 return _dc[th]}
/* الختم: وردة ذهبية + إكليل غار + نجمة (أشكال فقط — النص HTML فوقه) */
function sealSVG(g){const P=pal();let pet='';const n=20;for(let i=0;i<n;i++){const a=2*Math.PI*i/n;pet+=`<circle cx="${(80+Math.cos(a)*56).toFixed(1)}" cy="${(80+Math.sin(a)*56).toFixed(1)}" r="14" fill="url(#ctS${g})" stroke="#9a6a10" stroke-width=".8"/>`}
 let lf='';for(let side=0;side<2;side++)for(let k=0;k<9;k++){const ang=(105+k*15)*Math.PI/180,x=80+33*Math.cos(ang),y=80+33*Math.sin(ang),rot=(105+k*15)+90,X=side?160-x:x,R=side?-rot:rot;lf+=`<ellipse cx="${X.toFixed(1)}" cy="${y.toFixed(1)}" rx="2.8" ry="6.5" transform="rotate(${R.toFixed(1)} ${X.toFixed(1)} ${y.toFixed(1)})" fill="url(#ctS${g})"/>`}
 let st='';for(let i=0;i<10;i++){const a=-Math.PI/2+Math.PI*i/5,r=i%2?5:12;st+=(i?'L':'M')+(Math.cos(a)*r+80).toFixed(1)+' '+(Math.sin(a)*r+57).toFixed(1)}
 return`<svg width="160" height="200" viewBox="0 0 160 200"><defs><linearGradient id="ctS${g}" x1="0" y1="0" x2="1" y2="1">${GOLD.map((c,i)=>`<stop offset="${i/(GOLD.length-1)}" stop-color="${c}"/>`).join('')}</linearGradient></defs>
 <path d="M52 128L38 196L62 182L76 198L86 134Z" fill="${P.n1}" stroke="#d9a400" stroke-width="1.4"/><path d="M108 128L122 196L98 182L84 198L74 134Z" fill="${P.n2}" stroke="#d9a400" stroke-width="1.4"/>
 ${pet}<circle cx="80" cy="80" r="52" fill="url(#ctS${g})" stroke="#9a6a10" stroke-width="1.2"/><circle cx="80" cy="80" r="44" fill="${P.n2}"/><circle cx="80" cy="80" r="40" fill="none" stroke="#ffe36e" stroke-width="1.2"/>${lf}<path d="${st}Z" fill="url(#ctS${g})"/></svg>`}

/* ---------- الشهادة ---------- */
let _g=0;
function logoTag(safe,cls){
 const wm=cls==='ct-wmi',mono=wm?'':`<div class="${cls} mono">I</div>`;
 if(safe)return(typeof LOGO_SAFE!=='undefined'&&LOGO_SAFE)?`<img class="${cls}" src="${LOGO_SAFE}" alt="">`:mono;
 const src=(document.querySelector('.brand img')||{}).src;return src?`<img class="${cls}" src="${src}" alt="" onerror="${wm?"this.style.display='none'":"this.outerHTML='<div class=&quot;"+cls+" mono&quot;>I</div>'"}">`:mono}
function certHTML(s,o,safe){const e=namesOf(s),g=++_g,P=pal(),ph=(typeof PF!=='undefined'&&PF[s.id])||(typeof PH!=='undefined'&&PH[s.id]);
 const meta=[];if(o.showMeta){if(e.a)meta.push(E(e.a));meta.push('LEVEL '+s.level)}
 const body=fill(o.body,s,e),sig=o.signer?`<div class="ct-sg">${E(o.signer)}</div>`:'';
 const cols=[['dt',`<b>${E(fmtDate(o.date))}</b>`,'DATE OF ISSUE']];
 return`<div class="ct th-${CT.theme==='black'?'k':'b'}"><div class="ct-in">${decor()}
  <div class="ct-lg">${logoTag(safe,'ct-lgi')}</div>
  <div class="ct-ph">${ph?`<img src="${ph}" alt="">`:`<span>${E((e.n||'?').charAt(0).toUpperCase())}</span>`}</div>
  <div class="ct-org">INTERNATIONAL DELTA ORGANIZATION FOR SOROBAN</div>
  <div class="ct-t1">${E(o.title)}</div>
  <div class="ct-t2">${E(o.sub)}</div>
  <div class="ct-dv"><i class="ln"></i><i class="dm k"></i><i class="dm g"></i><i class="dm k"></i><i class="ln r"></i></div>
  <div class="ct-pr">${E(o.presented)}</div>
  <div class="ct-nm" style="font-size:${nameFs(e.n)}px">${E(e.n)}</div>
  <div class="ct-ul"></div>
  ${meta.length?`<div class="ct-mt">${meta.join('<b>◆</b>')}</div>`:''}
  <div class="ct-bd">${E(body)}</div>
  <div class="ct-sb ct-s1"><b class="v">${E(fmtDate(o.date))}</b><div class="ln"></div><div class="nm">&nbsp;</div><div class="lb" style="margin-top:-12px">DATE OF ISSUE</div></div>
  ${o.showTrainer&&e.t?`<div class="ct-sb ct-s2"><div class="ln"></div><div class="nm">${E(e.t)}</div><div class="lb">TRAINER</div></div>`:''}
  <div class="ct-sb ct-s3">${sig}<div class="ln"></div><div class="nm">International Delta Organization for Soroban</div><div class="lb">APPROVED BY${o.signerTitle?' • '+E(o.signerTitle.toUpperCase()):''}</div></div>
  <div class="ct-seal">${sealSVG(g)}<div class="s1">IDOS</div><div class="s2">★ ★ ★</div></div>
 </div></div>`}

/* ---------- CSS ---------- */
const css=`
.ct{position:relative;width:${W}px;height:${H}px;overflow:hidden;background:#fff;direction:ltr;text-align:center;color:#222;font-family:'Cormorant Garamond','Times New Roman',serif;-webkit-print-color-adjust:exact;print-color-adjust:exact;page:certland;page-break-after:always;break-after:page}
.ct *{box-sizing:border-box;margin:0}
.ct-in{position:absolute;inset:0}.ct-bg{position:absolute;left:0;top:0}
.ct .mono{display:grid;place-items:center;border-radius:50%;background:linear-gradient(135deg,#ffe36e,#d9a400);color:#0b0b0e;font:700 56px 'Cinzel',serif}
.ct-lg{position:absolute;left:74px;top:62px;width:112px;height:112px;border-radius:50%;padding:5px;background:linear-gradient(135deg,#fff1a8,#d9a400 50%,#8a6500);box-shadow:0 4px 14px rgba(0,0,0,.45)}
.ct-lg .ct-lgi{width:100%;height:100%;border-radius:50%;background:#fffaf0;object-fit:contain;display:block;padding:6px}.ct-lg .ct-lgi.mono{width:100%;height:100%;font-size:50px;background:#06194a;color:#ffe36e;padding:0}
.ct-ph{position:absolute;right:70px;top:58px;width:132px;height:132px;border-radius:50%;padding:5px;background:linear-gradient(135deg,#fff1a8,#d9a400 50%,#8a6500);box-shadow:0 4px 14px rgba(0,0,0,.35)}
.ct-ph img,.ct-ph span{display:block;width:100%;height:100%;border-radius:50%;border:3px solid #fff;object-fit:cover;object-position:50% 18%;background:#fff}.ct-ph span{display:grid;place-items:center;background:#06194a;color:#ffe36e;font:700 58px 'Cinzel',serif}
.ct-org{position:absolute;left:350px;width:560px;top:64px;font:600 11.5px 'Cinzel',serif;letter-spacing:3.4px;color:#8a6500}
.ct-t1{position:absolute;left:330px;width:580px;top:84px;font:700 58px/1.1 'Cinzel',serif;letter-spacing:9px;color:#a56f25;padding-left:9px}
.ct-t2{position:absolute;left:330px;width:580px;top:156px;font:700 25px 'Cinzel',serif;letter-spacing:8px;color:#0a2a66;padding-left:8px}
.th-k .ct-t1{color:#8a6500}.th-k .ct-t2{color:#0b0b0e}
.ct-dv{position:absolute;left:330px;width:580px;top:198px;height:16px;display:flex;align-items:center;justify-content:center;gap:9px}.ct-dv .ln{display:block;width:150px;height:1.6px;background:linear-gradient(90deg,transparent,#d9a400)}.ct-dv .ln.r{background:linear-gradient(270deg,transparent,#d9a400)}.ct-dv .dm{display:block;transform:rotate(45deg)}.ct-dv .g{width:11px;height:11px;background:#d9a400}.ct-dv .k{width:6px;height:6px;background:#0a2a66}.th-k .ct-dv .k{background:#0b0b0e}
.ct-pr{position:absolute;left:330px;width:580px;top:234px;font:italic 500 25px 'Cormorant Garamond',serif;color:#4a4338}
.ct-nm{position:absolute;left:280px;width:680px;top:262px;height:104px;display:flex;align-items:center;justify-content:center;font-family:'Great Vibes','Brush Script MT',cursive;line-height:1.2;color:#9a661c;white-space:nowrap;overflow:hidden;text-shadow:0 1px 0 rgba(255,255,255,.8),0 2px 2px rgba(120,80,20,.25)}.th-k .ct-nm{color:#0b0b0e}
.ct-ul{position:absolute;left:360px;width:520px;top:368px;height:2.4px;background:linear-gradient(90deg,transparent,#8a6500 18%,#ffe36e 50%,#8a6500 82%,transparent)}
.ct-mt{position:absolute;left:330px;width:580px;top:381px;font:600 14px 'Cinzel',serif;letter-spacing:3px;color:#0a2a66;display:flex;gap:14px;justify-content:center;align-items:center}.ct-mt b{color:#d9a400;font-size:9px}.th-k .ct-mt{color:#5c4400}
.ct-bd{position:absolute;left:310px;width:620px;top:420px;max-height:112px;overflow:hidden;font:500 24px/1.45 'Cormorant Garamond',serif;color:#3f3a30}
.ct-seal{position:absolute;left:900px;top:520px;width:160px;height:200px;transform:scale(.92);transform-origin:50% 0}.ct-seal svg{position:absolute;left:0;top:0}.ct-seal .s1{position:absolute;left:0;right:0;top:72px;font:700 17px 'Cinzel',serif;letter-spacing:3px;color:#ffe36e;padding-left:3px}.ct-seal .s2{position:absolute;left:0;right:0;top:94px;font:700 8px 'Cinzel',serif;letter-spacing:2px;color:#ffe36e}
.ct-sb{position:absolute;top:632px;width:230px}.ct-s1{left:70px}.ct-s2{left:330px}.ct-s3{left:600px;width:250px}
.ct-sb .ln{height:1.6px;background:#0a2a66;margin:0 8px 7px}.th-k .ct-sb .ln{background:#0b0b0e}.ct-sb .v{position:absolute;left:0;right:0;top:-30px;font:600 20px 'Cormorant Garamond',serif;color:#222}
.ct-s1 .ln{margin-top:0}.ct-sb .nm{font:700 13px 'Cinzel',serif;letter-spacing:.8px;color:#0a2a66;line-height:1.35}.th-k .ct-sb .nm{color:#0b0b0e}.ct-sb .lb{font:500 10px 'Cinzel',serif;letter-spacing:3px;color:#8a6500;margin-top:4px}
.ct-sg{position:absolute;left:0;right:0;top:-48px;font:400 44px 'Great Vibes',cursive;color:#0a2a66;line-height:1.2}
#s-cert .ctlist{max-height:340px;overflow:auto;border:1px solid var(--line,#e7e2d3);border-radius:14px;background:#fff}
#s-cert .ctrow{display:flex;align-items:center;gap:10px;padding:8px 12px;border-bottom:1px solid #f0f1f8;cursor:pointer}#s-cert .ctrow:hover{background:#f6f7ff}
#s-cert .ctrow input[type=checkbox]{width:18px;height:18px;flex:none}#s-cert .ctrow .nmx{margin-right:auto;display:flex;flex-direction:column}#s-cert .ctrow small{color:#7a7566}
#s-cert .ctrow input.en{width:230px;direction:ltr;padding:6px 10px;border-radius:10px}
#s-cert .ctpv{overflow:hidden;border-radius:14px;border:1px solid var(--line,#e7e2d3);background:#eceefb;position:relative}#s-cert .ctpv .ct{position:absolute;right:0;top:0;transform-origin:top right;box-shadow:0 10px 30px rgba(0,0,0,.25)}
#s-cert textarea{width:100%;min-height:90px;direction:ltr;padding:10px 14px;border-radius:12px;border:1px solid var(--line,#e7e2d3);font:inherit}
#s-cert .chk{display:flex;align-items:center;gap:8px;font-weight:600}#s-cert .chk input{width:18px;height:18px}
#certStage{display:none;position:fixed;left:0;top:0;width:${W}px;height:${H}px;background:#fff;z-index:100;direction:ltr}
#certStage .ct{page-break-after:auto}
@page certland{size:A4 landscape;margin:0}
@media print{body.pr-rep .ct{width:${W-1}px;height:${H-1}px}}
`;
const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);

/* ---------- الواجهة ---------- */
const section=document.createElement('section');section.id='s-cert';section.className='sec';
section.innerHTML=`<h1 class="pt">شهادات التقدير</h1>
 <div class="card"><h2>١) اختار الطلاب <span class="bd" id="ctN">0 محدد</span></h2>
  <div class="grid"><div><label>الأكاديمية</label><select id="ctAc" onchange="CERT.list()"></select></div><div><label>المدرب</label><select id="ctTr" onchange="CERT.list()"></select></div><div><label>بحث</label><input id="ctQ" placeholder="🔍 اسم الطالب" oninput="CERT.list()"></div></div>
  <div class="acts"><button class="btn b-ink b-sm" onclick="CERT.all(true)">تحديد المعروضين</button><button class="btn b-out b-sm" onclick="CERT.all(false)">إلغاء التحديد</button></div>
  <div class="hint">الاسم الإنجليزي بيتكتب تلقائياً من العربي، وتقدر تعدله من الخانة اللي جنب كل طالب وبيتحفظ.</div>
  <div class="ctlist" id="ctList"></div></div>
 <div class="card"><h2>٢) نص الشهادة (بالإنجليزي)</h2>
  <div class="grid">
   <div><label>اللون</label><select id="ctTheme" onchange="CERT.set()"><option value="blue">أزرق ملكي + ذهبي</option><option value="black">أسود + ذهبي (ألوان اللوجو)</option></select></div>
   <div><label>قالب جاهز</label><select id="ctTpl" onchange="CERT.tpl()"><option value="">— اختار —</option><option value="achievement">Achievement</option><option value="excellence">Excellence</option><option value="level">Level completion</option><option value="participation">Participation</option></select></div>
   <div><label>العنوان</label><input id="ctTitle" dir="ltr" oninput="CERT.set()"></div>
   <div><label>السطر الفرعي</label><input id="ctSub" dir="ltr" oninput="CERT.set()"></div>
   <div><label>سطر التقديم</label><input id="ctPres" dir="ltr" oninput="CERT.set()"></div>
   <div><label>التاريخ</label><input id="ctDate" type="date" oninput="CERT.set()"></div>
   <div><label>اسم المعتمِد (بخط توقيع — اختياري)</label><input id="ctSigner" dir="ltr" oninput="CERT.set()"></div>
   <div><label>مسمّاه</label><input id="ctSignT" dir="ltr" oninput="CERT.set()"></div>
  </div>
  <div style="margin-top:12px"><label>نص الشهادة — تقدر تستخدم {name} {level} {academy}</label><textarea id="ctBody" oninput="CERT.set()"></textarea></div>
  <div class="acts" style="gap:22px"><label class="chk"><input type="checkbox" id="ctMeta" onchange="CERT.set()">سطر الأكاديمية والليفل</label><label class="chk"><input type="checkbox" id="ctTrn" onchange="CERT.set()">توقيع المدرب</label><label class="chk"><input type="checkbox" id="ctSep" onchange="CERT.set()">ملف PDF منفصل لكل طالب</label></div></div>
 <div class="card"><h2>٣) معاينة وتصدير</h2>
  <div class="ctpv" id="ctPv"></div>
  <div class="acts"><button class="btn b-gold" onclick="CERT.pdf()">📄 تصدير PDF للمحددين</button><button class="btn b-ink" onclick="CERT.print()">🖨 طباعة</button></div>
  <div class="hint">المعاينة لأول طالب محدد. التصدير بيعمل صفحة A4 أفقية لكل طالب (أو ملف لكل طالب لو فعّلت الخيار).</div></div>`;
const main=document.querySelector('main');(main||document.body).appendChild(section);
const stage=document.createElement('div');stage.id='certStage';document.body.appendChild(stage);

/* تسجيل التبويب في القايمة */
try{
 const ico='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="13" rx="2"/><circle cx="12" cy="10.5" r="2.6"/><path d="M9.5 17v4l2.5-1.6 2.5 1.6v-4"/></svg>';
 const i=TABS.findIndex(t=>t[0]==='log');TABS.splice(i<0?TABS.length:i,0,['cert',ico,'الشهادات']);RENDER.cert=()=>CERT.render();navAdmin=undefined;buildNav()}catch(e){console.error('certs.js: nav',e)}

/* ---------- المنطق ---------- */
const opts=()=>Object.assign({},CT);
const chosen=()=>DB.students.filter(s=>SEL.has(s.id)).sort((a,b)=>a.name.localeCompare(b.name,'ar'));
function visible(){const ac=$('ctAc').value,tr=$('ctTr').value,q=$('ctQ').value.trim().toLowerCase();
 return DB.students.filter(s=>(!ac||s.academy===ac)&&(!tr||s.trainer===tr)&&(!q||s.name.toLowerCase().includes(q)||nameEn(s).toLowerCase().includes(q))).sort((a,b)=>a.name.localeCompare(b.name,'ar'))}
function fillSel(){const a=$('ctAc'),t=$('ctTr'),va=a.value,vt=t.value;
 a.innerHTML='<option value="">كل الأكاديميات</option>'+DB.academies.map(x=>`<option value="${x.id}">${E(x.name)}</option>`).join('');
 t.innerHTML='<option value="">كل المدربين</option>'+DB.trainers.map(x=>`<option value="${x.id}">${E(x.name)}</option>`).join('');a.value=va;t.value=vt}
function list(){const l=visible();$('ctList').innerHTML=l.length?l.map(s=>`<div class="ctrow" onclick="if(event.target.tagName!=='INPUT')this.querySelector('input').click()"><input type="checkbox" ${SEL.has(s.id)?'checked':''} onchange="CERT.pick('${s.id}',this.checked)"><div class="nmx"><b>${E(s.name)}</b><small>${E(acName(s.academy))} • ${E((trById(s.trainer)||{}).name||'—')}</small></div><input class="en" value="${E(nameEn(s))}" onclick="event.stopPropagation()" onchange="CERT.rename('${s.id}',this.value)" title="الاسم بالإنجليزي"></div>`).join(''):'<div class="empty" style="padding:18px;text-align:center">مفيش طلاب</div>';cnt()}
const cnt=()=>{$('ctN').textContent=SEL.size+' محدد'};
function pick(id,on){on?SEL.add(id):SEL.delete(id);cnt();preview()}
function all(on){visible().forEach(s=>on?SEL.add(s.id):SEL.delete(s.id));if(!on)SEL.clear();list();preview()}
function rename(id,v){const s=stuById(id);if(!s)return;s.nameEn=v.trim();save();preview()}
function setFromUI(){CT.theme=$('ctTheme').value;CT.title=$('ctTitle').value;CT.sub=$('ctSub').value;CT.presented=$('ctPres').value;CT.body=$('ctBody').value;CT.date=$('ctDate').value;CT.signer=$('ctSigner').value;CT.signerTitle=$('ctSignT').value;CT.showMeta=$('ctMeta').checked;CT.showTrainer=$('ctTrn').checked;CT.separate=$('ctSep').checked;saveCT();preview()}
function toUI(){$('ctTheme').value=CT.theme||'blue';$('ctTitle').value=CT.title;$('ctSub').value=CT.sub;$('ctPres').value=CT.presented;$('ctBody').value=CT.body;$('ctDate').value=CT.date||today();$('ctSigner').value=CT.signer;$('ctSignT').value=CT.signerTitle;$('ctMeta').checked=!!CT.showMeta;$('ctTrn').checked=!!CT.showTrainer;$('ctSep').checked=!!CT.separate}
function tpl(){const k=$('ctTpl').value;if(!k)return;$('ctBody').value=TPL[k];$('ctTpl').value='';setFromUI()}
function preview(){const pv=$('ctPv');if(!pv)return;const l=chosen(),s=l[0]||DB.students[0];
 const w=pv.clientWidth||900,sc=Math.min(1,w/W);pv.style.height=(H*sc)+'px';
 if(!s){pv.innerHTML='<div class="empty" style="padding:30px;text-align:center">مفيش طلاب لعرضهم</div>';return}
 pv.innerHTML=certHTML(s,opts(),false);const c=pv.querySelector('.ct');c.style.transform=`scale(${sc})`}
async function ensure(l){await loadFonts();try{if(typeof idEnsureFull==='function')await idEnsureFull(l)}catch(e){}LOGO_SAFE=await prepLogo()}
function pages(l){const o=opts();return l.map(s=>certHTML(s,o,true))}
async function print(){const l=chosen();if(!l.length)return toast('اختار طالب واحد على الأقل','err');
 if(l.length>40&&!confirm(`هيتطبع ${l.length} شهادة. تكمل؟`))return;toast('جاري تجهيز الشهادات...');
 await ensure(l);const pa=$('printArea');pa.innerHTML=pages(l).join('');await waitImgs(pa);
 document.body.classList.add('pr-rep');const done=()=>{document.body.classList.remove('pr-rep');pa.innerHTML='';window.removeEventListener('afterprint',done)};
 window.addEventListener('afterprint',done);setTimeout(()=>window.print(),200)}
async function pdf(){const l=chosen();if(!l.length)return toast('اختار طالب واحد على الأقل','err');
 if(typeof html2canvas==='undefined'||!window.jspdf)return toast('المكتبات محتاجة اتصال بالنت','err');
 const sep=CT.separate&&l.length>1;if(sep&&!confirm(`هيتنزّل ${l.length} ملف PDF. لو المتصفح سأل عن تنزيل ملفات متعددة اختار السماح. تكمل؟`))return;
 const{jsPDF}=window.jspdf,ov=$('pdfOv');pdfCancel=false;scrollTo(0,0);stage.style.display='block';ov.style.display='flex';let pdfDoc=null,done=0;
 const mk=()=>new jsPDF({orientation:'l',unit:'mm',format:'a4'});
 try{await ensure(l);const P=pages(l);
  for(let i=0;i<P.length&&!pdfCancel;i++){$('pdfN').textContent=nameEn(l[i]);$('pdfC').textContent=(i+1)+' / '+P.length;
   stage.innerHTML=P[i];await waitImgs(stage);await new Promise(r=>setTimeout(r,250));
   const cv=await html2canvas(stage,{scale:2,backgroundColor:'#fcf8ec',scrollX:0,scrollY:0,width:W,height:H,windowWidth:W,windowHeight:H});
   const img=cv.toDataURL('image/jpeg',.94);
   if(sep){const d=mk();d.addImage(img,'JPEG',0,0,297,210);d.save('Certificate - '+nameEn(l[i]).replace(/[\\/:*?"<>|]/g,'')+'.pdf');await new Promise(r=>setTimeout(r,450))}
   else{if(!pdfDoc)pdfDoc=mk();else pdfDoc.addPage();pdfDoc.addImage(img,'JPEG',0,0,297,210)}
   done++;$('pdfB').style.width=(done/P.length*100)+'%'}
  if(pdfDoc&&!pdfCancel)pdfDoc.save(l.length===1?'Certificate - '+nameEn(l[0]).replace(/[\\/:*?"<>|]/g,'')+'.pdf':'Certificates - '+l.length+' students.pdf');
  toast(pdfCancel?`تم الإيقاف بعد ${done} شهادة`:`تم تصدير ${done} شهادة ✔`)}
 catch(e){console.error(e);toast('حصل خطأ في التصدير','err')}
 finally{stage.style.display='none';stage.innerHTML='';ov.style.display='none';$('pdfB').style.width='0'}}
function render(){fillSel();toUI();list();setTimeout(preview,60)}
window.addEventListener('resize',()=>{if(section.classList.contains('on'))preview()});
window.CERT={render,list,all,pick,rename,set:setFromUI,tpl,pdf,print,html:certHTML,opts,sel:SEL};
})();
