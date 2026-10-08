import json,urllib.parse
core=open('core.js').read(); env=open('bm-env.js').read()
src="(function(){\nvar HOST='card-receipt-host';\nvar old=document.getElementById(HOST);\nif(old){old.remove();return;}\n"+core+"\n"+env+"\n})();"
open('receipt.js','w').write(src)
src='\n'.join(l.strip() for l in src.splitlines() if l.strip())
bm='javascript:'+urllib.parse.quote(src,safe="-_.!~*'()")
h=open('install.html').read()
assert '__BOOKMARKLET__' in h
open('setup-page.html','w').write(h.replace('__BOOKMARKLET__',json.dumps(bm)))
print('bookmarklet length',len(bm))
