# Builds bookmark/setup-page.html from app/core.js, bm-env.js and install.html.
import json, os, re, urllib.parse
here = os.path.dirname(os.path.abspath(__file__))
core = open(os.path.join(here, '..', 'app', 'core.js'), encoding='utf-8').read()
env = open(os.path.join(here, 'bm-env.js'), encoding='utf-8').read()
src = "(function(){\nvar HOST='card-receipt-host';\nvar old=document.getElementById(HOST);\nif(old){old.remove();return;}\n" + core + "\n" + env + "\n})();"
open(os.path.join(here, 'receipt.js'), 'w', encoding='utf-8').write(src)
lines = [l.strip() for l in src.splitlines()]
lines = [l for l in lines if l and not re.fullmatch(r'/\*.*\*/', l)]
src = '\n'.join(lines)
bm = 'javascript:' + urllib.parse.quote(src, safe="-_.!~*'()")
h = open(os.path.join(here, 'install.html'), encoding='utf-8').read()
assert '__BOOKMARKLET__' in h
open(os.path.join(here, 'setup-page.html'), 'w', encoding='utf-8').write(h.replace('__BOOKMARKLET__', json.dumps(bm)))
print('bookmarklet length', len(bm))
