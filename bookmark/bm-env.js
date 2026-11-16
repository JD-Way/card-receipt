CardReceipt({
mode:'float',
mount:document.body,
hostId:HOST,
store:{get:function(k){try{return JSON.parse(localStorage.getItem(k));}catch(e){return null;}},set:function(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true;}catch(e){return false;}}},
readPage:function(){return cardReceiptReadPage();},
isCardSite:function(h){return/(^|\.)tcgplayer\.com$/i.test(h||'');}
});
