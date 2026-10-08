CardReceipt({
mode:'float',
mount:document.body,
hostId:HOST,
store:{get:function(k){try{return JSON.parse(localStorage.getItem(k));}catch(e){return null;}},set:function(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}},
readPage:function(){var h=document.querySelector('h1');return{text:document.body.innerText,url:location.href,h1:h?h.innerText:'',title:document.title,host:location.hostname};},
isCardSite:function(h){return/(^|\.)tcgplayer\.com$/i.test(h||'');}
});
