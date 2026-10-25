/* =====================================================================
   certs.js — شهادات التقدير (منظمة إيدوس الدولية للسوروبان)
   5 تصميمات: الملكي • كأس البطل • الفائز (وينر) • الميدالية الزمردية • النجم العصري
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
const GOLD=['#fff1a8','#e8c14a','#b8860b','#f6dc7a','#9a6a10'];

/* ---------- خطوط الشهادة (إنجليزي) ---------- */
(function(){const l=document.createElement('link');l.rel='stylesheet';
 l.href='https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;800&family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Great+Vibes&family=Montserrat:wght@600;700;800&display=swap';document.head.appendChild(l)})();
const loadFonts=()=>Promise.all(['700 40px Cinzel','800 40px Cinzel','500 20px Cinzel','64px "Great Vibes"','500 20px "Cormorant Garamond"','italic 500 20px "Cormorant Garamond"','600 20px "Cormorant Garamond"','800 40px Montserrat','700 20px Montserrat'].map(f=>document.fonts.load(f).catch(()=>{}))).then(()=>document.fonts.ready);

/* ---------- التصميمات ---------- */
const DESIGNS=[
 {k:'royal',n:'الملكي الكلاسيك',d:'أزرق/أسود + ذهبي'},
 {k:'trophy',n:'كأس البطل',d:'أسود فاخر + كأس ذهبي'},
 {k:'winner',n:'الفائز (وينر)',d:'ميدالية المركز + احتفالي'},
 {k:'medal',n:'الميدالية الزمردية',d:'زمردي + كريمي فاخر'},
 {k:'star',n:'النجم العصري',d:'هندسي أزرق حديث'}];
const TPL={
 achievement:'In recognition of outstanding performance, dedication and continuous progress in the Soroban Mental Arithmetic program.',
 excellence:'For demonstrating exceptional skill, speed and accuracy in Abacus and Mental Arithmetic, and for being an inspiring example to fellow students.',
 level:'For successfully completing Level {level} of the Soroban Mental Arithmetic program with distinction.',
 participation:'In appreciation of active participation, commitment and enthusiasm throughout the training program.',
 winner:'For achieving {place} place with outstanding speed and accuracy in the Soroban Mental Arithmetic competition.',
 champion:'For winning the championship title with exceptional skill, speed and accuracy, and for making the whole academy proud.',
 star:'In appreciation of a shining performance, a remarkable spirit of effort and sincere dedication to learning.'};
const PRE={
 royal:{title:'CERTIFICATE',sub:'OF ACHIEVEMENT',presented:'This certificate is proudly presented to',body:TPL.achievement},
 trophy:{title:'CHAMPION',sub:'CERTIFICATE OF VICTORY',presented:'This trophy is proudly awarded to',body:TPL.champion},
 winner:{title:'WINNER',sub:'CERTIFICATE OF VICTORY',presented:'Congratulations to',body:TPL.winner},
 medal:{title:'CERTIFICATE',sub:'OF EXCELLENCE',presented:'This certificate is proudly presented to',body:TPL.excellence},
 star:{title:'CERTIFICATE',sub:'OF APPRECIATION',presented:'Proudly presented to',body:TPL.star}};

/* ---------- الإعدادات (بتتحفظ في المتصفح) ---------- */
const DEFS={theme:'blue',design:'royal',place:'1',title:'CERTIFICATE',sub:'OF ACHIEVEMENT',presented:'This certificate is proudly presented to',body:TPL.achievement,date:'',signer:'',signerTitle:'Director',showMeta:true,showTrainer:true,separate:false};
let CT=Object.assign({},DEFS);try{Object.assign(CT,JSON.parse(localStorage.getItem(LS)||'{}'))}catch(e){}
if(!PRE[CT.design])CT.design='royal';
const saveCT=()=>{try{localStorage.setItem(LS,JSON.stringify(CT))}catch(e){}};
const SEL=new Set();

/* ---------- أدوات ---------- */
const E=s=>(typeof esc==='function'?esc(s):String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])));
const fmtDate=v=>{const d=v?new Date(v+'T00:00:00'):new Date();return d.toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})};
const nameEn=s=>(s.nameEn||enName(s.name)||'').trim();
function namesOf(s){const a=DB.academies.find(x=>x.id===s.academy)||{},t=trById(s.trainer)||{};return{n:nameEn(s),a:a.en||enName(a.name||''),t:t.en||enName(t.name||'')}}
const ORD={1:'1st',2:'2nd',3:'3rd'};
const fill=(txt,s,e)=>String(txt||'').replace(/\{name\}/gi,e.n).replace(/\{level\}/gi,s.level).replace(/\{academy\}/gi,e.a).replace(/\{place\}/gi,ORD[CT.place]||'1st');
const nameFs=n=>n.length<=14?88:n.length<=20?80:n.length<=26?68:n.length<=34?58:48;

/* ---------- ثيمات الألوان (للتصميم الملكي) ---------- */
const PAL={
 blue:{n1:'#0d3a8a',n2:'#06194a',n3:'#1550b8',hl:'#4d86e8'},
 black:{n1:'#2b2308',n2:'#0b0b0e',n3:'#1c1a14',hl:'#8a6500'}};
const EM={n1:'#065f46',n2:'#022c22',n3:'#047857',hl:'#34d399'};
const pal=()=>PAL[CT.theme]||PAL.blue;
/* ألوان المركز: ذهبي / فضي / برونزي */
const PLC={
 1:{g:['#fff1a8','#ffd84a','#d9a400','#9a6a10'],r1:'#c8102e',r2:'#8f0a20'},
 2:{g:['#ffffff','#e2e8f0','#aab4c4','#6b778a'],r1:'#1d4ed8',r2:'#1e3a8a'},
 3:{g:['#ffe0c2','#e6a56a','#b86f2e','#7a4616'],r1:'#059669',r2:'#065f46'}};
const placeOf=o=>PLC[o.place]||PLC[1];
const WORD={1:'FIRST',2:'SECOND',3:'THIRD'};

/* ---------- أدوات الرسم ---------- */
const gdef=(id,arr,dir)=>`<linearGradient id="${id}" ${dir||'x1="0" y1="0" x2="1" y2="1"'}>${arr.map((c,i)=>`<stop offset="${(i/(arr.length-1)).toFixed(3)}" stop-color="${c}"/>`).join('')}</linearGradient>`;
const rnd=seed=>{let h=seed>>>0;return()=>{h=(h*1664525+1013904223)>>>0;return h/4294967296}};
const starP=(cx,cy,R,r,n,rot)=>{let d='';for(let i=0;i<n*2;i++){const a=rot+Math.PI*i/n,rr=i%2?r:R;d+=(i?'L':'M')+(cx+Math.cos(a)*rr).toFixed(1)+' '+(cy+Math.sin(a)*rr).toFixed(1)}return d+'Z'};
function laurel(cx,cy,R,n,fill,a0,a1,rx,ry){let o='';for(let side=0;side<2;side++)for(let k=0;k<n;k++){const t=a0+(a1-a0)*k/(n-1),ang=t*Math.PI/180,x=cx+R*Math.cos(ang),y=cy+R*Math.sin(ang),rot=t+90,X=side?2*cx-x:x,Rt=side?-rot:rot;o+=`<ellipse cx="${X.toFixed(1)}" cy="${y.toFixed(1)}" rx="${rx}" ry="${ry}" transform="rotate(${Rt.toFixed(1)} ${X.toFixed(1)} ${y.toFixed(1)})" fill="${fill}"/>`}return o}
/* كأس ذهبي (شكل فقط) — مركزه x=0 وقمته y=0 وارتفاعه ~170 */
function trophyG(a,b,sc,tx,ty){return`<g transform="translate(${tx} ${ty}) scale(${sc})">
 <path d="M-52 8C-94 8-98 72-50 84" fill="none" stroke="url(#${a})" stroke-width="10" stroke-linecap="round"/><path d="M52 8C94 8 98 72 50 84" fill="none" stroke="url(#${a})" stroke-width="10" stroke-linecap="round"/>
 <path d="M-54 0H54C54 58 34 104 0 122C-34 104-54 58-54 0Z" fill="url(#${a})" stroke="#8a6500" stroke-width="1.5"/>
 <ellipse cx="0" cy="0" rx="54" ry="10" fill="url(#${b})" stroke="#8a6500" stroke-width="1.5"/><ellipse cx="0" cy="1" rx="44" ry="6.5" fill="#5a3d05" opacity=".55"/>
 <path d="M-36 16C-36 54-24 86-9 106" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="6" stroke-linecap="round"/>
 <path d="${starP(0,50,15,6.5,5,-Math.PI/2)}" fill="#06194a" stroke="#fff1a8" stroke-width="1"/>
 <path d="M-10 118L-13 142H13L10 118Z" fill="url(#${a})"/><ellipse cx="0" cy="130" rx="16" ry="5.5" fill="url(#${b})" stroke="#8a6500" stroke-width="1"/>
 <rect x="-34" y="142" width="68" height="12" rx="3" fill="url(#${a})" stroke="#8a6500" stroke-width="1"/><rect x="-48" y="154" width="96" height="15" rx="4" fill="url(#${a})" stroke="#8a6500" stroke-width="1.2"/><rect x="-22" y="157.5" width="44" height="8" rx="2" fill="#06194a"/></g>`}
/* ميدالية بشريط وإكليل غار (شكل فقط) */
function medalG(a,r1,r2,sc,tx,ty,navy){return`<g transform="translate(${tx} ${ty}) scale(${sc})">
 <path d="M-26-34L-62-132H-30L4-42Z" fill="${r1}"/><path d="M26-34L62-132H30L-4-42Z" fill="${r2}"/><path d="M-26-34L-34-74L-14-60Z" fill="#000" opacity=".12"/>
 ${laurel(0,0,70,10,`url(#${a})`,100,235,5,12)}
 <circle r="58" fill="url(#${a})" stroke="#8a6500" stroke-width="1.6"/><circle r="49" fill="${navy||'#06194a'}"/><circle r="52.5" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="1.2"/><circle r="44.5" fill="none" stroke="#ffe36e" stroke-width="1.4"/></g>`}
/* ركن مزخرف */
const cornerG=(x,y,sx,sy,c1,c2)=>`<g transform="translate(${x} ${y}) scale(${sx} ${sy})"><path d="M0 84V12Q0 0 12 0H84" fill="none" stroke="${c1}" stroke-width="3.2"/><path d="M14 66V26Q14 14 26 14H66" fill="none" stroke="${c2}" stroke-width="1.2"/><rect x="-6" y="-6" width="12" height="12" transform="rotate(45)" fill="${c1}"/><circle cx="26" cy="26" r="4" fill="${c2}"/></g>`;

/* ---------- زخرفة التصميم الملكي ---------- */
const _dc={};
function decor(){
 const th=CT.theme==='black'?'black':'blue';if(_dc[th])return _dc[th];const P=PAL[th];
 let wv='';for(let i=0;i<46;i++){const y0=-20+i*18,A=10+((i*7)%9),k=.012+(i%5)*.0016,ph=i*.55;let d='';for(let x=0;x<=W;x+=14)d+=(x?'L':'M')+x+' '+(y0+A*Math.sin(k*x*3+ph)+A*.6*Math.sin(k*x*7-ph)).toFixed(1);
  wv+=`<path d="${d}" fill="none" stroke="${i%3?'#c6a04a':P.n1}" stroke-opacity="${i%3?.2:.1}" stroke-width=".8"/>`}
 let ro='';[[250,15,7],[236,12,5]].forEach(([R,rr,dd])=>{let d='';const Rr=R,r=rr,sc=1;for(let t=0;t<=2*Math.PI*r+.01;t+=.02){const X=(Rr-r)*Math.cos(t)+dd*Math.cos((Rr-r)/r*t),Y=(Rr-r)*Math.sin(t)-dd*Math.sin((Rr-r)/r*t);d+=(t?'L':'M')+(610+X*sc).toFixed(1)+' '+(400+Y*sc*.88).toFixed(1)}
  ro+=`<path d="${d}Z" fill="none" stroke="#c6a04a" stroke-opacity=".22" stroke-width=".7"/>`});
 const A0=[430,0];
 const shapeA=`M0 0H${A0[0]}C${A0[0]-130} 90 120 250 0 560Z`;
 const shapeB=`M1122 793H820C930 760 1050 680 1122 520Z`;
 const bandsA=[[16,9,'url(#dcG1)',9],[27,15,'url(#dcG2)',3.2],[37,21,'url(#dcG1)',1.4]].map(([dx,dy,f,w])=>`<path d="M${A0[0]+dx} 0C${A0[0]-130+dx} ${90+dy} ${120+dx} ${250+dy} 0 ${560+dy*1.8}" fill="none" stroke="${f}" stroke-width="${w}" stroke-linecap="round"/>`).join('');
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
function sealSVG(g,P0){const P=P0||pal();let pet='';const n=20;for(let i=0;i<n;i++){const a=2*Math.PI*i/n;pet+=`<circle cx="${(80+Math.cos(a)*56).toFixed(1)}" cy="${(80+Math.sin(a)*56).toFixed(1)}" r="14" fill="url(#ctS${g})" stroke="#9a6a10" stroke-width=".8"/>`}
 const lf=laurel(80,80,33,9,`url(#ctS${g})`,105,225,2.8,6.5);
 return`<svg width="160" height="200" viewBox="0 0 160 200"><defs><linearGradient id="ctS${g}" x1="0" y1="0" x2="1" y2="1">${GOLD.map((c,i)=>`<stop offset="${i/(GOLD.length-1)}" stop-color="${c}"/>`).join('')}</linearGradient></defs>
 <path d="M52 128L38 196L62 182L76 198L86 134Z" fill="${P.n1}" stroke="#d9a400" stroke-width="1.4"/><path d="M108 128L122 196L98 182L84 198L74 134Z" fill="${P.n2}" stroke="#d9a400" stroke-width="1.4"/>
 ${pet}<circle cx="80" cy="80" r="52" fill="url(#ctS${g})" stroke="#9a6a10" stroke-width="1.2"/><circle cx="80" cy="80" r="44" fill="${P.n2}"/><circle cx="80" cy="80" r="40" fill="none" stroke="#ffe36e" stroke-width="1.2"/>${lf}<path d="${starP(80,57,12,5,5,-Math.PI/2)}" fill="url(#ctS${g})"/></svg>`}
/* شارة النجمة (للتصميم العصري) */
function starBadge(g){return`<svg width="160" height="200" viewBox="0 0 160 200"><defs>${gdef('sbG'+g,GOLD)}</defs>
 <path d="M54 124L40 192L64 178L78 194L88 130Z" fill="#0a2c80" stroke="#ffd84a" stroke-width="1.4"/><path d="M106 124L120 192L96 178L82 194L72 130Z" fill="#06194a" stroke="#ffd84a" stroke-width="1.4"/>
 <path d="${starP(80,80,78,64,24,0)}" fill="url(#sbG${g})" stroke="#9a6a10" stroke-width="1.2"/><circle cx="80" cy="80" r="52" fill="#06194a"/><circle cx="80" cy="80" r="47" fill="none" stroke="#ffe36e" stroke-width="1.3"/><circle cx="80" cy="80" r="56" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1"/>
 <path d="${starP(80,57,12,5,5,-Math.PI/2)}" fill="url(#sbG${g})"/></svg>`}

/* ---------- خلفيات التصميمات (شكل فقط) ---------- */
const ART={};
ART.trophy=(g,o)=>{const pl=placeOf(o),r=rnd(7);let sp='',ln='';
 for(let i=0;i<30;i++){const x=110+r()*900,y=36+r()*340,s=3+r()*7;sp+=`<path d="${starP(x,y,s,s*.35,4,Math.PI/4)}" fill="#ffe36e" opacity="${(.25+r()*.55).toFixed(2)}"/>`}
 for(let i=-8;i<30;i++)ln+=`<path d="M${i*60} 0L${i*60+800} 793" stroke="#ffd84a" stroke-opacity=".035" stroke-width="1"/>`;
 return`<svg class="ct-bg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>${gdef('tgA'+g,pl.g)}${gdef('tgB'+g,[...pl.g].reverse())}
 <radialGradient id="tbg${g}" cx="50%" cy="22%" r="80%"><stop offset="0" stop-color="#2a2410"/><stop offset=".55" stop-color="#121008"/><stop offset="1" stop-color="#060607"/></radialGradient>
 <radialGradient id="tsp${g}" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ffe36e" stop-opacity=".45"/><stop offset="1" stop-color="#ffe36e" stop-opacity="0"/></radialGradient></defs>
 <rect width="${W}" height="${H}" fill="url(#tbg${g})"/>${ln}<ellipse cx="561" cy="130" rx="270" ry="175" fill="url(#tsp${g})"/>${sp}
 <path d="M0 740C200 700 360 770 561 735S920 700 1122 745V793H0Z" fill="#ffd84a" opacity=".06"/><path d="M0 752C220 716 380 780 561 748S930 716 1122 756" fill="none" stroke="url(#tgA${g})" stroke-width="2" opacity=".7"/>
 <rect x="12" y="12" width="${W-24}" height="${H-24}" rx="6" fill="none" stroke="url(#tgA${g})" stroke-width="5"/><rect x="28" y="28" width="${W-56}" height="${H-56}" rx="3" fill="none" stroke="#ffd84a" stroke-opacity=".75" stroke-width="1.2"/>
 ${cornerG(46,46,1,1,'#ffd84a','#ffe36e')}${cornerG(W-46,46,-1,1,'#ffd84a','#ffe36e')}${cornerG(46,H-46,1,-1,'#ffd84a','#ffe36e')}${cornerG(W-46,H-46,-1,-1,'#ffd84a','#ffe36e')}
 ${trophyG('tgA'+g,'tgB'+g,.98,561,34)}</svg>`};
ART.winner=(g,o)=>{const pl=placeOf(o),r=rnd(11),cols=['#ffd84a','#38bdf8','#f43f5e','#10b981','#8b5cf6','#f59e0b','#2563eb'];let cf='',n=0,guard=0;
 while(n<110&&guard++<2000){const x=r()*W,y=14+r()*(H-28);if(x>285&&x<845&&y>300&&y<660)continue;if(y>585&&y<712&&x>50&&x<880)continue;if(y>728&&x>250&&x<870)continue;const c=cols[Math.floor(r()*cols.length)],t=r(),rot=(r()*360).toFixed(0),s=5+r()*9;n++;
  cf+=t<.45?`<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${s.toFixed(1)}" height="${(s*.45).toFixed(1)}" rx="1" transform="rotate(${rot} ${x.toFixed(1)} ${y.toFixed(1)})" fill="${c}" opacity=".85"/>`:t<.75?`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(s*.4).toFixed(1)}" fill="${c}" opacity=".8"/>`:`<path d="${starP(x,y,s*.9,s*.38,5,Math.PI*r())}" fill="${c}" opacity=".85"/>`}
 let rays='';for(let i=0;i<16;i++){const a=Math.PI*2*i/16,b=a+Math.PI/32;rays+=`<path d="M561 160L${(561+Math.cos(a)*300).toFixed(1)} ${(160+Math.sin(a)*300).toFixed(1)}L${(561+Math.cos(b)*300).toFixed(1)} ${(160+Math.sin(b)*300).toFixed(1)}Z" fill="#fff" opacity=".07"/>`}
 return`<svg class="ct-bg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>${gdef('wgA'+g,pl.g)}${gdef('wgG'+g,GOLD)}
 <linearGradient id="wbn${g}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#06194a"/><stop offset=".5" stop-color="#0d3a8a"/><stop offset="1" stop-color="#06194a"/></linearGradient>
 <radialGradient id="wbg${g}" cx="50%" cy="30%" r="80%"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e7f0ff"/></radialGradient></defs>
 <rect width="${W}" height="${H}" fill="url(#wbg${g})"/>${cf}
 <path d="M0 0H${W}V176Q561 262 0 176Z" fill="url(#wbn${g})"/>${rays}<path d="M0 186Q561 272 ${W} 186" fill="none" stroke="url(#wgG${g})" stroke-width="3.5"/>
 <path d="M0 ${H}V752Q280 706 561 752T${W} 752V${H}Z" fill="url(#wbn${g})"/><path d="M0 746Q280 700 561 746T${W} 746" fill="none" stroke="url(#wgG${g})" stroke-width="2.5"/>
 <rect x="12" y="12" width="${W-24}" height="${H-24}" rx="6" fill="none" stroke="url(#wgG${g})" stroke-width="4"/><rect x="22" y="22" width="${W-44}" height="${H-44}" rx="3" fill="none" stroke="#0d3a8a" stroke-opacity=".6" stroke-width="1"/>
 ${medalG('wgA'+g,pl.r1,pl.r2,1.25,561,160)}</svg>`};
ART.medal=(g)=>{let wv='';for(let i=0;i<44;i++){const y0=-10+i*19,A=9+((i*5)%8),k=.011+(i%5)*.0015,ph=i*.6;let d='';for(let x=0;x<=W;x+=14)d+=(x?'L':'M')+x+' '+(y0+A*Math.sin(k*x*3+ph)+A*.6*Math.sin(k*x*7-ph)).toFixed(1);wv+=`<path d="${d}" fill="none" stroke="${i%3?'#c6a04a':'#065f46'}" stroke-opacity="${i%3?.18:.08}" stroke-width=".8"/>`}
 const fan=(x,y,sx,sy)=>`<g transform="translate(${x} ${y}) scale(${sx} ${sy})"><path d="M0 76A76 76 0 0 0 76 0" fill="none" stroke="#065f46" stroke-width="3"/><path d="M0 60A60 60 0 0 0 60 0" fill="none" stroke="#d9a400" stroke-width="2"/><path d="M0 44A44 44 0 0 0 44 0" fill="none" stroke="#065f46" stroke-width="1.2"/><path d="M0 28A28 28 0 0 0 28 0" fill="none" stroke="#d9a400" stroke-width="1.2"/><circle cx="14" cy="14" r="5" fill="#d9a400"/></g>`;
 return`<svg class="ct-bg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>${gdef('mgG'+g,GOLD)}
 <radialGradient id="mbg${g}" cx="50%" cy="46%" r="75%"><stop offset="0" stop-color="#fffdf4"/><stop offset=".6" stop-color="#faf3dd"/><stop offset="1" stop-color="#ecdfb8"/></radialGradient></defs>
 <rect width="${W}" height="${H}" fill="url(#mbg${g})"/>${wv}
 <g opacity=".08">${laurel(561,410,235,15,'#065f46',100,262,12,30)}</g><circle cx="561" cy="410" r="190" fill="none" stroke="#065f46" stroke-opacity=".07" stroke-width="3"/>
 <rect x="8" y="8" width="${W-16}" height="${H-16}" rx="4" fill="none" stroke="#064e3b" stroke-width="14"/><rect x="25" y="25" width="${W-50}" height="${H-50}" fill="none" stroke="url(#mgG${g})" stroke-width="3"/><rect x="33" y="33" width="${W-66}" height="${H-66}" fill="none" stroke="#064e3b" stroke-width="1.2"/>
 ${fan(34,34,1,1)}${fan(W-34,34,-1,1)}${fan(34,H-34,1,-1)}${fan(W-34,H-34,-1,-1)}</svg>`};
ART.star=(g)=>`<svg class="ct-bg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>
 <linearGradient id="sgP${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#06194a"/><stop offset=".55" stop-color="#0a2c80"/><stop offset="1" stop-color="#1d6fe0"/></linearGradient>
 <linearGradient id="sgC${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0ea5e9"/><stop offset="1" stop-color="#2563eb"/></linearGradient>${gdef('sgG'+g,GOLD)}
 <linearGradient id="sgW${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#eef4ff"/></linearGradient></defs>
 <rect width="${W}" height="${H}" fill="url(#sgW${g})"/>
 <polygon points="1122,0 1122,150 970,0" fill="url(#sgC${g})" opacity=".9"/><polygon points="1122,0 1122,86 1036,0" fill="#ffd84a" opacity=".9"/>
 <polygon points="1122,793 1122,520 840,793" fill="url(#sgC${g})" opacity=".12"/><polygon points="1122,793 1122,640 950,793" fill="url(#sgC${g})" opacity=".9"/><polygon points="1122,793 1122,716 1030,793" fill="#ffd84a" opacity=".9"/>
 <path d="${starP(900,360,230,200,12,0)}" fill="none" stroke="#2563eb" stroke-opacity=".05" stroke-width="2"/>
 <polygon points="0,0 372,0 292,793 0,793" fill="url(#sgP${g})"/><polygon points="0,0 210,0 128,793 0,793" fill="#fff" opacity=".05"/>
 <polygon points="0,140 190,0 0,0" fill="#38bdf8" opacity=".18"/><polygon points="0,793 0,560 170,793" fill="#38bdf8" opacity=".16"/><polygon points="120,420 250,300 280,430" fill="#fff" opacity=".04"/>
 <line x1="372" y1="0" x2="292" y2="793" stroke="url(#sgG${g})" stroke-width="5"/><line x1="388" y1="0" x2="308" y2="793" stroke="#38bdf8" stroke-width="1.4" opacity=".7"/></svg>`;

/* ---------- الشهادة ---------- */
let _g=0;
function logoTag(safe,cls){
 const wm=cls==='ct-wmi',mono=wm?'':`<div class="${cls} mono">I</div>`;
 if(safe)return(typeof LOGO_SAFE!=='undefined'&&LOGO_SAFE)?`<img class="${cls}" src="${LOGO_SAFE}" alt="">`:mono;
 const src=(document.querySelector('.brand img')||{}).src;return src?`<img class="${cls}" src="${src}" alt="" onerror="${wm?"this.style.display='none'":"this.outerHTML='<div class=&quot;"+cls+" mono&quot;>I</div>'"}">`:mono}
function certHTML(s,o,safe){const e=namesOf(s),g=++_g,dz=PRE[o.design]?o.design:'royal',ph=(typeof PF!=='undefined'&&PF[s.id])||(typeof PH!=='undefined'&&PH[s.id]);
 const meta=[];if(o.showMeta){if(e.a)meta.push(E(e.a));meta.push('LEVEL '+s.level)}
 const body=fill(o.body,s,e),sig=o.signer?`<div class="ct-sg">${E(o.signer)}</div>`:'';
 const pl=placeOf(o);
 let art,seal;
 if(dz==='royal'){art=decor();seal=`<div class="ct-seal">${sealSVG(g)}<div class="s1">IDOS</div><div class="s2">★ ★ ★</div></div>`}
 else{art=ART[dz](g,o);
  seal=dz==='winner'?`<div class="ct-md"><b>${E(o.place||'1')}</b><small>${WORD[o.place]||'FIRST'} PLACE</small></div>`
   :dz==='star'?`<div class="ct-seal">${starBadge(g)}<div class="s1">IDOS</div><div class="s2">★ ★ ★</div></div>`
   :`<div class="ct-seal">${sealSVG(g,dz==='trophy'?PAL.black:EM)}<div class="s1">IDOS</div><div class="s2">★ ★ ★</div></div>`}
 return`<div class="ct th-${CT.theme==='black'?'k':'b'} d-${dz}"><div class="ct-in">${art}
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
  ${seal}
 </div></div>`}

/* ---------- CSS ---------- */
const css=`
.ct{position:relative;width:${W}px;height:${H}px;overflow:hidden;background:#fff;direction:ltr;text-align:center;color:#222;font-family:'Cormorant Garamond','Times New Roman',serif;-webkit-print-color-adjust:exact;print-color-adjust:exact;page:certland;page-break-after:always;break-after:page}
.ct *{box-sizing:border-box;margin:0}
.ct-in{position:absolute;left:0;top:0;right:0;bottom:0}.ct-bg{position:absolute;left:0;top:0}
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
.ct-md{display:none}

/* ===== كأس البطل ===== */
.ct.d-trophy{background:#0b0b0e}
.d-trophy .ct-lg{left:96px;top:74px;width:100px;height:100px;box-shadow:0 0 0 3px rgba(255,216,74,.25),0 4px 14px rgba(0,0,0,.6)}
.d-trophy .ct-ph{right:96px;top:72px;width:114px;height:114px;box-shadow:0 0 0 3px rgba(255,216,74,.25),0 4px 14px rgba(0,0,0,.6)}
.d-trophy .ct-org{left:281px;width:560px;top:208px;color:#ffd84a}
.d-trophy .ct-t1{left:231px;width:660px;top:224px;font-size:50px;color:#ffd84a;letter-spacing:12px;padding-left:12px}
.d-trophy .ct-t2{left:231px;width:660px;top:282px;font-size:21px;color:#fff;letter-spacing:9px}
.d-trophy .ct-dv{display:none}
.d-trophy .ct-pr{left:281px;width:560px;top:320px;font-size:22px;color:#d8cfae}
.d-trophy .ct-nm{left:200px;width:722px;top:346px;height:94px;color:#ffe36e;text-shadow:0 2px 12px rgba(255,216,74,.4)}
.d-trophy .ct-ul{left:330px;width:462px;top:442px}
.d-trophy .ct-mt{left:281px;width:560px;top:454px;color:#ffd84a}.d-trophy .ct-mt b{color:#ffe36e}
.d-trophy .ct-bd{left:261px;width:600px;top:488px;max-height:88px;font-size:21px;line-height:1.4;color:#e9e3cd}
.d-trophy .ct-sb .ln{background:#d9a400}.d-trophy .ct-sb .nm{color:#fff}.d-trophy .ct-sb .lb{color:#ffd84a}.d-trophy .ct-sb .v{color:#fff}.d-trophy .ct-sg{color:#ffe36e}
.d-trophy .ct-seal{left:910px;top:556px;transform:scale(.8)}

/* ===== الفائز (وينر) ===== */
.d-winner .ct-lg{left:68px;top:40px;width:100px;height:100px}
.d-winner .ct-ph{right:68px;top:36px;width:122px;height:122px}
.d-winner .ct-org{left:241px;width:640px;top:766px;color:#ffe36e;font-size:11px}
.d-winner .ct-t1{left:221px;width:680px;top:266px;font:800 70px/1.1 'Cinzel',serif;letter-spacing:16px;padding-left:16px;color:#0a2a66}
.d-winner .ct-t2{left:221px;width:680px;top:346px;font-size:20px;letter-spacing:8px;color:#b8860b}
.d-winner .ct-dv{display:none}
.d-winner .ct-pr{left:281px;width:560px;top:380px;font-size:22px}
.d-winner .ct-nm{left:230px;width:662px;top:402px;height:92px;color:#0a2a66}
.d-winner .ct-ul{left:361px;width:400px;top:496px}
.d-winner .ct-mt{left:281px;width:560px;top:508px}
.d-winner .ct-bd{left:271px;width:580px;top:536px;max-height:58px;font-size:20px;line-height:1.4}
.d-winner .ct-seal{display:none}
.d-winner .ct-md{position:absolute;left:481px;top:80px;width:160px;height:160px;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#ffe36e}
.d-winner .ct-md b{font:800 64px/1 'Cinzel',serif;color:#ffe36e;text-shadow:0 2px 6px rgba(0,0,0,.5)}
.d-winner .ct-md small{font:700 10.5px 'Cinzel',serif;letter-spacing:2px;color:#fff;margin-top:4px}

/* ===== الميدالية الزمردية ===== */
.ct.d-medal{background:#faf3dd}
.d-medal .ct-lg{left:104px;top:78px;width:104px;height:104px}.d-medal .ct-ph{right:100px;top:74px;width:122px;height:122px}
.d-medal .ct-org{color:#064e3b}
.d-medal .ct-t1{color:#064e3b}.d-medal .ct-t2{color:#a56f25}
.d-medal .ct-dv .k{background:#064e3b}
.d-medal .ct-pr{color:#4a4338}.d-medal .ct-nm{color:#064e3b}
.d-medal .ct-ul{background:linear-gradient(90deg,transparent,#064e3b 18%,#d9a400 50%,#064e3b 82%,transparent)}
.d-medal .ct-mt{color:#065f46}.d-medal .ct-bd{color:#3a352a}
.d-medal .ct-sb .ln{background:#064e3b}.d-medal .ct-sb .nm{color:#064e3b}.d-medal .ct-sb .lb{color:#a56f25}.d-medal .ct-sg{color:#064e3b}
.d-medal .ct-seal{left:910px;top:524px}

/* ===== النجم العصري ===== */
.d-star .ct-lg{left:116px;top:48px;width:112px;height:112px}
.d-star .ct-ph{left:78px;top:236px;right:auto;width:176px;height:176px}
.d-star .ct-org{left:410px;width:640px;top:52px;text-align:left;color:#0ea5e9;font-size:11.5px}
.d-star .ct-t1{left:410px;width:660px;top:74px;text-align:left;font:800 56px/1.1 'Montserrat','Cinzel',sans-serif;letter-spacing:4px;padding-left:0;color:#0a2a66}
.d-star .ct-t2{left:410px;width:660px;top:144px;text-align:left;font:700 21px 'Montserrat',sans-serif;letter-spacing:9px;padding-left:0;color:#0ea5e9}
.d-star .ct-dv{left:410px;width:300px;top:190px;justify-content:flex-start}.d-star .ct-dv .ln{width:90px}.d-star .ct-dv .ln.r{display:none}
.d-star .ct-pr{left:410px;width:660px;top:222px;text-align:left}
.d-star .ct-nm{left:402px;width:680px;top:246px;height:100px;justify-content:flex-start;color:#0a2a66}
.d-star .ct-ul{left:412px;width:420px;top:352px;background:linear-gradient(90deg,#0ea5e9,#2563eb 55%,transparent)}
.d-star .ct-mt{left:410px;width:660px;top:366px;justify-content:flex-start;color:#0a2a66}
.d-star .ct-bd{left:410px;width:650px;top:410px;max-height:100px;text-align:left}
.d-star .ct-s1{left:410px;width:200px}.d-star .ct-s2{left:640px;width:200px}.d-star .ct-s3{left:860px;width:230px}
.d-star .ct-seal{left:70px;top:520px;transform:none}
/* واجهة الصفحة */
#s-cert .ctlist{max-height:340px;overflow:auto;border:1px solid var(--line,#e7e2d3);border-radius:14px;background:#fff}
#s-cert .ctrow{display:flex;align-items:center;gap:10px;padding:8px 12px;border-bottom:1px solid #f0f1f8;cursor:pointer}#s-cert .ctrow:hover{background:#f6f7ff}
#s-cert .ctrow input[type=checkbox]{width:18px;height:18px;flex:none}#s-cert .ctrow .nmx{margin-right:auto;display:flex;flex-direction:column}#s-cert .ctrow small{color:#7a7566}
#s-cert .ctrow input.en{width:230px;direction:ltr;padding:6px 10px;border-radius:10px}
#s-cert .ctpv{overflow:hidden;border-radius:14px;border:1px solid var(--line,#e7e2d3);background:#eceefb;position:relative}#s-cert .ctpv .ct{position:absolute;right:0;top:0;transform-origin:top right;box-shadow:0 10px 30px rgba(0,0,0,.25)}
#s-cert textarea{width:100%;min-height:90px;direction:ltr;padding:10px 14px;border-radius:12px;border:1px solid var(--line,#e7e2d3);font:inherit}
#s-cert .chk{display:flex;align-items:center;gap:8px;font-weight:600}#s-cert .chk input{width:18px;height:18px}
#s-cert .dsg-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;margin-bottom:18px}
#s-cert .dsg{all:unset;cursor:pointer;box-sizing:border-box;display:flex;flex-direction:column;gap:6px;padding:10px;border:2px solid #e2e8f4;border-radius:14px;background:#fff;transition:.2s}
#s-cert .dsg:hover{transform:translateY(-3px);box-shadow:0 12px 24px -12px rgba(11,27,63,.4)}
#s-cert .dsg.on{border-color:#2563eb;box-shadow:0 0 0 4px rgba(37,99,235,.15)}
#s-cert .dsg-pv{position:relative;width:100%;aspect-ratio:${W}/${H};overflow:hidden;border-radius:8px;background:#eee}
#s-cert .dsg-in{position:absolute;left:0;top:0;transform-origin:0 0}
#s-cert .dsg b{font-size:14px}#s-cert .dsg small{color:#64748b;font-size:12px}
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
 <div class="card"><h2>٢) اختار التصميم والنص (بالإنجليزي)</h2>
  <label>التصميم</label><div class="dsg-grid" id="ctDsg"></div>
  <div class="grid">
   <div><label>اللون (للتصميم الملكي)</label><select id="ctTheme" onchange="CERT.set()"><option value="blue">أزرق ملكي + ذهبي</option><option value="black">أسود + ذهبي (ألوان اللوجو)</option></select></div>
   <div><label>المركز (للفائز وكأس البطل)</label><select id="ctPlace" onchange="CERT.set()"><option value="1">🥇 المركز الأول</option><option value="2">🥈 المركز الثاني</option><option value="3">🥉 المركز الثالث</option></select></div>
   <div><label>قالب نص جاهز</label><select id="ctTpl" onchange="CERT.tpl()"><option value="">— اختار —</option><option value="achievement">Achievement</option><option value="excellence">Excellence</option><option value="level">Level completion</option><option value="participation">Participation</option><option value="winner">Winner (يستخدم المركز)</option><option value="champion">Champion</option><option value="star">Star student</option></select></div>
   <div><label>العنوان</label><input id="ctTitle" dir="ltr" oninput="CERT.set()"></div>
   <div><label>السطر الفرعي</label><input id="ctSub" dir="ltr" oninput="CERT.set()"></div>
   <div><label>سطر التقديم</label><input id="ctPres" dir="ltr" oninput="CERT.set()"></div>
   <div><label>التاريخ</label><input id="ctDate" type="date" oninput="CERT.set()"></div>
   <div><label>اسم المعتمِد (بخط توقيع — اختياري)</label><input id="ctSigner" dir="ltr" oninput="CERT.set()"></div>
   <div><label>مسمّاه</label><input id="ctSignT" dir="ltr" oninput="CERT.set()"></div>
  </div>
  <div style="margin-top:12px"><label>نص الشهادة — تقدر تستخدم {name} {level} {academy} {place}</label><textarea id="ctBody" oninput="CERT.set()"></textarea></div>
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
function rename(id,v){const s=stuById(id);if(!s)return;s.nameEn=v.trim();save();preview();thumbs()}
function setFromUI(){const oldT=CT.theme,oldP=CT.place;
 CT.theme=$('ctTheme').value;CT.place=$('ctPlace').value;CT.title=$('ctTitle').value;CT.sub=$('ctSub').value;CT.presented=$('ctPres').value;CT.body=$('ctBody').value;CT.date=$('ctDate').value;CT.signer=$('ctSigner').value;CT.signerTitle=$('ctSignT').value;CT.showMeta=$('ctMeta').checked;CT.showTrainer=$('ctTrn').checked;CT.separate=$('ctSep').checked;saveCT();preview();if(oldT!==CT.theme||oldP!==CT.place)thumbs()}
function toUI(){$('ctTheme').value=CT.theme||'blue';$('ctPlace').value=CT.place||'1';$('ctTitle').value=CT.title;$('ctSub').value=CT.sub;$('ctPres').value=CT.presented;$('ctBody').value=CT.body;$('ctDate').value=CT.date||today();$('ctSigner').value=CT.signer;$('ctSignT').value=CT.signerTitle;$('ctMeta').checked=!!CT.showMeta;$('ctTrn').checked=!!CT.showTrainer;$('ctSep').checked=!!CT.separate}
function tpl(){const k=$('ctTpl').value;if(!k)return;$('ctBody').value=TPL[k];$('ctTpl').value='';setFromUI()}
function setDesign(k){if(!PRE[k])return;const p=PRE[k],bodies=Object.keys(TPL).map(x=>TPL[x]);
 CT.design=k;CT.title=p.title;CT.sub=p.sub;CT.presented=p.presented;if(!CT.body||bodies.includes(CT.body))CT.body=p.body;
 saveCT();toUI();thumbs();preview()}
function sample(){return chosen()[0]||DB.students[0]||{id:'sample',name:'طالب',nameEn:'Student Name',level:3}}
function thumbs(){const box=$('ctDsg');if(!box)return;const s=sample();
 box.innerHTML=DESIGNS.map(d=>`<button class="dsg ${CT.design===d.k?'on':''}" onclick="CERT.design('${d.k}')"><div class="dsg-pv"><div class="dsg-in">${certHTML(s,Object.assign(opts(),{design:d.k}),false)}</div></div><b>${d.n}</b><small>${d.d}</small></button>`).join('');
 requestAnimationFrame(()=>box.querySelectorAll('.dsg-pv').forEach(pv=>{const sc=(pv.clientWidth||200)/W;pv.querySelector('.dsg-in').style.transform=`scale(${sc})`}))}
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
function render(){fillSel();toUI();list();thumbs();setTimeout(preview,60)}
window.addEventListener('resize',()=>{if(section.classList.contains('on'))preview()});
window.CERT={render,list,all,pick,rename,set:setFromUI,tpl,design:setDesign,pdf,print,html:certHTML,opts,sel:SEL};
})();
