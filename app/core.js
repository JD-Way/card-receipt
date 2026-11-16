function CardReceipt(env){
var KEY='cardReceipt.v1',SKEY='cardReceipt.saved.v1',IKEY='cardReceipt.inventory.v1',GKEY='cardReceipt.settings.v1';
var dock=env.mode==='dock';

var CSS=':host{all:initial;'+(dock?'display:block;height:100%':'')+'}*{box-sizing:border-box;font-family:system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}'+
'.panel{display:flex;flex-direction:column;overflow:hidden;background:var(--bg);color:var(--ink);font-size:15px;line-height:1.4}'+
'.panel.float{position:fixed;top:12px;right:12px;bottom:12px;width:384px;max-width:calc(100vw - 24px);border:1px solid var(--line);border-radius:14px;box-shadow:0 18px 50px rgba(20,24,36,.32);z-index:2147483647}'+
'.panel.dock{height:100%;width:100%;border-left:1px solid var(--line)}'+
'.hd{display:flex;align-items:center;gap:6px;padding:12px 12px 8px;flex:none}'+
'.tabs{display:flex;gap:3px;flex:1;min-width:0;background:var(--soft);border-radius:10px;padding:3px}'+
'.tab{flex:1 1 auto;min-width:0;border:0;background:transparent;border-radius:8px;padding:7px 6px;font-size:14px;font-weight:650;color:var(--mut);cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'+
'.tab[aria-selected="true"]{background:var(--bg);color:var(--ink);box-shadow:0 1px 2px rgba(20,24,36,.18)}'+
'.cnt{margin-left:5px;color:var(--acc);font-variant-numeric:tabular-nums}.cnt:empty{display:none}'+
'.ib{border:0;background:var(--soft);color:var(--ink);width:36px;height:36px;border-radius:9px;font-size:19px;line-height:1;cursor:pointer;flex:none;display:grid;place-items:center;padding:0}'+
'.ib.on{background:var(--acc-soft);color:var(--acc)}.ib svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round}'+
'.st{margin:0 14px 6px;font-size:12.5px;color:var(--mut);flex:none}.st:empty{display:none}.st.dirty{color:var(--warn)}'+
'.vw{display:flex;flex-direction:column;flex:1;min-height:0}'+
'.add{margin:0 14px;padding:12px;border:0;border-radius:11px;background:var(--acc);color:var(--acc-ink);font-size:16px;font-weight:700;cursor:pointer;flex:none}.add:active{transform:translateY(1px)}'+
'.scan{display:flex;gap:6px;margin:8px 14px 0;flex:none}.scan input{flex:1;min-width:0;font-size:15px}'+
'.tb2{border:1px solid var(--fb);background:var(--field);color:var(--ink);border-radius:8px;padding:0 12px;font-size:14px;font-weight:650;cursor:pointer;white-space:nowrap;flex:none;min-height:36px}'+
'.msg{margin:8px 14px 0;font-size:13.5px;padding:8px 10px;border-radius:8px;flex:none}.msg:empty{display:none}.msg.ok{background:var(--ok-bg);color:var(--ok)}.msg.warn{background:var(--warn-bg);color:var(--warn)}'+
'.ma{display:flex;gap:6px;flex-wrap:wrap;margin-top:7px}.ma button{border:1px solid currentColor;background:transparent;color:inherit;border-radius:8px;padding:6px 10px;font-size:13.5px;font-weight:650;cursor:pointer}.ma button.pri{background:var(--acc);border-color:var(--acc);color:var(--acc-ink)}'+
'.list,.slist,.ilist{list-style:none;margin:8px 0 0;padding:0 14px 14px;overflow-y:auto;flex:1;min-height:0}.empty,.more{color:var(--mut);font-size:14px;padding:16px 2px}.more{font-size:13px;padding:10px 2px}'+
'.it,.sr,.ir{border-top:1px solid var(--line2);padding:12px 0}.it:first-child,.sr:first-child,.ir:first-child{border-top:0}.top{display:flex;gap:8px;align-items:flex-start}'+
'.nm{flex:1;min-width:0;font-weight:650;overflow-wrap:anywhere}.lk{display:block;color:var(--acc);font-weight:500;font-size:12.5px;margin-top:2px;text-decoration:none;cursor:pointer}.lk:hover{text-decoration:underline}'+
'.x{border:0;background:none;color:var(--mut);font-size:22px;line-height:1;cursor:pointer;padding:0 4px}'+
'.meta{font-size:13px;color:var(--mut);margin-top:3px;display:flex;flex-wrap:wrap;gap:2px 12px}.meta .lo{color:var(--warn);font-weight:650}.bc{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:12.5px}'+
'.ref{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}.chip{flex:1 1 calc(50% - 6px);border:1px solid var(--line);background:var(--field);border-radius:9px;padding:6px 8px;text-align:left;font-size:12px;color:var(--mut);cursor:pointer}'+
'.chip b{display:block;font-size:15px;color:var(--ink);font-variant-numeric:tabular-nums}.chip.on{border-color:var(--acc);box-shadow:inset 0 0 0 1px var(--acc);background:var(--acc-soft)}.chip:disabled{opacity:.5;cursor:default}'+
'.row{display:flex;gap:8px;align-items:flex-end;margin-top:8px}label{font-size:12px;color:var(--mut);display:flex;flex-direction:column;gap:3px}'+
'input,select{font:inherit;font-size:16px;border:1px solid var(--fb);border-radius:8px;padding:7px 9px;color:var(--ink);background:var(--field);width:100%;min-width:0}.pr{width:112px}.qt{width:64px}'+
'.lt{margin-left:auto;font-weight:700;font-variant-numeric:tabular-nums;padding-bottom:8px}.note{margin-top:8px}.adj{display:block;margin-top:6px;font-size:12.5px;color:var(--warn)}'+
'.ft{position:relative;background:var(--ft);padding:14px 14px 14px;flex:none}.ft:before{content:"";position:absolute;left:0;right:0;top:-6px;height:6px;background:radial-gradient(circle at 6px 0,transparent 5px,var(--ft) 5.5px) 0 0/12px 6px repeat-x}'+
'summary{cursor:pointer;font-size:13.5px;color:var(--mut)}.det{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px}.wide{grid-column:1/-1}'+
'.chk{display:grid;grid-template-columns:1fr 1fr;gap:8px 10px;margin-top:8px}label.c{flex-direction:row;align-items:center;gap:8px;font-size:14px;color:var(--ink);cursor:pointer}label.c input{width:20px;height:20px;padding:0;margin:0;accent-color:var(--acc);flex:none}details+details{margin-top:8px}'+
'.chk select{font-size:15px}'+
'.tot{display:flex;justify-content:space-between;align-items:baseline;margin:10px 0 12px}.tot span{font-size:14px;color:var(--mut)}.tot b{font-size:26px;font-weight:800;font-variant-numeric:tabular-nums}'+
'.acts{display:flex;gap:6px;flex-wrap:wrap}.pbtn{flex:1;padding:12px 4px;border-radius:10px;border:0;background:var(--btn);color:var(--btn-ink);font-weight:700;font-size:15px;cursor:pointer}.pbtn.sv{background:var(--acc);color:var(--acc-ink)}'+
'.cbtn,.sec{padding:11px 12px;border-radius:10px;border:1px solid var(--fb);background:var(--field);color:var(--ink);font-size:15px;cursor:pointer}.sec{flex:1 1 auto;font-weight:650;font-size:14px}'+
'.srch{margin:2px 14px 0;width:auto;flex:none}'+
'.srt{display:flex;gap:10px;align-items:baseline}.srt b{flex:1;min-width:0;font-weight:650;overflow-wrap:anywhere}.srt span{font-weight:700;font-variant-numeric:tabular-nums}'+
'.srm{font-size:13px;color:var(--mut);margin-top:2px}.src{font-size:12.5px;color:var(--mut);margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'+
'.sra{display:flex;gap:6px;margin-top:8px;align-items:center;flex-wrap:wrap}.sbtn{border:0;border-radius:9px;padding:8px 14px;background:var(--acc);color:var(--acc-ink);font-weight:700;font-size:14px;cursor:pointer}'+
'.sdel{border:1px solid var(--fb);border-radius:9px;padding:7px 11px;background:var(--field);color:var(--ink);font-size:14px;cursor:pointer}.now{font-size:12.5px;color:var(--ok);font-weight:650;margin-left:auto}'+
'.ifm{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:12px;margin:8px 0;border:1px solid var(--line);border-radius:12px;background:var(--ft)}.ifrm .ifm{margin:8px 14px 0}'+
'.ifm h4{margin:0;font-size:15px;color:var(--ink)}.bcrow{display:flex;gap:6px}.bcrow input{flex:1}.pa{font-size:12px;color:var(--mut)}.fa{display:flex;gap:8px;margin-top:4px}'+
'.isum{font-size:13px;color:var(--mut);margin-bottom:10px;font-variant-numeric:tabular-nums}'+
'.gs{overflow-y:auto;flex:1;min-height:0;padding:4px 14px 16px;display:flex;flex-direction:column;gap:18px}.gs section{display:flex;flex-direction:column;gap:10px}'+
'.gs h3{margin:0;font-size:13px;letter-spacing:.06em;text-transform:uppercase;color:var(--mut)}.hint{margin:0;font-size:13px;color:var(--mut)}'+
'.lrow{display:flex;gap:12px;align-items:center}.lbox{width:120px;height:64px;flex:none;border:1px dashed var(--fb);border-radius:10px;display:grid;place-items:center;background:#fff;overflow:hidden;color:#5D6475;font-size:12.5px}.lbox img{max-width:100%;max-height:100%;object-fit:contain}'+
'.lbtn{display:flex;flex-direction:column;gap:6px;flex:1}'+
'.sw{display:flex;flex-wrap:wrap;gap:8px}.swb{width:40px;height:40px;border-radius:50%;border:2px solid var(--bg);box-shadow:0 0 0 1px var(--fb);cursor:pointer;padding:0}.swb[aria-checked="true"]{box-shadow:0 0 0 2px var(--ink)}'+
'.arm{background:var(--danger)!important;border-color:var(--danger)!important;color:#fff!important;font-weight:700}'+
'button:focus-visible,input:focus-visible,select:focus-visible,a:focus-visible,summary:focus-visible{outline:2px solid var(--acc);outline-offset:2px}'+
'.pill{position:fixed;right:12px;bottom:12px;display:flex;gap:4px;background:var(--btn);padding:5px;border-radius:999px;box-shadow:0 10px 30px rgba(20,24,36,.35);z-index:2147483647}'+
'.pill button{border:0;border-radius:999px;padding:11px 15px;font-weight:700;font-size:14px;cursor:pointer;font-variant-numeric:tabular-nums}.pill .pa2{background:var(--acc);color:var(--acc-ink)}.pill .po{background:transparent;color:var(--btn-ink)}'+
'[hidden]{display:none!important}'+
'@media (max-width:640px){.panel.float{top:auto;left:0;right:0;bottom:0;width:auto;max-width:none;height:86vh;border-radius:16px 16px 0 0;padding-bottom:env(safe-area-inset-bottom,0px)}.pill{bottom:calc(12px + env(safe-area-inset-bottom,0px))}}'+
'@media (prefers-reduced-motion:no-preference){.panel.float{animation:crin .18s ease-out}@keyframes crin{from{transform:translateY(12px);opacity:0}}}';

var PCSS='body{font-family:system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;color:#1E2230;background:#fff;margin:0;padding:24px}main{max-width:680px;margin:0 auto}'+
'.lg{display:block;max-width:260px;max-height:90px;object-fit:contain;margin:0 0 10px}'+
'h1{font-size:24px;margin:0 0 4px}header p{margin:2px 0;color:#5D6475;font-size:14px}table{width:100%;border-collapse:collapse;margin-top:18px;font-size:14px}'+
'th{text-align:left;border-bottom:2px solid #1E2230;padding:6px 4px;font-size:12px;color:#5D6475}td{border-bottom:1px solid #D6DAE2;padding:8px 4px;vertical-align:top}'+
'td.n,th.n{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}.s{color:#5D6475;font-size:12.5px;margin-top:2px}.no{font-size:12.5px;margin-top:3px;font-style:italic}'+
'.u{font-size:11px;margin-top:3px;word-break:break-all}.u a{color:#1E2230}.tot{display:flex;justify-content:space-between;font-size:20px;font-weight:800;margin-top:14px;padding-top:8px;border-top:2px solid #1E2230}'+
'.f{color:#5D6475;font-size:12px;margin-top:18px}#p{margin-top:18px;padding:12px 20px;font-size:16px;font-weight:700;border:0;border-radius:10px;background:#1E2230;color:#fff;cursor:pointer}@media print{#p{display:none}body{padding:0}}';

var P=[['market','Market Price'],['median','Listed Median'],['listing','Listing price'],['recent','Most Recent Sale'],['low','Low Sale Price'],['high','High Sale Price']];
var REFS=P.map(function(p){return p[0];});
var CONDS=['Near Mint','Lightly Played','Moderately Played','Heavily Played','Damaged','Near Mint Foil','Lightly Played Foil','Moderately Played Foil','Heavily Played Foil','Damaged Foil','Sealed'];
var LABELS=[['sheet','Letter sheet, 30 per page (Avery 5160)'],['roll','Label roll, 2.25 x 1.25 in'],['dymo','Label roll, 2.125 x 1 in (Dymo 30336)']];
var COLORS=[['purple','Purple','#5B2DC9','#9C7BF2'],['blue','Blue','#1F5FBF','#6EA4F2'],['teal','Teal','#0F766E','#4FC7BB'],['green','Green','#1E7A46','#5CC48F'],['orange','Orange','#B85400','#F5A25A'],['red','Red','#B3261E','#F2827A'],['charcoal','Charcoal','#2F3542','#C3C8D4']];
var LIGHT={bg:'#FFFFFF',ink:'#1E2230',mut:'#5D6475',line:'#D6DAE2',line2:'#E3E6EC',fb:'#C9CED8',field:'#FFFFFF',soft:'#EEF0F4',ft:'#F4F5F8','ok-bg':'#E6F3EC',ok:'#1F5E3E','warn-bg':'#FBEDE6',warn:'#8A3517',danger:'#A8431F',btn:'#1E2230','btn-ink':'#FFFFFF'};
var DARK={bg:'#1B1F2B',ink:'#E8EAF0',mut:'#A3A9B8',line:'#323848',line2:'#2A3040',fb:'#3E4558',field:'#12151E',soft:'#262B39',ft:'#151924','ok-bg':'#173326',ok:'#8FDDB4','warn-bg':'#3A2119',warn:'#F2A584',danger:'#C4532A',btn:'#E8EAF0','btn-ink':'#12151E'};
var C128=['212222','222122','222221','121223','121322','131222','122213','122312','132212','221213','221312','231212','112232','122132','122231','113222','123122','123221','223211','221132','221231','213212','223112','312131','311222','321122','321221','312212','322112','322211','212123','212321','232121','111323','131123','131321','112313','132113','132311','211313','231113','231311','112133','112331','132131','113123','113321','133121','313121','211331','231131','213113','213311','213131','311123','311321','331121','312113','312311','332111','314111','221411','431111','111224','111422','121124','121421','141122','141221','112214','112412','122114','122411','142112','142211','241211','221114','413111','241112','134111','111242','121142','121241','114212','124112','124211','411212','421112','421211','212141','214121','412121','111143','111341','131141','114113','114311','411113','411311','113141','114131','311141','411131','211412','211214','211232','2331112'];

/* ---------- storage ---------- */
var store=env.store,storeWarned=false;
function put(k,v){var ok;try{ok=store.set(k,v);}catch(e){ok=false;}
if(ok===false){if(!storeWarned){storeWarned=true;msg('This device couldn’t save your changes. Its storage may be full. Use Back up all data in Settings to keep a copy.','warn');}return false;}
storeWarned=false;return true;}
function load(){var v=store.get(KEY);if(!v||!Array.isArray(v.items))v={customer:'',items:[]};return v;}
var S=load();
function loadSettings(){var g=store.get(GKEY);if(!g||typeof g!=='object'){g={shop:S.shop||'',show:S.show||null,links:!!S.links};}
if(!g.show)g.show={market:true,median:true};if(!g.start)g.start='median';if(g.stockOnSave==null)g.stockOnSave=true;if(!g.label)g.label='sheet';
if(!g.theme)g.theme={color:'purple',mode:'light'};return g;}
var G=loadSettings();
var SAVED=store.get(SKEY);if(!Array.isArray(SAVED))SAVED=[];
function loadInv(){var v=store.get(IKEY);if(!v||!Array.isArray(v.items))v={items:[],next:1};if(!(v.next>0))v.next=1;return v;}
var INV=loadInv();
function save(){put(KEY,S);}
function saveSettings(){put(GKEY,G);}
function saveList(){put(SKEY,SAVED);}
function saveInv(){put(IKEY,INV);}
function changed(){S.dirty=true;save();status();}

/* ---------- helpers ---------- */
function shown(){return P.filter(function(p){return G.show[p[0]];});}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function fmt(n){return(n==null||isNaN(n))?'n/a':'$'+Number(n).toFixed(2);}
function money2(n){return'$'+Number(n||0).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});}
function num(v){if(typeof v==='number')return isNaN(v)?null:v;var n=parseFloat(String(v==null?'':v).replace(/[^0-9.]/g,''));return isNaN(n)?null:Math.round(n*100)/100;}
function same(a,b){return a!=null&&b!=null&&Math.abs(a-b)<0.005;}
function line(it){return(it.price||0)*(it.qty||1);}
function total(items){var s=0;items.forEach(function(it){s+=line(it);});return s;}
function count(items){var q=0;items.forEach(function(it){q+=(it.qty||1);});return q;}
function cards(q){return q+(q===1?' card':' cards');}
function when(iso){var d=new Date(iso);return isNaN(d)?'':d.toLocaleString([],{month:'short',day:'numeric',year:'numeric',hour:'numeric',minute:'2-digit'});}
function today(){var d=new Date();return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2);}
function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,6);}
function copyItems(a){return JSON.parse(JSON.stringify(a||[]));}
function avgParts(it){return shown().map(function(p){return it[p[0]];}).filter(function(x){return x!=null&&!isNaN(x);});}
function avgOf(it){var v=avgParts(it);if(!v.length)return null;var s=0;v.forEach(function(x){s+=x;});return Math.round(s/v.length*100)/100;}
function refVal(it,k){return k==='avg'?avgOf(it):it[k];}
function chipList(it){var c=shown().slice();if(G.avg){var n=avgParts(it).length;c.push(['avg','Average'+(n>1?' of '+n:'')]);}return c;}
function startPrice(d){var p=G.start==='market'?d.market:G.start==='avg'?avgOf(d):d.median;if(p==null)p=d.median!=null?d.median:d.market!=null?d.market:avgOf(d);return p==null?null:p;}
function refLine(it){var r=shown().filter(function(p){return it[p[0]]!=null;}).map(function(p){return p[1]+' '+fmt(it[p[0]]);});
if(G.avg){var a=avgOf(it),n=avgParts(it).length;if(a!=null&&n>1)r.push('Average '+fmt(a));}return r.join(', ');}
function normCode(c){return String(c==null?'':c).trim().toUpperCase();}
function okCode(c){return /^[\x20-\x7e]{1,48}$/.test(c);}
function okUrl(u){return /^https:\/\/[^\s"'<>]+$/i.test(u||'');}
function findInv(id){for(var k=0;k<INV.items.length;k++)if(INV.items[k].id===id)return INV.items[k];return null;}
function findCode(c){c=normCode(c);if(!c)return null;for(var k=0;k<INV.items.length;k++)if(normCode(INV.items[k].code)===c)return INV.items[k];return null;}
function newCode(){var c;do{c='CR'+('00000'+(INV.next++)).slice(-6);}while(findCode(c));return c;}
function find(id){for(var k=0;k<S.items.length;k++)if(S.items[k].id===id)return S.items[k];return null;}
function findSaved(id){for(var k=0;k<SAVED.length;k++)if(SAVED[k].id===id)return SAVED[k];return null;}
function nextNo(){var m=1000;SAVED.forEach(function(r){if(r.no>m)m=r.no;});return m+1;}

/* ---------- Code 128 barcodes ---------- */
function c128(s){
s=String(s==null?'':s);if(!okCode(s))return null;
var codes=[],i,pre=s,dig='',m;
if(/^\d+$/.test(s)&&s.length%2===0){codes.push(105);for(i=0;i<s.length;i+=2)codes.push(+s.substr(i,2));}
else{
m=s.match(/^(.*?)(\d{4,})$/);
if(m){var d=m[2];if(d.length%2){pre=m[1]+d.charAt(0);dig=d.slice(1);}else{pre=m[1];dig=d;}}
codes.push(104);for(i=0;i<pre.length;i++)codes.push(pre.charCodeAt(i)-32);
if(dig){codes.push(99);for(i=0;i<dig.length;i+=2)codes.push(+dig.substr(i,2));}
}
var sum=codes[0];for(i=1;i<codes.length;i++)sum+=codes[i]*i;
codes.push(sum%103);codes.push(106);
return codes.map(function(c){return C128[c];}).join('');
}
function barSvg(code){var w=c128(code);if(!w)return'';var x=10,r='',i,n;
for(i=0;i<w.length;i++){n=+w.charAt(i);if(i%2===0)r+='<rect x="'+x+'" y="0" width="'+n+'" height="1"/>';x+=n;}
return'<svg class="bars" viewBox="0 0 '+(x+10)+' 1" preserveAspectRatio="none" shape-rendering="crispEdges" aria-hidden="true">'+r+'</svg>';}

/* ---------- TCGplayer page reading ---------- */
function parseText(t){
t=String(t||'').replace(/ /g,' ').replace(/\r/g,'');
function money(label){var m=t.match(new RegExp(label+'[\\s:]*\\$\\s?([0-9][0-9,]*(?:\\.[0-9]{1,2})?)','i'));return m?parseFloat(m[1].replace(/,/g,'')):null;}
function field(label){var m=t.match(new RegExp(label+':[ \\t]*\\n?[ \\t]*([^\\n]+)','i'));return m?m[1].trim():'';}
function listing(){var m=t.match(/\$\s?([0-9][0-9,]*\.[0-9]{2})\s*(?:\+\s*\$[0-9][0-9,]*\.[0-9]{2}\s*)?(?:Free\s+)?Shipping/i);return m?parseFloat(m[1].replace(/,/g,'')):null;}
var CR=/(Near Mint|Lightly Played|Moderately Played|Heavily Played|Damaged|Unopened)[^\n$]{0,30}/i;
var cond='',i=t.search(/Price Points/i),j=t.search(/Market Price[\s:]*\$/i);
if(i>-1&&j>i){var cm=t.slice(i,j).match(CR);if(cm)cond=cm[0].trim();}
if(!cond){var c2=t.match(CR);if(c2)cond=c2[0].trim();}
return{condition:cond,number:field('Number'),rarity:field('Rarity'),market:money('Market Price'),median:money('Listed Median'),recent:money('Most Recent Sale'),low:money('Low Sale Price'),high:money('High Sale Price'),listing:listing()};
}
function applyCss(rootNode,doc,css){
try{var sh=new doc.defaultView.CSSStyleSheet();sh.replaceSync(css);rootNode.adoptedStyleSheets=[sh];}
catch(e){var st=doc.createElement('style');st.textContent=css;(rootNode.head||rootNode).appendChild(st);}
}

/* ---------- markup ---------- */
var GEAR='<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 5h8M15 5h2M3 10h2M9 10h8M3 15h10M17 15h0"/><circle cx="13" cy="5" r="2"/><circle cx="7" cy="10" r="2"/><circle cx="15" cy="15" r="2"/></svg>';
var host=document.createElement('div');host.id=env.hostId||'card-receipt-host';
if(!dock)host.style.cssText='position:fixed;top:0;left:0;width:0;height:0;z-index:2147483647';
else host.style.cssText='display:block;height:100%';
env.mount.appendChild(host);
var R=host.attachShadow({mode:'open'});
function opts(list,cur){return list.map(function(o){return'<option value="'+o[0]+'"'+(o[0]===cur?' selected':'')+'>'+esc(o[1])+'</option>';}).join('');}
R.innerHTML='<div class="panel '+(dock?'dock':'float')+'" role="'+(dock?'region':'dialog')+'" aria-label="Card receipt">'+
'<div class="hd"><div class="tabs" role="tablist" aria-label="Sections">'+
'<button class="tab" role="tab" data-act="tab" data-tab="receipt">Receipt<span class="cnt" data-c="receipt"></span></button>'+
'<button class="tab" role="tab" data-act="tab" data-tab="inventory">Inventory</button>'+
'<button class="tab" role="tab" data-act="tab" data-tab="saved">Saved<span class="cnt" data-c="saved"></span></button></div>'+
'<button class="ib gear" data-act="tab" data-tab="settings" aria-label="Settings" title="Settings">'+GEAR+'</button>'+
(dock?'':'<button class="ib" data-act="min" aria-label="Minimize" title="Minimize">&#8211;</button><button class="ib" data-act="close" aria-label="Close" title="Close">&#215;</button>')+'</div>'+
'<div class="st" role="status"></div>'+
/* receipt */
'<div class="vw vr"><button class="add" data-act="add">Add this card</button>'+
'<div class="scan"><input class="code" data-scan="receipt" placeholder="Scan or type a barcode" aria-label="Barcode" autocomplete="off" autocapitalize="characters" spellcheck="false" enterkeyhint="go"><button class="tb2" data-act="scango">Add</button></div>'+
'<div class="msg" role="status"></div><ul class="list"></ul>'+
'<div class="ft"><details><summary>Prices and links</summary><div class="chk">'+P.map(function(p){return'<label class="c"><input type="checkbox" data-s="'+p[0]+'">'+p[1]+'</label>';}).join('')+
'<label class="c wide"><input type="checkbox" data-gb="avg">Average of checked prices</label>'+
'<label class="c wide"><input type="checkbox" data-gb="links">Card links on receipt</label>'+
'<label class="wide">Starting price for new cards<select data-gs="start">'+opts([['median','Listed Median'],['market','Market Price'],['avg','Average of checked prices']],G.start)+'</select></label></div></details>'+
'<details><summary>Customer</summary><div class="det"><label class="wide">Customer name<input data-r="customer" autocomplete="off"></label><label class="wide">Customer email<input data-r="email" type="email" inputmode="email" autocomplete="off" placeholder="Optional"></label></div></details>'+
'<div class="tot"><span>Total</span><b class="sum">$0.00</b></div>'+
'<div class="acts"><button class="pbtn sv" data-act="save">Save</button><button class="pbtn" data-act="print">Print</button><button class="pbtn" data-act="email">Email</button><button class="cbtn" data-act="clear">Clear</button></div></div></div>'+
/* inventory */
'<div class="vw vi" hidden><button class="add" data-act="iadd">Add this card to inventory</button>'+
'<div class="scan"><input class="isrch" type="search" data-scan="inventory" placeholder="Search or scan inventory" aria-label="Search inventory" autocomplete="off" spellcheck="false" enterkeyhint="search"><button class="tb2" data-act="inew">New item</button></div>'+
'<div class="msg" role="status"></div><div class="ifrm"></div><ul class="ilist"></ul>'+
'<div class="ft"><div class="isum"></div><div class="acts"><button class="sec" data-act="labels">Print labels</button><button class="sec" data-act="iexport">Export CSV</button><button class="sec" data-act="iimport">Import CSV</button></div></div></div>'+
/* saved */
'<div class="vw vs" hidden><input class="srch" type="search" placeholder="Search by customer, card or receipt number" aria-label="Search saved receipts"><div class="msg" role="status"></div><ul class="slist"></ul></div>'+
/* settings */
'<div class="vw vg" hidden><div class="msg" role="status"></div><div class="gs">'+
'<section><h3>Shop</h3><label>Shop name<input data-g="shop" autocomplete="off" placeholder="Prints at the top of receipts"></label>'+
'<div class="lrow"><div class="lbox"><img class="lprev" alt="Shop logo" hidden><span class="lnone">No logo</span></div><div class="lbtn"><button class="sec" data-act="logo">Upload logo</button><button class="sec" data-act="logorm">Remove logo</button></div></div>'+
'<p class="hint">The logo prints at the top of each receipt. PNG or JPG files work best.</p></section>'+
'<section><h3>Colors</h3><div class="sw" role="radiogroup" aria-label="Color">'+COLORS.map(function(c){return'<button class="swb" role="radio" data-act="color" data-color="'+c[0]+'" aria-label="'+c[1]+'" title="'+c[1]+'" aria-checked="false"></button>';}).join('')+'</div>'+
'<label>Appearance<select data-gt="mode">'+opts([['light','Light'],['dark','Dark'],['system','Match this device']],G.theme.mode)+'</select></label></section>'+
'<section><h3>Inventory and labels</h3><label class="c"><input type="checkbox" data-gb="stockOnSave">Take sold cards out of stock when a receipt is saved</label>'+
'<label>Label size<select data-gs="label">'+opts(LABELS,G.label)+'</select></label>'+
'<label class="c"><input type="checkbox" data-gb="labelPerStock">Print one label for each card in stock</label>'+
'<p class="hint">Barcode scanners that plug in or connect by Bluetooth work like a keyboard. Click the barcode box, then scan.</p></section>'+
'<section><h3>Backup</h3><p class="hint">Keep a copy of your receipts, inventory and settings in one file. Restore it on this or another device.</p>'+
'<div class="acts"><button class="sec" data-act="backup">Back up all data</button><button class="sec" data-act="restore">Restore backup</button></div></section>'+
'</div></div>'+
'<datalist id="cr-conds">'+CONDS.map(function(c){return'<option value="'+esc(c)+'"></option>';}).join('')+'</datalist>'+
'<input type="file" class="fin" hidden tabindex="-1" aria-hidden="true">'+
'</div>'+
(dock?'':'<div class="pill" hidden><button class="pa2" data-act="add">Add this card</button><button class="po" data-act="open">Receipt <span class="psum"></span></button></div>');
applyCss(R,document,CSS);
var $=function(s){return R.querySelector(s);};
var panel=$('.panel'),pill=$('.pill'),list=$('.list'),slist=$('.slist'),ilist=$('.ilist'),ifrm=$('.ifrm');
var VIEWS={receipt:$('.vr'),inventory:$('.vi'),saved:$('.vs'),settings:$('.vg')};
var view='receipt',EDIT=null,lastUnknown='',PEND=null;

/* ---------- theme ---------- */
var mq=window.matchMedia?window.matchMedia('(prefers-color-scheme: dark)'):null;
function isDark(){var m=G.theme.mode;return m==='dark'||(m==='system'&&!!(mq&&mq.matches));}
function mix(a,b,t){function p(h){h=h.replace('#','');return[0,2,4].map(function(i){return parseInt(h.substr(i,2),16);});}
var x=p(a),y=p(b);return'#'+x.map(function(v,i){return('0'+Math.round(v*t+y[i]*(1-t)).toString(16)).slice(-2);}).join('');}
function colorOf(k){for(var i=0;i<COLORS.length;i++)if(COLORS[i][0]===k)return COLORS[i];return COLORS[0];}
function themeVars(){var dark=isDark(),c=colorOf(G.theme.color),base=dark?DARK:LIGHT,v={},k;for(k in base)v[k]=base[k];
v.acc=dark?c[3]:c[2];v['acc-ink']=dark?'#12151E':'#FFFFFF';v['acc-soft']=mix(v.acc,v.bg,dark?0.22:0.1);return v;}
function applyTheme(){var v=themeVars(),dark=isDark(),k;
[panel,pill].forEach(function(el){if(!el)return;for(k in v)el.style.setProperty('--'+k,v[k]);el.style.colorScheme=dark?'dark':'light';});
Array.prototype.forEach.call(R.querySelectorAll('.swb'),function(b){var c=colorOf(b.dataset.color);b.style.background=dark?c[3]:c[2];b.setAttribute('aria-checked',String(b.dataset.color===G.theme.color));});
if(env.onTheme){try{env.onTheme(v,dark);}catch(e){}}}
if(mq){var onMq=function(){if(G.theme.mode==='system')applyTheme();};if(mq.addEventListener)mq.addEventListener('change',onMq);else if(mq.addListener)mq.addListener(onMq);}

/* ---------- settings sync ---------- */
function syncSettings(){
Array.prototype.forEach.call(R.querySelectorAll('[data-s]'),function(el){el.checked=!!G.show[el.dataset.s];});
Array.prototype.forEach.call(R.querySelectorAll('[data-gb]'),function(el){el.checked=!!G[el.dataset.gb];});
Array.prototype.forEach.call(R.querySelectorAll('[data-gs]'),function(el){el.value=G[el.dataset.gs];});
$('[data-gt="mode"]').value=G.theme.mode;$('[data-g="shop"]').value=G.shop||'';
syncLogo();applyTheme();}
function syncLogo(){var im=$('.lprev'),no=$('.lnone');if(G.logo){im.src=G.logo;im.hidden=false;no.hidden=true;}else{im.removeAttribute('src');im.hidden=true;no.hidden=false;}}
function fillFields(){$('[data-r="customer"]').value=S.customer||'';$('[data-r="email"]').value=S.email||'';}

/* ---------- messages and confirmations ---------- */
var msgT;
function msg(text,kind,actions){var el=VIEWS[view].querySelector('.msg');R.querySelectorAll('.msg').forEach(function(m){m.textContent='';m.className='msg';});
el.className='msg '+(kind||'');el.textContent=text||'';
if(actions&&actions.length){var d=document.createElement('div');d.className='ma';actions.forEach(function(a){var b=document.createElement('button');b.type='button';b.textContent=a.label;b.dataset.act=a.act;if(a.pri)b.className='pri';d.appendChild(b);});el.appendChild(d);}
clearTimeout(msgT);if(kind==='ok'&&!(actions&&actions.length))msgT=setTimeout(function(){el.textContent='';el.className='msg';},4500);}
var armed=null,armT;
function disarm(){clearTimeout(armT);if(armed){armed.textContent=armed.dataset.orig;armed.classList.remove('arm');armed=null;}}
function confirmTap(b,label){if(armed===b){disarm();return true;}disarm();armed=b;b.dataset.orig=b.textContent;b.textContent=label;b.classList.add('arm');armT=setTimeout(disarm,4000);return false;}

/* ---------- stock ---------- */
function stockMap(items){var m={};items.forEach(function(it){if(it.invId)m[it.invId]=(m[it.invId]||0)+(it.qty||1);});return m;}
function appliedFor(rid){var r=rid&&findSaved(rid);return(r&&r.stock)||{};}
function onReceipt(invId){var q=0;S.items.forEach(function(it){if(it.invId===invId)q+=(it.qty||1);});return q;}
function available(invId){var inv=findInv(invId);if(!inv)return null;return(inv.qty||0)+(appliedFor(S.savedId)[invId]||0);}
function applyStock(r){var old=r.stock||{},nw=stockMap(S.items),keys={},moved=0,touched=false,now=new Date().toISOString();
if(!G.stockOnSave)return 0;
Object.keys(old).concat(Object.keys(nw)).forEach(function(k){keys[k]=1;});
Object.keys(keys).forEach(function(id){var d=(nw[id]||0)-(old[id]||0);if(!d)return;var inv=findInv(id);if(inv){inv.qty=(inv.qty||0)-d;inv.updated=now;touched=true;}moved+=d;});
r.stock=nw;if(touched)saveInv();return moved;}

/* ---------- receipt ---------- */
function adjText(it){
if(it.price==null)return'Enter a price.';
if(it.invId){if(it.shop!=null&&same(it.price,it.shop))return'';
for(var a=0;a<P.length;a++){if(same(it.price,it[P[a][0]]))return'Using '+P[a][1];}
if(G.avg&&same(it.price,avgOf(it)))return'Using Average of checked prices';
if(it.shop==null)return'Manual price';var e=it.price-it.shop;return'Adjusted '+(e>0?'+':'-')+'$'+Math.abs(e).toFixed(2)+' vs your price';}
if(same(it.price,it.median))return'';
for(var k=0;k<P.length;k++){if(P[k][0]!=='median'&&same(it.price,it[P[k][0]]))return'Using '+P[k][1]+(it.median==null?' (no Listed Median found)':'');}
if(G.avg&&same(it.price,avgOf(it)))return'Using Average of checked prices';
if(it.median==null)return'Manual price';
var d=it.price-it.median;return'Adjusted '+(d>0?'+':'-')+'$'+Math.abs(d).toFixed(2)+' vs Listed Median';
}
function stockInfo(it){var av=available(it.invId);if(av==null)return{t:'No longer in inventory',low:true};
var on=onReceipt(it.invId),inv=findInv(it.invId);if(on>av)return{t:'Only '+Math.max(av,0)+' in stock',low:true};return{t:(inv.qty||0)+' in stock',low:(inv.qty||0)<=0};}
function chipsHtml(it,act){var c=chipList(it);if(!c.length)return'';return'<div class="ref">'+c.map(function(p){var v=refVal(it,p[0]);return'<button type="button" class="chip" data-act="'+act+'" data-k="'+p[0]+'"'+(v==null?' disabled':'')+'>'+esc(p[1])+'<b>'+fmt(v)+'</b></button>';}).join('')+'</div>';}
function itemHtml(it){
var meta=[it.condition,it.set,it.number?'#'+it.number:'',it.rarity?'Rarity '+it.rarity:''].filter(Boolean).map(function(m){return'<span>'+esc(m)+'</span>';}).join('');
if(it.invId)meta+=(it.code?'<span class="bc">'+esc(it.code)+'</span>':'')+'<span class="sn"></span>';
var a=adjText(it),hasRef=REFS.some(function(k){return it[k]!=null;});
return'<li class="it" data-id="'+esc(it.id)+'"><div class="top"><div class="nm">'+esc(it.name)+
(it.url?'<a class="lk" href="'+esc(it.url)+'" target="_blank" rel="noopener">TCGplayer page</a>':'')+'</div><button class="x" data-act="rm" aria-label="Remove '+esc(it.name)+'">&#215;</button></div>'+
(meta?'<div class="meta">'+meta+'</div>':'')+
(hasRef?chipsHtml(it,'use'):'')+
'<div class="row"><label>Price<input class="pr" data-f="price" inputmode="decimal" value="'+(it.price==null?'':Number(it.price).toFixed(2))+'"></label>'+
'<label>Qty<input class="qt" data-f="qty" inputmode="numeric" value="'+(it.qty||1)+'"></label><span class="lt">'+fmt(line(it))+'</span></div>'+
'<input class="note" data-f="note" placeholder="Note, e.g. reason for price change" value="'+esc(it.note)+'">'+
'<span class="adj"'+(a?'':' hidden')+'>'+esc(a)+'</span></li>';
}
function refreshItem(li,it){
li.querySelector('.lt').textContent=fmt(line(it));
Array.prototype.forEach.call(li.querySelectorAll('.chip'),function(c){c.classList.toggle('on',same(it.price,refVal(it,c.dataset.k)));});
var a=adjText(it),ad=li.querySelector('.adj');ad.textContent=a;ad.hidden=!a;
var sn=li.querySelector('.sn');if(sn&&it.invId){var si=stockInfo(it);sn.textContent=si.t;sn.className='sn'+(si.low?' lo':'');}
}
function refreshStock(){Array.prototype.forEach.call(list.querySelectorAll('.it'),function(li){var it=find(li.dataset.id);if(it&&it.invId)refreshItem(li,it);});}
function status(){
var st=$('.st'),t='',dirty=false;
if(view==='receipt'){
var sv=S.savedId&&findSaved(S.savedId);
if(sv){if(S.dirty){t='Editing receipt #'+sv.no+'. Unsaved changes.';dirty=true;}else t='Receipt #'+sv.no+', saved '+when(sv.savedAt)+'.';}
else if(S.items.length){t='Not saved yet.';}
}
st.textContent=t;st.classList.toggle('dirty',dirty);
}
function counts(){var q=count(S.items);$('[data-c="receipt"]').textContent=q?String(q):'';$('[data-c="saved"]').textContent=SAVED.length?String(SAVED.length):'';
$('.sum').textContent=fmt(total(S.items));if(pill)$('.psum').textContent=fmt(total(S.items));}
function totals(){counts();}
function render(){
list.innerHTML=S.items.length?S.items.map(itemHtml).join(''):'<li class="empty">No cards yet. Open a card’s page on TCGplayer and tap Add this card, or scan a barcode from your inventory.</li>';
Array.prototype.forEach.call(list.querySelectorAll('.it'),function(li){refreshItem(li,find(li.dataset.id));});
counts();status();
}
function setTabs(){Array.prototype.forEach.call(R.querySelectorAll('.tab'),function(t){t.setAttribute('aria-selected',String(t.dataset.tab===view));});$('.gear').classList.toggle('on',view==='settings');}
function showView(v){disarm();if(v!=='inventory')EDIT=null;view=v;
for(var k in VIEWS)VIEWS[k].hidden=k!==v;
R.querySelectorAll('.msg').forEach(function(m){m.textContent='';m.className='msg';});
setTabs();if(v==='saved')renderSaved();else if(v==='inventory')renderInv();else if(v==='receipt')render();
status();counts();}
function expand(){if(pill)pill.hidden=true;panel.hidden=false;}
function minimize(){panel.hidden=true;if(pill)pill.hidden=false;}

function readCard(){
return new Promise(function(res){res(env.readPage());}).then(function(pg){
if(!pg||!env.isCardSite(pg.host)){expand();msg('Open a card page on TCGplayer.com first, then tap the button again.','warn');return null;}
var d=parseText(pg.text);
d.name=(pg.h1||'').trim()||String(pg.title||'').split('|')[0].trim()||'Unknown card';
if(d.market==null&&d.median==null){expand();msg('No prices found on this page. Open a card’s product page, wait for the prices to load, then try again.','warn');return null;}
d.url=String(pg.url||'').split('#')[0];d.pricedAt=new Date().toISOString();return d;
},function(){msg('Couldn’t read this page. Wait for it to finish loading and try again.','warn');return null;});
}
function scrollLast(){var last=list.lastElementChild;if(last&&!panel.hidden&&last.scrollIntoView)last.scrollIntoView({block:'nearest'});}
function addCurrent(){
readCard().then(function(d){if(!d)return;
if(view!=='receipt')showView('receipt');
for(var k=0;k<S.items.length;k++){var ex=S.items[k];if(!ex.invId&&ex.url===d.url&&ex.condition===d.condition){ex.qty=(ex.qty||1)+1;changed();render();msg(d.name+' is already on the receipt. Quantity is now '+ex.qty+'.','ok');return;}}
var it={id:uid(),name:d.name,condition:d.condition,number:d.number,rarity:d.rarity,
market:d.market,median:d.median,recent:d.recent,low:d.low,high:d.high,listing:d.listing,price:startPrice(d),qty:1,note:'',url:d.url,added:d.pricedAt};
S.items.push(it);changed();render();
msg('Added '+d.name+(d.condition?' ('+d.condition+')':'')+'.','ok');scrollLast();
});
}
function addInvToReceipt(inv){
var ex=null;S.items.forEach(function(it){if(it.invId===inv.id)ex=it;});
if(ex){ex.qty=(ex.qty||1)+1;}
else{ex={id:uid(),invId:inv.id,code:inv.code,name:inv.name,condition:inv.condition||'',set:inv.set||'',number:inv.number||'',rarity:inv.rarity||'',shop:inv.price,price:inv.price!=null?inv.price:startPrice(inv),qty:1,note:'',url:okUrl(inv.url)?inv.url:'',added:inv.pricedAt||new Date().toISOString()};
REFS.forEach(function(k){ex[k]=inv[k]!=null?inv[k]:null;});S.items.push(ex);}
changed();if(view==='receipt'){render();scrollLast();}else counts();
var av=available(inv.id),on=onReceipt(inv.id);
if(av!=null&&on>av)msg('Added '+inv.name+'. Only '+Math.max(av,0)+' in stock.','warn');
else msg('Added '+inv.name+(on>1?'. '+on+' on the receipt.':' to the receipt.'),'ok');
}
function scanReceipt(input){var code=input.value.trim();if(!code)return;input.value='';
var inv=findCode(code);if(!inv){lastUnknown=code;msg('No inventory item has barcode '+code+'.','warn',[{label:'Add it to inventory',act:'newcode',pri:true}]);return;}
addInvToReceipt(inv);}

function saveReceipt(){
if(!S.items.length){msg('Add a card before saving.','warn');return;}
var now=new Date().toISOString(),r=S.savedId&&findSaved(S.savedId),isNew=!r;
if(!r){r={id:uid(),no:nextNo(),createdAt:now};SAVED.push(r);S.savedId=r.id;}
if(!r.no)r.no=nextNo();
r.customer=S.customer||'';r.email=S.email||'';r.items=copyItems(S.items);r.total=total(S.items);r.count=count(S.items);r.savedAt=now;
var moved=applyStock(r);
saveList();S.dirty=false;save();render();
var sm=moved>0?' '+cards(moved)+' taken out of stock.':moved<0?' '+cards(-moved)+' put back in stock.':'';
msg((isNew?'Saved as receipt #'+r.no+'.':'Saved changes to receipt #'+r.no+'.')+sm,'ok');
}
function openSaved(id,b){
var r=findSaved(id);if(!r)return;
if(S.savedId===id&&!S.dirty){showView('receipt');msg('This receipt is already open.','ok');return;}
var risky=S.items.length&&(S.dirty||!S.savedId);
if(risky&&!confirmTap(b,'Tap again to replace')){msg('The current receipt has unsaved changes. Opening this one replaces it. Tap again to continue, or go back and tap Save first.','warn');return;}
S.items=copyItems(r.items);S.customer=r.customer||'';S.email=r.email||'';S.savedId=r.id;S.dirty=false;save();fillFields();
showView('receipt');msg('Opened receipt #'+r.no+'. Tap Save to keep any changes.','ok');
}
function deleteSaved(id,b){
var r=findSaved(id);if(!r)return;
var back=0;Object.keys(r.stock||{}).forEach(function(k){back+=r.stock[k];});
if(!confirmTap(b,'Tap again to delete'))return;
if(back){Object.keys(r.stock).forEach(function(k){var inv=findInv(k);if(inv){inv.qty=(inv.qty||0)+r.stock[k];inv.updated=new Date().toISOString();}});saveInv();}
SAVED=SAVED.filter(function(x){return x!==r;});saveList();
if(S.savedId===id){S.savedId=null;S.dirty=true;save();}
renderSaved();counts();msg('Deleted receipt #'+r.no+'.'+(back?' '+cards(back)+' went back into stock.':''),'ok');
}

function pricesAsOf(){
var t=S.items.map(function(it){return new Date(it.added).getTime();}).filter(function(x){return!isNaN(x);});
if(!t.length)return new Date().toLocaleString();
var a=new Date(Math.min.apply(null,t)),b=new Date(Math.max.apply(null,t));
if(a.toDateString()===b.toDateString())return a.toLocaleString();
return a.toLocaleDateString()+' to '+b.toLocaleDateString();
}
function curNo(){var r=S.savedId&&findSaved(S.savedId);return r?r.no:null;}
function receiptText(){
var now=new Date().toLocaleString(),L=[],no=curNo();
L.push(G.shop||'Receipt');if(no)L.push('Receipt #'+no);L.push(now);if(S.customer)L.push('Customer: '+S.customer);L.push('');
S.items.forEach(function(it){var q=it.qty||1;
L.push(it.name);
var sub=[it.condition,it.set,it.number?'#'+it.number:''].filter(Boolean).join(', ');if(sub)L.push('  '+sub);
L.push('  '+(q>1?q+' x '+fmt(it.price)+' = '+fmt(line(it)):fmt(it.price)));
var r=refLine(it);if(r)L.push('  '+r);
if(it.note)L.push('  Note: '+it.note);
if(G.links&&it.url)L.push('  '+it.url);
L.push('');});
L.push('Total: '+fmt(total(S.items)));L.push('');L.push('Prices as of '+pricesAsOf()+'.');
return L.join('\n');
}
function copyText(text,then){var p;try{p=env.copyText?env.copyText(text):navigator.clipboard.writeText(text);}catch(e){p=null;}Promise.resolve(p).then(then,then);}
function emailIt(){
if(!S.items.length){msg('Add a card before emailing.','warn');return;}
var no=curNo(),subj=(G.shop?G.shop+' receipt':'Card receipt')+(no?' #'+no:'')+' '+new Date().toLocaleDateString();
var text=receiptText(),to=(S.email||'').trim();
var base='mailto:'+encodeURIComponent(to).replace(/%40/g,'@')+'?subject='+encodeURIComponent(subj)+'&body=';
var open=env.openMail||function(h){location.href=h;};
if((base+encodeURIComponent(text)).length>1900){
copyText(text,function(){open(base+encodeURIComponent('(Paste the receipt here)'));});
msg('This receipt is too long to fill in automatically. It has been copied, so paste it into the email that opens.','warn');return;}
open(base+encodeURIComponent(text));
msg(to?'Opening your email app with the receipt for '+to+'.':'Opening your email app. Add the customer’s address before sending.','ok');
}
function printBody(){
var now=new Date().toLocaleString(),no=curNo();
var rows=S.items.map(function(it){
var sub=[it.condition,it.set,it.number?'#'+it.number:''].filter(Boolean).join(', ');
var r=refLine(it);
return'<tr><td><b>'+esc(it.name)+'</b>'+(sub?'<div class="s">'+esc(sub)+'</div>':'')+(r?'<div class="s">'+esc(r)+'</div>':'')+
(it.note?'<div class="no">Note: '+esc(it.note)+'</div>':'')+
(G.links&&it.url?'<div class="u"><a href="'+esc(it.url)+'">'+esc(it.url)+'</a></div>':'')+'</td>'+
'<td class="n">'+(it.qty||1)+'</td><td class="n">'+fmt(it.price)+'</td><td class="n">'+((it.qty||1)>1?fmt(line(it)):'')+'</td></tr>';}).join('');
return'<main><header>'+(G.logo?'<img class="lg" src="'+esc(G.logo)+'" alt="">':'')+'<h1>'+esc(G.shop||'Receipt')+'</h1>'+(no?'<p>Receipt #'+no+'</p>':'')+'<p>'+esc(now)+'</p>'+(S.customer?'<p>Customer: '+esc(S.customer)+'</p>':'')+'</header>'+
'<table><thead><tr><th>Card</th><th class="n">Qty</th><th class="n">Price</th><th class="n">Total</th></tr></thead><tbody>'+rows+'</tbody></table>'+
'<div class="tot"><span>Total</span><span>'+fmt(total(S.items))+'</span></div>'+
'<p class="f">Prices as of '+esc(pricesAsOf())+'.</p><button id="p">Print</button></main>';
}
function printDoc(title,body,css,delay){
var w=window.open('','_blank');
if(!w){msg('The print window was blocked. Allow pop-ups for this site and try again.','warn');return null;}
w.document.open();
w.document.write('<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+esc(title)+'</title></head><body>'+body+'</body></html>');
w.document.close();
applyCss(w.document,w.document,css);
var pb=w.document.getElementById('p');if(pb)pb.addEventListener('click',function(){w.print();});
setTimeout(function(){try{w.focus();w.print();}catch(e){}},delay||400);
return w;
}
function printIt(){
if(!S.items.length){msg('Add a card before printing.','warn');return;}
var no=curNo();printDoc(no?'Receipt #'+no:'Receipt',printBody(),PCSS,G.logo?700:400);
}

/* ---------- labels ---------- */
function labelCss(size){
var c='*{box-sizing:border-box;margin:0}body{font-family:Arial,Helvetica,sans-serif;color:#000;background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}'+
'.lb{overflow:hidden;display:flex;flex-direction:column;background:#fff}.lt{display:flex;gap:4px;align-items:baseline}.ln{flex:1;min-width:0;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'+
'.lp{font-weight:800;white-space:nowrap}.lm{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.bars{display:block;width:100%;fill:#000}.lc{text-align:center;font-family:"Courier New",monospace;letter-spacing:.04em;white-space:nowrap;overflow:hidden}'+
'.help{font:14px/1.45 system-ui,sans-serif;padding:12px 16px;background:#F4F0FD;border-bottom:1px solid #D6DAE2;display:flex;gap:12px;align-items:center;flex-wrap:wrap}.help button{font:inherit;font-weight:700;border:0;border-radius:8px;background:#1E2230;color:#fff;padding:8px 14px;cursor:pointer}'+
'@media screen{body{background:#E9EBF0}.pg,.solo{margin:12px auto;box-shadow:0 1px 4px rgba(0,0,0,.25);background:#fff}}@media print{.help{display:none}}';
if(size==='sheet')return c+'@page{size:8.5in 11in;margin:0}.pg{width:8.5in;height:11in;padding:.5in .1875in 0;display:grid;grid-template-columns:repeat(3,2.625in);grid-auto-rows:1in;column-gap:.125in;align-content:start;break-after:page;overflow:hidden}.pg:last-child{break-after:auto}'+
'.lb{width:2.625in;height:1in;padding:.07in .14in}.ln{font-size:8.5pt}.lp{font-size:10pt}.lm{font-size:7pt}.bars{height:.42in;margin-top:.03in}.lc{font-size:6.5pt}';
if(size==='dymo')return c+'@page{size:2.125in 1in;margin:0}.solo{width:2.125in;height:1in;padding:.06in .09in;break-after:page}.solo:last-child{break-after:auto}.ln{font-size:8.5pt}.lp{font-size:10pt}.lm{font-size:7pt}.bars{height:.42in;margin-top:.03in}.lc{font-size:6.5pt}';
return c+'@page{size:2.25in 1.25in;margin:0}.solo{width:2.25in;height:1.25in;padding:.08in .1in;break-after:page}.solo:last-child{break-after:auto}.ln{font-size:9pt}.lp{font-size:11pt}.lm{font-size:7.5pt}.bars{height:.52in;margin-top:.04in}.lc{font-size:7pt}';
}
function labelHtml(inv,cls){var meta=[inv.condition,inv.number?'#'+inv.number:'',inv.set].filter(Boolean).join(' · ');
return'<div class="lb'+(cls?' '+cls:'')+'"><div class="lt"><span class="ln">'+esc(inv.name)+'</span>'+(inv.price!=null?'<span class="lp">'+fmt(inv.price)+'</span>':'')+'</div>'+
'<div class="lm">'+esc(meta||' ')+'</div>'+barSvg(inv.code)+'<div class="lc">'+esc(inv.code)+'</div></div>';}
function printLabels(items){
var size=G.label||'sheet',out=[],skipped=0;
items.forEach(function(inv){if(!inv.code||!c128(inv.code)){skipped++;return;}var n=G.labelPerStock?Math.max(0,inv.qty|0):1;for(var k=0;k<n&&out.length<3000;k++)out.push(inv);});
if(!out.length){msg(skipped?'These items need barcodes before labels can be printed. Edit them and click Make one.':(G.labelPerStock?'None of these items are in stock. Turn off “Print one label for each card in stock” in Settings to print one label each.':'No items to print.'),'warn');return;}
var name=(LABELS.filter(function(l){return l[0]===size;})[0]||LABELS[0])[1],body;
if(size==='sheet'){var pages=[];for(var i=0;i<out.length;i+=30)pages.push('<div class="pg">'+out.slice(i,i+30).map(function(x){return labelHtml(x);}).join('')+'</div>');body=pages.join('');}
else body=out.map(function(x){return labelHtml(x,'solo');}).join('');
var help='<div class="help"><span><b>'+cards(out.length).replace('card','label')+'</b> on '+esc(name)+'. In the print window, set Margins to None and Scale to 100%.</span><button id="p">Print</button></div>';
if(printDoc('Labels',help+body,labelCss(size),600))msg('Opened '+cards(out.length).replace('card','label')+' to print.'+(skipped?' '+skipped+' item'+(skipped===1?' has':'s have')+' no barcode and was skipped.':''),'ok');
}

/* ---------- inventory ---------- */
var INV_SHOW=200;
function invMatches(q){q=q.toLowerCase();if(!q)return INV.items.slice();
return INV.items.filter(function(it){return[it.name,it.code,it.number,it.set,it.condition].join(' ').toLowerCase().indexOf(q)>-1;});}
function invRowHtml(it){
var low=(it.qty||0)<=0;
var meta=[it.condition,it.set,it.number?'#'+it.number:''].filter(Boolean).map(function(m){return'<span>'+esc(m)+'</span>';}).join('')+
'<span class="bc">'+esc(it.code||'No barcode')+'</span><span'+(low?' class="lo"':'')+'>'+(low?((it.qty||0)<0?'Oversold by '+(-it.qty):'Out of stock'):(it.qty+' in stock'))+'</span>';
return'<li class="ir" data-iid="'+esc(it.id)+'"><div class="srt"><b>'+esc(it.name)+'</b><span>'+fmt(it.price)+'</span></div><div class="meta">'+meta+'</div>'+
'<div class="sra"><button class="sbtn" data-act="ito">Add to receipt</button><button class="sdel" data-act="iedit">Edit</button><button class="sdel" data-act="ilabel">Label</button><button class="sdel" data-act="idel">Delete</button></div></li>';
}
function formHtml(d,isNew){
var hasRef=REFS.some(function(k){return d[k]!=null;});
return'<form class="ifm" novalidate><h4 class="wide">'+(isNew?'New inventory item':'Edit item')+'</h4>'+
'<label class="wide">Barcode<span class="bcrow"><input data-i="code" value="'+esc(d.code)+'" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="Scan a label, or leave blank"><button type="button" class="tb2" data-act="igen">Make one</button></span></label>'+
'<label class="wide">Name<input data-i="name" value="'+esc(d.name)+'" autocomplete="off"></label>'+
'<label>Condition<input data-i="condition" list="cr-conds" value="'+esc(d.condition)+'" autocomplete="off"></label>'+
'<label>Card number<input data-i="number" value="'+esc(d.number)+'" autocomplete="off"></label>'+
'<label>Set<input data-i="set" value="'+esc(d.set)+'" autocomplete="off"></label>'+
'<label>Rarity<input data-i="rarity" value="'+esc(d.rarity)+'" autocomplete="off"></label>'+
'<label>Your price<input data-i="price" inputmode="decimal" value="'+(d.price==null||d.price===''?'':esc(typeof d.price==='number'?d.price.toFixed(2):d.price))+'"></label>'+
'<label>In stock<input data-i="qty" inputmode="numeric" value="'+(d.qty==null?'':esc(d.qty))+'"></label>'+
(hasRef?'<div class="wide">'+chipsHtml(d,'iuse')+'<span class="pa">TCGplayer prices from '+esc(when(d.pricedAt))+'</span></div>':'')+
'<label class="wide">TCGplayer page<input data-i="url" value="'+esc(d.url)+'" autocomplete="off" placeholder="Optional"></label>'+
'<div class="wide fa"><button type="submit" class="sbtn">'+(isNew?'Add to inventory':'Save changes')+'</button><button type="button" class="sdel" data-act="icancel">Cancel</button></div></form>';
}
function markFormChips(){var f=R.querySelector('form.ifm');if(!f||!EDIT)return;var p=num(EDIT.d.price);
Array.prototype.forEach.call(f.querySelectorAll('.chip'),function(c){c.classList.toggle('on',same(p,refVal(EDIT.d,c.dataset.k)));});}
function renderInv(){
var q=($('.isrch').value||'').trim(),rows=invMatches(q);
if(EDIT&&EDIT.id&&!rows.some(function(r){return r.id===EDIT.id;})){var e=findInv(EDIT.id);if(e)rows.unshift(e);}
var shownRows=rows.slice(0,INV_SHOW);
ilist.innerHTML=shownRows.length?shownRows.map(function(it){return EDIT&&EDIT.id===it.id?'<li class="ir" data-iid="'+esc(it.id)+'">'+formHtml(EDIT.d,false)+'</li>':invRowHtml(it);}).join('')+
(rows.length>INV_SHOW?'<li class="more">Showing '+INV_SHOW+' of '+rows.length.toLocaleString()+' items. Search to find the rest.</li>':''):
'<li class="empty">'+(INV.items.length?'No items match that search.':'No inventory yet. Open a card on TCGplayer and tap Add this card to inventory, click New item, or import a CSV file.')+'</li>';
ifrm.innerHTML=EDIT&&!EDIT.id?formHtml(EDIT.d,true):'';
markFormChips();
var n=INV.items.length,stock=0,value=0;INV.items.forEach(function(it){var s=Math.max(0,it.qty||0);stock+=s;if(it.price!=null)value+=it.price*s;});
$('.isum').textContent=n?n.toLocaleString()+' item'+(n===1?'':'s')+', '+stock.toLocaleString()+' in stock, worth '+money2(value)+' at your prices':'Inventory is empty';
}
function focusField(name){var el=R.querySelector('form.ifm [data-i="'+name+'"]');if(el){el.focus();if(el.select)el.select();}}
function openNew(d){EDIT={id:null,d:d};renderInv();ifrm.scrollIntoView&&ifrm.scrollIntoView({block:'nearest'});focusField(d.code?(d.name?'price':'name'):'code');}
function openEdit(inv){var d=JSON.parse(JSON.stringify(inv));EDIT={id:inv.id,d:d};renderInv();var li=ilist.querySelector('[data-iid="'+inv.id+'"]');if(li&&li.scrollIntoView)li.scrollIntoView({block:'nearest'});focusField('price');}
function addCurrentToInv(){
readCard().then(function(d){if(!d)return;
if(view!=='inventory')showView('inventory');
var ex=null;INV.items.forEach(function(it){if(!ex&&it.url&&it.url===d.url&&(it.condition||'')===(d.condition||''))ex=it;});
if(ex){REFS.forEach(function(k){ex[k]=d[k];});ex.pricedAt=d.pricedAt;ex.updated=d.pricedAt;if(!ex.number&&d.number)ex.number=d.number;saveInv();openEdit(ex);
msg('Updated TCGplayer prices for '+ex.name+'. Your price and stock didn’t change.','ok');return;}
var nd={code:'',name:d.name,condition:d.condition,number:d.number,rarity:d.rarity,set:'',url:d.url,pricedAt:d.pricedAt,qty:1};
REFS.forEach(function(k){nd[k]=d[k];});nd.price=startPrice(nd);
openNew(nd);msg('Scan this card’s barcode label, or leave Barcode blank and one is made for you.','ok');
});
}
function saveEdit(){if(!EDIT)return;var d=EDIT.d;
var name=String(d.name||'').trim();if(!name){msg('Enter a name for this item.','warn');focusField('name');return;}
var code=String(d.code||'').trim();
if(code&&!okCode(code)){msg('Barcodes can only use letters, numbers, spaces and common symbols, up to 48 characters.','warn');focusField('code');return;}
if(code){var other=findCode(code);if(other&&other.id!==EDIT.id){msg('Barcode '+code+' is already used by '+other.name+'.','warn');focusField('code');return;}}
var url=String(d.url||'').trim();if(url&&!okUrl(url)){msg('The TCGplayer page must be a web address that starts with https://','warn');focusField('url');return;}
var price=num(d.price),qty=parseInt(String(d.qty==null?'':d.qty).replace(/[^0-9-]/g,''),10);if(isNaN(qty))qty=0;
var now=new Date().toISOString(),it=EDIT.id?findInv(EDIT.id):null,isNew=!it;
if(!it){it={id:uid(),created:now};INV.items.push(it);}
it.code=code||newCode();it.name=name;['condition','number','set','rarity'].forEach(function(k){it[k]=String(d[k]||'').trim();});
it.price=price;it.qty=qty;it.url=url;REFS.forEach(function(k){it[k]=d[k]!=null?d[k]:null;});it.pricedAt=d.pricedAt||it.pricedAt||null;it.updated=now;
lastAdded=it.id;saveInv();EDIT=null;renderInv();refreshStock();
msg(isNew?'Added '+name+' to inventory with barcode '+it.code+'.':'Saved changes to '+name+'.','ok',isNew?[{label:'Print its label',act:'ilabelnew'}]:null);
}
var lastAdded=null;
function deleteInv(inv,b){if(!confirmTap(b,'Tap again'))return;
INV.items=INV.items.filter(function(x){return x!==inv;});saveInv();if(EDIT&&EDIT.id===inv.id)EDIT=null;renderInv();refreshStock();msg('Deleted '+inv.name+' from inventory.','ok');}
function invSearchEnter(input){var q=input.value.trim();if(!q)return;var inv=findCode(q);
if(inv){input.value='';renderInv();openEdit(inv);msg('Found '+inv.name+'.','ok');return;}
var m=invMatches(q);if(!m.length){lastUnknown=q;msg('No item has barcode '+q+'.','warn',[{label:'Add a new item with this barcode',act:'newcode',pri:true}]);}}

/* ---------- CSV import and export ---------- */
function parseCSV(t){t=String(t||'').replace(/^﻿/,'');
var first=t.split(/\r?\n/)[0]||'',delim=',';[';','\t'].forEach(function(c){if(first.split(c).length>first.split(delim).length)delim=c;});
var rows=[],row=[],f='',q=false,i,c;
for(i=0;i<t.length;i++){c=t.charAt(i);
if(q){if(c==='"'){if(t.charAt(i+1)==='"'){f+='"';i++;}else q=false;}else f+=c;}
else if(c==='"'&&f==='')q=true;else if(c===delim){row.push(f);f='';}
else if(c==='\n'||c==='\r'){if(c==='\r'&&t.charAt(i+1)==='\n')i++;row.push(f);rows.push(row);row=[];f='';}
else f+=c;}
if(f!==''||row.length){row.push(f);rows.push(row);}
return rows.filter(function(r){return r.some(function(x){return String(x).trim()!=='';});});}
var COLS={code:['barcode','code','sku','upc','ean','barcode number'],name:['name','product name','card name','card','product','title','item'],
set:['set','set name','expansion','edition'],condition:['condition','cond'],number:['number','card number','collector number','no','#'],rarity:['rarity'],
price:['your price','price','our price','sell price','store price','retail price','tcg marketplace price','price each'],qty:['in stock','stock','qty','quantity','total quantity','on hand','count'],
url:['tcgplayer page','tcgplayer url','tcgplayer link','url','link','product url'],tcgid:['tcgplayer id','product id','tcgplayer product id'],
market:['market price','tcg market price','market'],median:['listed median','median']};
function colIndex(head){var h=head.map(function(x){return String(x).toLowerCase().replace(/[^a-z0-9#]+/g,' ').trim();}),m={};
Object.keys(COLS).forEach(function(k){for(var i=0;i<COLS[k].length;i++){var j=h.indexOf(COLS[k][i]);if(j>-1){m[k]=j;return;}}});return m;}
function importCSV(text){
var rows=parseCSV(text);if(rows.length<2){msg('That file has no rows to import. The first row should be column names, like Barcode, Name, Price and Stock.','warn');return;}
var m=colIndex(rows[0]);if(m.name==null){msg('Couldn’t find a Name column in that file. Add a header row with at least a Name column.','warn');return;}
var made=0,upd=0,skip=0,now=new Date().toISOString(),byCode={},byUrl={};
INV.items.forEach(function(it){if(it.code)byCode[normCode(it.code)]=it;if(it.url)byUrl[it.url+'|'+(it.condition||'').toLowerCase()]=it;});
function cell(r,k){return m[k]!=null&&r[m[k]]!=null?String(r[m[k]]).trim():'';}
rows.slice(1).forEach(function(r){
var name=cell(r,'name');if(!name){skip++;return;}
var code=cell(r,'code'),url=cell(r,'url'),tid=cell(r,'tcgid').replace(/[^0-9]/g,'');
if(!url&&tid)url='https://www.tcgplayer.com/product/'+tid;
if(url&&!okUrl(url))url='';
if(code&&!okCode(code))code='';
var cond=cell(r,'condition'),it=(code&&byCode[normCode(code)])||(url&&byUrl[url+'|'+cond.toLowerCase()])||null,isNew=!it;
if(!it){it={id:uid(),created:now,qty:0,price:null};INV.items.push(it);made++;}else upd++;
it.name=name;if(code)it.code=code;else if(!it.code)it.code=newCode();
['set','condition','number','rarity'].forEach(function(k){var v=cell(r,k);if(v||isNew)it[k]=v;});
if(url)it.url=url;else if(isNew)it.url='';
var pr=cell(r,'price');if(pr!=='')it.price=num(pr);
var q=cell(r,'qty');if(q!==''){var qi=parseInt(q.replace(/[^0-9-]/g,''),10);if(!isNaN(qi))it.qty=qi;}
['market','median'].forEach(function(k){var v=cell(r,k);if(v!==''){it[k]=num(v);it.pricedAt=it.pricedAt||now;}});
REFS.forEach(function(k){if(it[k]===undefined)it[k]=null;});
it.updated=now;byCode[normCode(it.code)]=it;if(it.url)byUrl[it.url+'|'+(it.condition||'').toLowerCase()]=it;
});
saveInv();renderInv();refreshStock();
msg('Imported '+(made+upd).toLocaleString()+' item'+((made+upd)===1?'':'s')+': '+made+' new, '+upd+' updated'+(skip?', '+skip+' skipped because they had no name':'')+'.','ok');
}
function csvCell(v){var s=v==null?'':String(v);if(/^[=+\-@\t\r]/.test(s)&&!/^-?\d+(\.\d+)?$/.test(s))s="'"+s;return/[",\r\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s;}
function exportCSV(){
if(!INV.items.length){msg('There’s nothing to export yet.','warn');return;}
var head=['Barcode','Name','Set','Condition','Number','Rarity','Your Price','In Stock','TCGplayer Page','Market Price','Listed Median','TCGplayer Prices From'];
var rows=INV.items.map(function(it){return[it.code,it.name,it.set,it.condition,it.number,it.rarity,it.price==null?'':it.price.toFixed(2),it.qty||0,it.url,it.market==null?'':it.market,it.median==null?'':it.median,it.pricedAt||''];});
var text='﻿'+[head].concat(rows).map(function(r){return r.map(csvCell).join(',');}).join('\r\n')+'\r\n';
download('card-receipt-inventory-'+today()+'.csv',text,'text/csv');
}

/* ---------- files, backup, logo ---------- */
function download(name,text,mime){
if(env.saveFile){return Promise.resolve(env.saveFile(name,text)).then(function(r){if(r==='saved')msg('Saved '+name+'.','ok');else if(r==='failed')msg('Couldn’t save the file. Try another folder.','warn');});}
try{var b=new Blob([text],{type:mime+';charset=utf-8'}),u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download=name;a.style.display='none';R.appendChild(a);a.click();
setTimeout(function(){a.remove();URL.revokeObjectURL(u);},5000);msg('Downloading '+name+'. Find it in your Downloads folder.','ok');}
catch(e){msg('This browser couldn’t download the file.','warn');}
}
function pickFile(kind,accept){var f=$('.fin');f.value='';f.dataset.kind=kind;f.setAttribute('accept',accept);f.click();}
function backup(){var data={app:'Card Receipt',kind:'backup',version:1,exported:new Date().toISOString(),settings:G,saved:SAVED,inventory:INV};
download('card-receipt-backup-'+today()+'.json',JSON.stringify(data),'application/json');}
function readBackup(text){var d;try{d=JSON.parse(text);}catch(e){d=null;}
if(!d||d.kind!=='backup'||!Array.isArray(d.saved)||!d.inventory||!Array.isArray(d.inventory.items)){msg('That file isn’t a Card Receipt backup. Choose a file named like card-receipt-backup-2026-01-31.json.','warn');return;}
PEND=d;msg('This backup from '+when(d.exported)+' has '+d.saved.length+' saved receipt'+(d.saved.length===1?'':'s')+' and '+d.inventory.items.length+' inventory item'+(d.inventory.items.length===1?'':'s')+'. Restoring replaces the receipts, inventory and settings on this device.','warn',[{label:'Replace with backup',act:'restoreok',pri:true},{label:'Cancel',act:'msgx'}]);}
function doRestore(){var d=PEND;PEND=null;if(!d)return;
SAVED=d.saved;INV=d.inventory;if(!(INV.next>0))INV.next=1;
if(d.settings&&typeof d.settings==='object'){var keep=G;G=d.settings;if(!G.show)G.show=keep.show;if(!G.theme)G.theme=keep.theme;if(!G.label)G.label='sheet';if(!G.start)G.start='median';if(G.stockOnSave==null)G.stockOnSave=true;}
if(S.savedId&&!findSaved(S.savedId)){S.savedId=null;S.dirty=S.items.length>0;}
var ok=put(SKEY,SAVED)&&put(IKEY,INV)&&put(GKEY,G);save();syncSettings();counts();
if(ok)msg('Restored '+SAVED.length+' receipts and '+INV.items.length+' inventory items.','ok');}
function loadLogo(file){
if(!file||!/^image\//.test(file.type)){msg('Choose an image file, like a PNG or JPG.','warn');return;}
function bad(){msg('Couldn’t use that image. Try saving it as a PNG or JPG first.','warn');}
var fr=new FileReader();fr.onerror=bad;fr.onload=function(){var img=new Image();img.onerror=bad;img.onload=function(){
try{var w=img.naturalWidth||img.width,h=img.naturalHeight||img.height;if(!w||!h){bad();return;}
var s=Math.min(1,600/w,240/h),cw=Math.max(1,Math.round(w*s)),ch=Math.max(1,Math.round(h*s)),cv=document.createElement('canvas');cv.width=cw;cv.height=ch;
var x=cv.getContext('2d');x.drawImage(img,0,0,cw,ch);var url=cv.toDataURL('image/png');
if(url.length>250000){x.globalCompositeOperation='destination-over';x.fillStyle='#fff';x.fillRect(0,0,cw,ch);url=cv.toDataURL('image/jpeg',0.85);}
G.logo=url;saveSettings();syncLogo();msg('Logo added. It prints at the top of each receipt.','ok');}catch(e){bad();}};img.src=fr.result;};
fr.readAsDataURL(file);}
$('.fin').addEventListener('change',function(e){var f=e.target.files&&e.target.files[0],kind=e.target.dataset.kind;if(!f)return;
if(kind==='logo'){loadLogo(f);return;}
var fr=new FileReader();fr.onerror=function(){msg('Couldn’t read that file.','warn');};
fr.onload=function(){if(kind==='csv')importCSV(fr.result);else if(kind==='backup')readBackup(fr.result);};fr.readAsText(f);});

/* ---------- saved list ---------- */
function savedHtml(r){
var names=(r.items||[]).map(function(it){return it.name;}).join(', ');
return'<li class="sr" data-sid="'+esc(r.id)+'"><div class="srt"><b>'+(r.no?'#'+r.no+' · ':'')+esc(r.customer||'No customer name')+'</b><span>'+fmt(r.total)+'</span></div>'+
'<div class="srm">'+esc(when(r.savedAt))+', '+cards(r.count||0)+(r.email?', '+esc(r.email):'')+'</div>'+
(names?'<div class="src">'+esc(names)+'</div>':'')+
'<div class="sra"><button class="sbtn" data-act="sopen">Open</button><button class="sdel" data-act="sdel">Delete</button>'+(S.savedId===r.id?'<span class="now">Open now</span>':'')+'</div></li>';
}
function renderSaved(){
var q=($('.srch').value||'').trim().toLowerCase().replace(/^#/,'');
var rows=SAVED.slice().sort(function(a,b){return String(b.savedAt).localeCompare(String(a.savedAt));}).filter(function(r){
if(!q)return true;var hay=[r.no,r.customer,r.email].concat((r.items||[]).map(function(it){return it.name;})).join(' ').toLowerCase();return hay.indexOf(q)>-1;});
slist.innerHTML=rows.length?rows.map(savedHtml).join(''):'<li class="empty">'+(SAVED.length?'No saved receipts match that search.':'No saved receipts yet. Tap Save on a receipt to keep it here.')+'</li>';
counts();
}

/* ---------- events ---------- */
R.addEventListener('click',function(e){
var a=e.target.closest('a.lk');
if(a&&env.openLink){e.preventDefault();env.openLink(a.getAttribute('href'));return;}
var b=e.target.closest('[data-act]');if(!b)return;
var act=b.dataset.act,li=b.closest('.it'),it=li?find(li.dataset.id):null,sr=b.closest('.sr'),ir=b.closest('.ir'),inv=ir?findInv(ir.dataset.iid):null;
if(['clear','sopen','sdel','idel'].indexOf(act)<0)disarm();
if(act==='tab')showView(b.dataset.tab);
else if(act==='add')addCurrent();
else if(act==='iadd')addCurrentToInv();
else if(act==='close'){if(env.onClose)env.onClose();host.remove();}
else if(act==='min')minimize();
else if(act==='open')expand();
else if(act==='save')saveReceipt();
else if(act==='print')printIt();
else if(act==='email')emailIt();
else if(act==='scango')scanReceipt($('.code'));
else if(act==='sopen'&&sr)openSaved(sr.dataset.sid,b);
else if(act==='sdel'&&sr)deleteSaved(sr.dataset.sid,b);
else if(act==='clear'){
if(!S.items.length&&!S.savedId){msg('The receipt is already empty.','ok');return;}
if(S.items.length&&(S.dirty||!S.savedId)&&!confirmTap(b,'Tap again to clear'))return;
disarm();S.items=[];S.customer='';S.email='';S.savedId=null;S.dirty=false;fillFields();save();render();msg('Started a new receipt.','ok');}
else if(act==='rm'&&it){S.items=S.items.filter(function(x){return x!==it;});changed();render();}
else if(act==='use'&&it){var v=refVal(it,b.dataset.k);if(v!=null){it.price=v;li.querySelector('.pr').value=Number(v).toFixed(2);changed();refreshItem(li,it);counts();}}
else if(act==='newcode'){var c=lastUnknown;showView('inventory');openNew({code:c,name:'',condition:'',number:'',set:'',rarity:'',price:'',qty:1,url:''});}
else if(act==='inew'){openNew({code:'',name:'',condition:'',number:'',set:'',rarity:'',price:'',qty:1,url:''});}
else if(act==='icancel'){EDIT=null;renderInv();}
else if(act==='igen'&&EDIT){EDIT.d.code=newCode();var ci=R.querySelector('form.ifm [data-i="code"]');if(ci)ci.value=EDIT.d.code;focusField('name');}
else if(act==='iuse'&&EDIT){var rv=refVal(EDIT.d,b.dataset.k);if(rv!=null){EDIT.d.price=rv.toFixed(2);var pi=R.querySelector('form.ifm [data-i="price"]');if(pi)pi.value=EDIT.d.price;markFormChips();}}
else if(act==='ito'&&inv)addInvToReceipt(inv);
else if(act==='iedit'&&inv)openEdit(inv);
else if(act==='ilabel'&&inv){var keep=G.labelPerStock;G.labelPerStock=false;printLabels([inv]);G.labelPerStock=keep;}
else if(act==='ilabelnew'){var ln=findInv(lastAdded);if(ln){var kp=G.labelPerStock;G.labelPerStock=false;printLabels([ln]);G.labelPerStock=kp;}}
else if(act==='idel'&&inv)deleteInv(inv,b);
else if(act==='labels'){var rows=invMatches(($('.isrch').value||'').trim());if(!rows.length){msg('No items to print. Clear the search or add items first.','warn');return;}printLabels(rows);}
else if(act==='iexport')exportCSV();
else if(act==='iimport')pickFile('csv','.csv,text/csv,text/plain');
else if(act==='backup')backup();
else if(act==='restore')pickFile('backup','.json,application/json');
else if(act==='restoreok')doRestore();
else if(act==='msgx'){PEND=null;msg('');}
else if(act==='logo')pickFile('logo','image/png,image/jpeg,image/gif,image/webp,image/svg+xml');
else if(act==='logorm'){if(!G.logo){msg('There’s no logo to remove.','ok');return;}G.logo='';saveSettings();syncLogo();msg('Logo removed.','ok');}
else if(act==='color'){G.theme.color=b.dataset.color;saveSettings();applyTheme();}
});
R.addEventListener('submit',function(e){var f=e.target;if(f&&f.classList&&f.classList.contains('ifm')){e.preventDefault();saveEdit();}});
R.addEventListener('keydown',function(e){
if(e.key!=='Enter'||e.isComposing)return;var el=e.target;
if(el.dataset&&el.dataset.scan==='receipt'){e.preventDefault();scanReceipt(el);}
else if(el.dataset&&el.dataset.scan==='inventory'){e.preventDefault();invSearchEnter(el);}
else if(el.dataset&&el.dataset.i==='code'){e.preventDefault();focusField(EDIT&&EDIT.d.name?'price':'name');}
});
R.addEventListener('input',function(e){
var el=e.target,ds=el.dataset||{};
if(el.classList.contains('srch')){renderSaved();return;}
if(el.classList.contains('isrch')){renderInv();return;}
if(ds.i){if(EDIT){EDIT.d[ds.i]=el.value;if(ds.i==='price')markFormChips();}return;}
if(ds.s){G.show[ds.s]=el.checked;saveSettings();render();return;}
if(ds.gb){G[ds.gb]=el.checked;saveSettings();if(ds.gb==='avg')render();return;}
if(ds.gs){G[ds.gs]=el.value;saveSettings();return;}
if(ds.gt){G.theme[ds.gt]=el.value;saveSettings();applyTheme();return;}
if(ds.g){G[ds.g]=el.value;saveSettings();return;}
if(ds.r){S[ds.r]=el.value;changed();return;}
var f=ds.f;if(!f)return;
var li=el.closest('.it'),it=li&&find(li.dataset.id);if(!it)return;
if(f==='price')it.price=num(el.value);
else if(f==='qty'){var q=parseInt(el.value,10);it.qty=q>0?q:1;}
else it.note=el.value;
changed();refreshItem(li,it);counts();
});
if(!dock)['keydown','keyup','keypress'].forEach(function(t){R.addEventListener(t,function(e){e.stopPropagation();});});
fillFields();syncSettings();setTabs();render();
if(!store.get(GKEY))saveSettings();
function focusScan(){expand();if(view!=='receipt')showView('receipt');var c=$('.code');c.focus();c.select();}
return{add:addCurrent,save:saveReceipt,print:printIt,email:emailIt,showSaved:function(){expand();showView('saved');},showInventory:function(){expand();showView('inventory');},
showSettings:function(){expand();showView('settings');},scan:focusScan,_parse:parseText,_c128:c128,_bars:barSvg};
}
