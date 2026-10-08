function CardReceipt(env){
var KEY='cardReceipt.v1',SKEY='cardReceipt.saved.v1';
var dock=env.mode==='dock';
var ACC='#5B2DC9',INK='#1E2230',MUT='#5D6475',LINE='#D6DAE2';
var CSS=':host{all:initial;'+(dock?'display:block;height:100%':'')+'}*{box-sizing:border-box;font-family:system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}'+
'.panel{display:flex;flex-direction:column;overflow:hidden;background:#fff;color:#1E2230;font-size:15px;line-height:1.4}'+
'.panel.float{position:fixed;top:12px;right:12px;bottom:12px;width:384px;max-width:calc(100vw - 24px);border:1px solid #D6DAE2;border-radius:14px;box-shadow:0 18px 50px rgba(30,34,48,.28);z-index:2147483647}'+
'.panel.dock{height:100%;width:100%;border-left:1px solid #D6DAE2}'+
'.hd{display:flex;align-items:center;gap:8px;padding:14px 14px 8px}.hd h2{margin:0;font-size:18px;font-weight:750;flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.cnt{font-size:13px;color:#5D6475;font-weight:500;margin-left:6px}'+
'.ib{border:0;background:#EEF0F4;color:#1E2230;width:36px;height:36px;border-radius:9px;font-size:19px;line-height:1;cursor:pointer;flex:none}'+
'.tb{border:0;background:#EEF0F4;color:#1E2230;height:36px;padding:0 12px;border-radius:9px;font-size:14px;font-weight:650;cursor:pointer;white-space:nowrap;flex:none}'+
'.st{margin:0 14px 8px;font-size:12.5px;color:#5D6475}.st:empty{display:none}.st.dirty{color:#8A3517}'+
'.vw{display:flex;flex-direction:column;flex:1;min-height:0}'+
'.add{margin:0 14px;padding:13px;border:0;border-radius:11px;background:#5B2DC9;color:#fff;font-size:16px;font-weight:700;cursor:pointer;flex:none}.add:active{transform:translateY(1px)}'+
'.msg{margin:8px 14px 0;font-size:13.5px;padding:8px 10px;border-radius:8px;flex:none}.msg:empty{display:none}.msg.ok{background:#E6F3EC;color:#1F5E3E}.msg.warn{background:#FBEDE6;color:#8A3517}'+
'.list,.slist{list-style:none;margin:8px 0 0;padding:0 14px 14px;overflow-y:auto;flex:1;min-height:0}.empty{color:#5D6475;font-size:14px;padding:18px 2px}'+
'.it{border-top:1px solid #E3E6EC;padding:12px 0}.it:first-child{border-top:0}.top{display:flex;gap:8px;align-items:flex-start}'+
'.nm{flex:1;font-weight:650}.lk{display:block;color:#5B2DC9;font-weight:500;font-size:12.5px;margin-top:2px;text-decoration:none;cursor:pointer}.lk:hover{text-decoration:underline}'+
'.x{border:0;background:none;color:#8A90A0;font-size:22px;line-height:1;cursor:pointer;padding:0 4px}'+
'.meta{font-size:13px;color:#5D6475;margin-top:3px;display:flex;flex-wrap:wrap;gap:2px 12px}'+
'.ref{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}.chip{flex:1 1 calc(50% - 6px);border:1px solid #D6DAE2;background:#fff;border-radius:9px;padding:6px 8px;text-align:left;font-size:12px;color:#5D6475;cursor:pointer}'+
'.chip b{display:block;font-size:15px;color:#1E2230;font-variant-numeric:tabular-nums}.chip.on{border-color:#5B2DC9;box-shadow:inset 0 0 0 1px #5B2DC9;background:#F4F0FD}.chip:disabled{opacity:.5;cursor:default}'+
'.row{display:flex;gap:8px;align-items:flex-end;margin-top:8px}label{font-size:12px;color:#5D6475;display:flex;flex-direction:column;gap:3px}'+
'input{font:inherit;font-size:16px;border:1px solid #C9CED8;border-radius:8px;padding:7px 9px;color:#1E2230;background:#fff;width:100%}.pr{width:112px}.qt{width:64px}'+
'.lt{margin-left:auto;font-weight:700;font-variant-numeric:tabular-nums;padding-bottom:8px}.note{margin-top:8px}.adj{display:block;margin-top:6px;font-size:12.5px;color:#8A3517}'+
'.ft{position:relative;background:#F4F5F8;padding:16px 14px 14px;flex:none}.ft:before{content:"";position:absolute;left:0;right:0;top:-6px;height:6px;background:radial-gradient(circle at 6px 0,transparent 5px,#F4F5F8 5.5px) 0 0/12px 6px repeat-x}'+
'summary{cursor:pointer;font-size:13.5px;color:#5D6475}.det{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px}.wide{grid-column:1/-1}'+
'.chk{display:grid;grid-template-columns:1fr 1fr;gap:8px 10px;margin-top:8px}label.c{flex-direction:row;align-items:center;gap:8px;font-size:14px;color:#1E2230;cursor:pointer}label.c input{width:20px;height:20px;padding:0;margin:0;accent-color:#5B2DC9;flex:none}details+details{margin-top:8px}'+
'.tot{display:flex;justify-content:space-between;align-items:baseline;margin:10px 0 12px}.tot span{font-size:14px;color:#5D6475}.tot b{font-size:26px;font-weight:800;font-variant-numeric:tabular-nums}'+
'.acts{display:flex;gap:6px}.pbtn{flex:1;padding:12px 4px;border-radius:10px;border:0;background:#1E2230;color:#fff;font-weight:700;font-size:15px;cursor:pointer}.pbtn.sv{background:#5B2DC9}'+
'.cbtn{padding:12px 12px;border-radius:10px;border:1px solid #C9CED8;background:#fff;color:#1E2230;font-size:15px;cursor:pointer}'+
'.srch{margin:2px 14px 0;width:auto;flex:none}'+
'.sr{border-top:1px solid #E3E6EC;padding:12px 0}.sr:first-child{border-top:0}.srt{display:flex;gap:10px;align-items:baseline}.srt b{flex:1;min-width:0;font-weight:650}.srt span{font-weight:700;font-variant-numeric:tabular-nums}'+
'.srm{font-size:13px;color:#5D6475;margin-top:2px}.src{font-size:12.5px;color:#5D6475;margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'+
'.sra{display:flex;gap:8px;margin-top:8px;align-items:center}.sbtn{border:0;border-radius:9px;padding:9px 16px;background:#5B2DC9;color:#fff;font-weight:700;font-size:14px;cursor:pointer}'+
'.sdel{border:1px solid #C9CED8;border-radius:9px;padding:8px 12px;background:#fff;color:#1E2230;font-size:14px;cursor:pointer}.now{font-size:12.5px;color:#1F5E3E;font-weight:650;margin-left:auto}'+
'.arm{background:#A8431F!important;border-color:#A8431F!important;color:#fff!important;font-weight:700}'+
'button:focus-visible,input:focus-visible,a:focus-visible,summary:focus-visible{outline:2px solid #5B2DC9;outline-offset:2px}'+
'.pill{position:fixed;right:12px;bottom:12px;display:flex;gap:4px;background:#1E2230;padding:5px;border-radius:999px;box-shadow:0 10px 30px rgba(30,34,48,.35);z-index:2147483647}'+
'.pill button{border:0;border-radius:999px;padding:11px 15px;font-weight:700;font-size:14px;cursor:pointer;font-variant-numeric:tabular-nums}.pill .pa{background:#5B2DC9;color:#fff}.pill .po{background:transparent;color:#fff}'+
'[hidden]{display:none!important}'+
'@media (max-width:640px){.panel.float{top:auto;left:0;right:0;bottom:0;width:auto;max-width:none;height:86vh;border-radius:16px 16px 0 0;padding-bottom:env(safe-area-inset-bottom,0px)}.pill{bottom:calc(12px + env(safe-area-inset-bottom,0px))}}'+
'@media (prefers-reduced-motion:no-preference){.panel.float{animation:crin .18s ease-out}@keyframes crin{from{transform:translateY(12px);opacity:0}}}';
var PCSS='body{font-family:system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;color:#1E2230;margin:0;padding:24px}main{max-width:680px;margin:0 auto}'+
'h1{font-size:24px;margin:0 0 4px}header p{margin:2px 0;color:#5D6475;font-size:14px}table{width:100%;border-collapse:collapse;margin-top:18px;font-size:14px}'+
'th{text-align:left;border-bottom:2px solid #1E2230;padding:6px 4px;font-size:12px;color:#5D6475}td{border-bottom:1px solid #D6DAE2;padding:8px 4px;vertical-align:top}'+
'td.n,th.n{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}.s{color:#5D6475;font-size:12.5px;margin-top:2px}.no{font-size:12.5px;margin-top:3px;font-style:italic}'+
'.u{font-size:11px;margin-top:3px;word-break:break-all}.u a{color:#5B2DC9}.tot{display:flex;justify-content:space-between;font-size:20px;font-weight:800;margin-top:14px;padding-top:8px;border-top:2px solid #1E2230}'+
'.f{color:#5D6475;font-size:12px;margin-top:18px}#p{margin-top:18px;padding:12px 20px;font-size:16px;font-weight:700;border:0;border-radius:10px;background:#1E2230;color:#fff;cursor:pointer}@media print{#p{display:none}body{padding:0}}';
var P=[['market','Market Price'],['median','Listed Median'],['listing','Listing price'],['recent','Most Recent Sale'],['low','Low Sale Price'],['high','High Sale Price']];

var store=env.store;
function load(){var v=store.get(KEY);if(!v||!Array.isArray(v.items))v={shop:'',customer:'',items:[]};if(!v.show)v.show={market:true,median:true};return v;}
var S=load();
var SAVED=store.get(SKEY);if(!Array.isArray(SAVED))SAVED=[];
function save(){store.set(KEY,S);}
function saveList(){store.set(SKEY,SAVED);}
function changed(){S.dirty=true;save();status();}
function shown(){return P.filter(function(p){return S.show[p[0]];});}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function fmt(n){return(n==null||isNaN(n))?'n/a':'$'+Number(n).toFixed(2);}
function num(v){var n=parseFloat(String(v).replace(/[^0-9.]/g,''));return isNaN(n)?null:n;}
function same(a,b){return a!=null&&b!=null&&Math.abs(a-b)<0.005;}
function line(it){return(it.price||0)*(it.qty||1);}
function total(items){var s=0;items.forEach(function(it){s+=line(it);});return s;}
function count(items){var q=0;items.forEach(function(it){q+=(it.qty||1);});return q;}
function cards(q){return q+(q===1?' card':' cards');}
function when(iso){var d=new Date(iso);return isNaN(d)?'':d.toLocaleString([], {month:'short',day:'numeric',year:'numeric',hour:'numeric',minute:'2-digit'});}
function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,6);}
function copyItems(a){return JSON.parse(JSON.stringify(a||[]));}

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

var host=document.createElement('div');host.id=env.hostId||'card-receipt-host';
if(!dock)host.style.cssText='position:fixed;top:0;left:0;width:0;height:0;z-index:2147483647';
else host.style.cssText='display:block;height:100%';
env.mount.appendChild(host);
var R=host.attachShadow({mode:'open'});
R.innerHTML='<div class="panel '+(dock?'dock':'float')+'" role="'+(dock?'region':'dialog')+'" aria-label="Card receipt">'+
'<div class="hd"><h2><span class="ttl">Receipt</span><span class="cnt"></span></h2><button class="tb" data-act="saved"></button>'+
(dock?'':'<button class="ib" data-act="min" aria-label="Minimize" title="Minimize">&#8211;</button><button class="ib" data-act="close" aria-label="Close" title="Close">&#215;</button>')+'</div>'+
'<div class="st" role="status"></div>'+
'<div class="vw vr"><button class="add" data-act="add">Add this card</button><div class="msg" role="status"></div><ul class="list"></ul>'+
'<div class="ft"><details><summary>Prices and links</summary><div class="chk">'+P.map(function(p){return'<label class="c"><input type="checkbox" data-s="'+p[0]+'"'+(S.show[p[0]]?' checked':'')+'>'+p[1]+'</label>';}).join('')+'<label class="c wide"><input type="checkbox" data-o="links"'+(S.links?' checked':'')+'>Card links on receipt</label></div></details>'+
'<details><summary>Shop and customer</summary><div class="det"><label>Shop name<input data-g="shop" autocomplete="off"></label><label>Customer<input data-g="customer" autocomplete="off"></label><label class="wide">Customer email<input data-g="email" type="email" inputmode="email" autocomplete="off" placeholder="Optional"></label></div></details>'+
'<div class="tot"><span>Total</span><b class="sum">$0.00</b></div>'+
'<div class="acts"><button class="pbtn sv" data-act="save">Save</button><button class="pbtn" data-act="print">Print</button><button class="pbtn" data-act="email">Email</button><button class="cbtn" data-act="clear">Clear</button></div></div></div>'+
'<div class="vw vs" hidden><input class="srch" type="search" placeholder="Search by customer or card" aria-label="Search saved receipts"><div class="msg" role="status"></div><ul class="slist"></ul></div>'+
'</div>'+
(dock?'':'<div class="pill" hidden><button class="pa" data-act="add">Add this card</button><button class="po" data-act="open">Receipt <span class="psum"></span></button></div>');
applyCss(R,document,CSS);
var $=function(s){return R.querySelector(s);};
var panel=$('.panel'),pill=$('.pill'),list=$('.list'),slist=$('.slist'),vr=$('.vr'),vs=$('.vs');
var view='receipt';
function fillFields(){$('[data-g="shop"]').value=S.shop||'';$('[data-g="customer"]').value=S.customer||'';$('[data-g="email"]').value=S.email||'';}
fillFields();
var msgT;
function msg(text,kind){var el=(view==='saved'?vs:vr).querySelector('.msg');R.querySelectorAll('.msg').forEach(function(m){m.textContent='';});el.textContent=text||'';el.className='msg '+(kind||'');clearTimeout(msgT);if(kind==='ok')msgT=setTimeout(function(){el.textContent='';},4500);}
function find(id){for(var k=0;k<S.items.length;k++)if(S.items[k].id===id)return S.items[k];return null;}
function findSaved(id){for(var k=0;k<SAVED.length;k++)if(SAVED[k].id===id)return SAVED[k];return null;}

var armed=null,armT;
function disarm(){clearTimeout(armT);if(armed){armed.textContent=armed.dataset.orig;armed.classList.remove('arm');armed=null;}}
function confirmTap(b,label){if(armed===b){disarm();return true;}disarm();armed=b;b.dataset.orig=b.textContent;b.textContent=label;b.classList.add('arm');armT=setTimeout(disarm,4000);return false;}

function adjText(it){
if(it.price==null)return'Enter a price.';
if(same(it.price,it.median))return'';
for(var k=0;k<P.length;k++){if(P[k][0]!=='median'&&same(it.price,it[P[k][0]]))return'Using '+P[k][1]+(it.median==null?' (no Listed Median found)':'');}
if(it.median==null)return'Manual price';
var d=it.price-it.median;return'Adjusted '+(d>0?'+':'-')+'$'+Math.abs(d).toFixed(2)+' vs Listed Median';
}
function itemHtml(it){
var meta=[it.condition,it.number?'#'+it.number:'',it.rarity?'Rarity '+it.rarity:''].filter(Boolean).map(function(m){return'<span>'+esc(m)+'</span>';}).join('');
var a=adjText(it);
return'<li class="it" data-id="'+esc(it.id)+'"><div class="top"><div class="nm">'+esc(it.name)+
(it.url?'<a class="lk" href="'+esc(it.url)+'" target="_blank" rel="noopener">TCGplayer page</a>':'')+'</div><button class="x" data-act="rm" aria-label="Remove '+esc(it.name)+'">&#215;</button></div>'+
(meta?'<div class="meta">'+meta+'</div>':'')+
(shown().length?'<div class="ref">'+shown().map(function(p){return'<button class="chip" data-act="use" data-k="'+p[0]+'"'+(it[p[0]]==null?' disabled':'')+'>'+p[1]+'<b>'+fmt(it[p[0]])+'</b></button>';}).join('')+'</div>':'')+
'<div class="row"><label>Price<input class="pr" data-f="price" inputmode="decimal" value="'+(it.price==null?'':Number(it.price).toFixed(2))+'"></label>'+
'<label>Qty<input class="qt" data-f="qty" inputmode="numeric" value="'+(it.qty||1)+'"></label><span class="lt">'+fmt(line(it))+'</span></div>'+
'<input class="note" data-f="note" placeholder="Note, e.g. reason for price change" value="'+esc(it.note)+'">'+
'<span class="adj"'+(a?'':' hidden')+'>'+esc(a)+'</span></li>';
}
function refreshItem(li,it){
li.querySelector('.lt').textContent=fmt(line(it));
Array.prototype.forEach.call(li.querySelectorAll('.chip'),function(c){c.classList.toggle('on',same(it.price,it[c.dataset.k]));});
var a=adjText(it),ad=li.querySelector('.adj');ad.textContent=a;ad.hidden=!a;
}
function status(){
var st=$('.st'),t='',dirty=false;
if(view==='receipt'){
var sv=S.savedId&&findSaved(S.savedId);
if(sv){if(S.dirty){t='Editing saved receipt. Unsaved changes.';dirty=true;}else t='Saved '+when(sv.savedAt)+'.';}
else if(S.items.length){t='Not saved yet.';}
}
st.textContent=t;st.classList.toggle('dirty',dirty);
}
function totals(){
var sum=total(S.items),q=count(S.items);
$('.sum').textContent=fmt(sum);if(pill)$('.psum').textContent=fmt(sum);
if(view==='receipt')$('.cnt').textContent=q?cards(q):'';
}
function headButton(){var b=$('[data-act="saved"],[data-act="back"]');if(view==='saved'){b.dataset.act='back';b.textContent='Back';}else{b.dataset.act='saved';b.textContent='Saved receipts';}}
function render(){
list.innerHTML=S.items.length?S.items.map(itemHtml).join(''):'<li class="empty">No cards yet. Open a card’s page on TCGplayer, then tap Add this card.</li>';
Array.prototype.forEach.call(list.querySelectorAll('.it'),function(li){refreshItem(li,find(li.dataset.id));});
totals();status();headButton();
}
function savedHtml(r){
var names=(r.items||[]).map(function(it){return it.name;}).join(', ');
return'<li class="sr" data-sid="'+esc(r.id)+'"><div class="srt"><b>'+esc(r.customer||'No customer name')+'</b><span>'+fmt(r.total)+'</span></div>'+
'<div class="srm">'+esc(when(r.savedAt))+', '+cards(r.count||0)+(r.email?', '+esc(r.email):'')+'</div>'+
(names?'<div class="src">'+esc(names)+'</div>':'')+
'<div class="sra"><button class="sbtn" data-act="sopen">Open</button><button class="sdel" data-act="sdel">Delete</button>'+(S.savedId===r.id?'<span class="now">Open now</span>':'')+'</div></li>';
}
function renderSaved(){
var q=($('.srch').value||'').trim().toLowerCase();
var rows=SAVED.slice().sort(function(a,b){return String(b.savedAt).localeCompare(String(a.savedAt));}).filter(function(r){
if(!q)return true;var hay=[r.customer,r.email].concat((r.items||[]).map(function(it){return it.name;})).join(' ').toLowerCase();return hay.indexOf(q)>-1;});
slist.innerHTML=rows.length?rows.map(savedHtml).join(''):'<li class="empty">'+(SAVED.length?'No saved receipts match that search.':'No saved receipts yet. Tap Save on a receipt to keep it here.')+'</li>';
$('.cnt').textContent=SAVED.length?String(SAVED.length):'';
headButton();
}
function showView(v){
disarm();view=v;vr.hidden=v!=='receipt';vs.hidden=v!=='saved';
$('.ttl').textContent=v==='saved'?'Saved receipts':'Receipt';
if(v==='saved'){renderSaved();}else{render();}
status();
}
function expand(){if(pill)pill.hidden=true;panel.hidden=false;}
function minimize(){panel.hidden=true;if(pill)pill.hidden=false;}

function addCurrent(){
new Promise(function(res){res(env.readPage());}).then(function(pg){
if(!pg||!env.isCardSite(pg.host)){expand();msg('Open a card page on TCGplayer.com first, then tap Add this card.','warn');return;}
var d=parseText(pg.text);
d.name=(pg.h1||'').trim()||String(pg.title||'').split('|')[0].trim()||'Unknown card';
if(d.market==null&&d.median==null){expand();msg('No prices found on this page. Open a card’s product page, wait for the prices to load, then tap Add this card again.','warn');return;}
var url=String(pg.url||'').split('#')[0];
if(view!=='receipt')showView('receipt');
for(var k=0;k<S.items.length;k++){var ex=S.items[k];if(ex.url===url&&ex.condition===d.condition){ex.qty=(ex.qty||1)+1;changed();render();msg(d.name+' is already on the receipt. Quantity is now '+ex.qty+'.','ok');return;}}
var it={id:uid(),name:d.name,condition:d.condition,number:d.number,rarity:d.rarity,
market:d.market,median:d.median,recent:d.recent,low:d.low,high:d.high,listing:d.listing,price:d.median!=null?d.median:d.market,qty:1,note:'',url:url,added:new Date().toISOString()};
S.items.push(it);changed();render();
msg('Added '+d.name+(d.condition?' ('+d.condition+')':'')+'.','ok');
var last=list.lastElementChild;if(last&&!panel.hidden&&last.scrollIntoView)last.scrollIntoView({block:'nearest'});
},function(){msg('Couldn’t read this page. Wait for it to finish loading and try again.','warn');});
}

function saveReceipt(){
if(!S.items.length){msg('Add a card before saving.','warn');return;}
var now=new Date().toISOString(),r=S.savedId&&findSaved(S.savedId),isNew=!r;
if(!r){r={id:uid(),createdAt:now};SAVED.push(r);S.savedId=r.id;}
r.customer=S.customer||'';r.email=S.email||'';r.items=copyItems(S.items);r.total=total(S.items);r.count=count(S.items);r.savedAt=now;
saveList();S.dirty=false;save();render();
msg(isNew?'Receipt saved. Find it under Saved receipts.':'Changes saved.','ok');
}
function openSaved(id,b){
var r=findSaved(id);if(!r)return;
if(S.savedId===id&&!S.dirty){showView('receipt');msg('This receipt is already open.','ok');return;}
var risky=S.items.length&&(S.dirty||!S.savedId);
if(risky&&!confirmTap(b,'Tap again to replace')){msg('The current receipt has unsaved changes. Opening this one replaces it. Tap again to continue, or go back and tap Save first.','warn');return;}
S.items=copyItems(r.items);S.customer=r.customer||'';S.email=r.email||'';S.savedId=r.id;S.dirty=false;save();fillFields();
showView('receipt');msg('Opened the receipt for '+(r.customer||'no customer name')+'. Tap Save to keep any changes.','ok');
}
function deleteSaved(id,b){
var r=findSaved(id);if(!r)return;
if(!confirmTap(b,'Tap again to delete'))return;
SAVED=SAVED.filter(function(x){return x!==r;});saveList();
if(S.savedId===id){S.savedId=null;S.dirty=true;save();}
renderSaved();msg('Deleted the receipt for '+(r.customer||'no customer name')+'.','ok');
}

function pricesAsOf(){
var t=S.items.map(function(it){return new Date(it.added).getTime();}).filter(function(x){return!isNaN(x);});
if(!t.length)return new Date().toLocaleString();
var a=new Date(Math.min.apply(null,t)),b=new Date(Math.max.apply(null,t));
if(a.toDateString()===b.toDateString())return a.toLocaleString();
return a.toLocaleDateString()+' to '+b.toLocaleDateString();
}
function receiptText(){
var now=new Date().toLocaleString(),L=[];
L.push(S.shop||'Receipt');L.push(now);if(S.customer)L.push('Customer: '+S.customer);L.push('');
S.items.forEach(function(it){var q=it.qty||1;
L.push(it.name);
var sub=[it.condition,it.number?'#'+it.number:''].filter(Boolean).join(', ');if(sub)L.push('  '+sub);
L.push('  '+(q>1?q+' x '+fmt(it.price)+' = '+fmt(line(it)):fmt(it.price)));
var r=shown().filter(function(p){return it[p[0]]!=null;}).map(function(p){return p[1]+' '+fmt(it[p[0]]);}).join(', ');if(r)L.push('  '+r);
if(it.note)L.push('  Note: '+it.note);
if(S.links&&it.url)L.push('  '+it.url);
L.push('');});
L.push('Total: '+fmt(total(S.items)));L.push('');L.push('Prices as of '+pricesAsOf()+'.');
return L.join('\n');
}
function copyText(text,then){var p;try{p=env.copyText?env.copyText(text):navigator.clipboard.writeText(text);}catch(e){p=null;}Promise.resolve(p).then(then,then);}
function emailIt(){
if(!S.items.length){msg('Add a card before emailing.','warn');return;}
var subj=(S.shop?S.shop+' receipt':'Card receipt')+' '+new Date().toLocaleDateString();
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
var now=new Date().toLocaleString();
var rows=S.items.map(function(it){
var sub=[it.condition,it.number?'#'+it.number:''].filter(Boolean).join(', ');
var r=shown().filter(function(p){return it[p[0]]!=null;}).map(function(p){return p[1]+' '+fmt(it[p[0]]);}).join(', ');
return'<tr><td><b>'+esc(it.name)+'</b>'+(sub?'<div class="s">'+esc(sub)+'</div>':'')+(r?'<div class="s">'+esc(r)+'</div>':'')+
(it.note?'<div class="no">Note: '+esc(it.note)+'</div>':'')+
(S.links&&it.url?'<div class="u"><a href="'+esc(it.url)+'">'+esc(it.url)+'</a></div>':'')+'</td>'+
'<td class="n">'+(it.qty||1)+'</td><td class="n">'+fmt(it.price)+'</td><td class="n">'+((it.qty||1)>1?fmt(line(it)):'')+'</td></tr>';}).join('');
return'<main><header><h1>'+esc(S.shop||'Receipt')+'</h1><p>'+esc(now)+'</p>'+(S.customer?'<p>Customer: '+esc(S.customer)+'</p>':'')+'</header>'+
'<table><thead><tr><th>Card</th><th class="n">Qty</th><th class="n">Price</th><th class="n">Total</th></tr></thead><tbody>'+rows+'</tbody></table>'+
'<div class="tot"><span>Total</span><span>'+fmt(total(S.items))+'</span></div>'+
'<p class="f">Prices as of '+esc(pricesAsOf())+'.</p><button id="p">Print</button></main>';
}
function printIt(){
if(!S.items.length){msg('Add a card before printing.','warn');return;}
var w=window.open('','_blank');
if(!w){msg('The print window was blocked. Allow pop-ups for this site and try again.','warn');return;}
w.document.open();
w.document.write('<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Receipt</title></head><body>'+printBody()+'</body></html>');
w.document.close();
applyCss(w.document,w.document,PCSS);
var pb=w.document.getElementById('p');if(pb)pb.addEventListener('click',function(){w.print();});
setTimeout(function(){try{w.focus();w.print();}catch(e){}},400);
}

R.addEventListener('click',function(e){
var a=e.target.closest('a.lk');
if(a&&env.openLink){e.preventDefault();env.openLink(a.getAttribute('href'));return;}
var b=e.target.closest('[data-act]');if(!b)return;
var act=b.dataset.act,li=b.closest('.it'),it=li?find(li.dataset.id):null,sr=b.closest('.sr');
if(act!=='clear'&&act!=='sopen'&&act!=='sdel')disarm();
if(act==='add')addCurrent();
else if(act==='close'){if(env.onClose)env.onClose();host.remove();}
else if(act==='min')minimize();
else if(act==='open')expand();
else if(act==='saved')showView('saved');
else if(act==='back')showView('receipt');
else if(act==='save')saveReceipt();
else if(act==='print')printIt();
else if(act==='email')emailIt();
else if(act==='sopen'&&sr)openSaved(sr.dataset.sid,b);
else if(act==='sdel'&&sr)deleteSaved(sr.dataset.sid,b);
else if(act==='clear'){
if(!S.items.length&&!S.savedId){msg('The receipt is already empty.','ok');return;}
if(S.items.length&&(S.dirty||!S.savedId)&&!confirmTap(b,'Tap again to clear'))return;
disarm();S.items=[];S.customer='';S.email='';S.savedId=null;S.dirty=false;fillFields();save();render();msg('Started a new receipt.','ok');}
else if(act==='rm'&&it){S.items=S.items.filter(function(x){return x!==it;});changed();render();}
else if(act==='use'&&it&&it[b.dataset.k]!=null){it.price=it[b.dataset.k];li.querySelector('.pr').value=Number(it.price).toFixed(2);changed();refreshItem(li,it);totals();}
});
R.addEventListener('input',function(e){
var el=e.target;
if(el.classList.contains('srch')){renderSaved();return;}
if(el.dataset.s){S.show[el.dataset.s]=el.checked;save();render();return;}
if(el.dataset.o){S[el.dataset.o]=el.checked;save();return;}
if(el.dataset.g){S[el.dataset.g]=el.value;if(el.dataset.g==='shop')save();else changed();return;}
var f=el.dataset.f;if(!f)return;
var li=el.closest('.it'),it=li&&find(li.dataset.id);if(!it)return;
if(f==='price')it.price=num(el.value);
else if(f==='qty'){var q=parseInt(el.value,10);it.qty=q>0?q:1;}
else it.note=el.value;
changed();refreshItem(li,it);totals();
});
if(!dock)['keydown','keyup','keypress'].forEach(function(t){R.addEventListener(t,function(e){e.stopPropagation();});});
render();
return{add:addCurrent,save:saveReceipt,print:printIt,email:emailIt,showSaved:function(){showView('saved');},_parse:parseText};
}
