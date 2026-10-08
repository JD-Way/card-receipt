import struct, sys
def parse(f):
    pe=struct.unpack_from('<I',f,0x3c)[0]
    nsec=struct.unpack_from('<H',f,pe+6)[0]; optsz=struct.unpack_from('<H',f,pe+20)[0]
    magic=struct.unpack_from('<H',f,pe+24)[0]
    dd=pe+24+(112 if magic==0x20b else 96)
    rva,rsize=struct.unpack_from('<II',f,dd+8*2)
    secs=[]; so=pe+24+optsz
    for i in range(nsec):
        name,vsize,va,rawsz,rawptr=struct.unpack_from('<8sIIII',f,so+40*i)
        secs.append((name.rstrip(b'\0'),va,vsize,rawptr,rawsz))
    return rva,rsize,secs,pe
def r2o(secs,rva):
    for n,va,vs,rp,rs in secs:
        if va<=rva<va+max(vs,rs): return rva-va+rp
    raise Exception('rva')
def walk(f,base,off,depth,path,out):
    named,ids=struct.unpack_from('<HH',f,off+12)
    for i in range(named+ids):
        nid,ptr=struct.unpack_from('<II',f,off+16+8*i)
        key=nid if not nid&0x80000000 else ('name',nid&0x7fffffff)
        if ptr&0x80000000: walk(f,base,base+(ptr&0x7fffffff),depth+1,path+[key],out)
        else:
            e=base+ptr; drva,dsz=struct.unpack_from('<II',f,e); out.append((path+[key],e,drva,dsz))
def entries(f):
    rva,rsize,secs,pe=parse(f); base=r2o(secs,rva); out=[]
    walk(f,base,base,0,[],out); return out,secs
if __name__=='__main__':
    f=open(sys.argv[1],'rb').read(); out,secs=entries(f)
    for p,e,drva,dsz in out:
        if p[0] in (3,14): print(p,dsz)

def set_icon(exe, pngs):
    f=bytearray(open(exe,'rb').read()); out,secs=entries(bytes(f))
    icons=sorted([(p[1],e,drva,dsz) for p,e,drva,dsz in out if p[0]==3])
    grp=[(e,drva,dsz) for p,e,drva,dsz in out if p[0]==14][0]
    assert len(pngs)<=len(icons)
    gent=[]
    for (size,data),(iid,e,drva,dsz) in zip(pngs,icons):
        assert len(data)<=dsz,(size,len(data),dsz)
        o=r2o(secs,drva); f[o:o+dsz]=data+b'\0'*(dsz-len(data)); struct.pack_into('<I',f,e+4,len(data))
        w=0 if size>=256 else size
        gent.append(struct.pack('<BBBBHHIH',w,w,0,0,1,32,len(data),iid))
    g=struct.pack('<HHH',0,1,len(gent))+b''.join(gent)
    e,drva,dsz=grp; assert len(g)<=dsz
    o=r2o(secs,drva); f[o:o+dsz]=g+b'\0'*(dsz-len(g)); struct.pack_into('<I',f,e+4,len(g))
    open(exe,'wb').write(f)

def _pad(b): return b+b'\0'*((4-len(b)%4)%4)
def _parse_node(d,o):
    L,VL,T=struct.unpack_from('<HHH',d,o); k=o+6; e=k
    while d[e:e+2]!=b'\0\0': e+=2
    key=d[k:e].decode('utf-16-le'); p=e+2; p+=(4-(p-o)%4)%4
    vlen=VL*2 if T==1 else VL; val=d[p:p+vlen]; p+=vlen; p+=(4-(p-o)%4)%4
    kids=[]
    while p<o+L:
        c=_parse_node(d,p); kids.append(c); p+=c['len']; p+=(4-(p-o)%4)%4
    return {'key':key,'type':T,'val':val,'kids':kids,'len':L}
def _ser(n):
    if n['type']==1:
        s=n['val'] if isinstance(n['val'],str) else n['val'].decode('utf-16-le').rstrip('\0')
        val=(s+'\0').encode('utf-16-le') if s or n['val'] else b''; vl=len(val)//2
    else: val=n['val']; vl=len(val)
    b=struct.pack('<HHH',0,vl,n['type'])+(n['key']+'\0').encode('utf-16-le'); b=_pad(b)+val
    for c in n['kids']: b=_pad(b)+_ser(c)
    return struct.pack('<H',len(b))+b[2:]
def set_strings(exe, strings):
    f=bytearray(open(exe,'rb').read()); out,secs=entries(bytes(f))
    p,e,drva,dsz=[x for x in out if x[0][0]==16][0]
    o=r2o(secs,drva); root=_parse_node(bytes(f[o:o+dsz]),0)
    def visit(n):
        if n['type']==1 and n['key'] in strings and not n['kids']: n['val']=strings[n['key']]
        for c in n['kids']: visit(c)
    visit(root); nb=_ser(root); assert len(nb)<=dsz,(len(nb),dsz)
    f[o:o+dsz]=nb+b'\0'*(dsz-len(nb)); struct.pack_into('<I',f,e+4,len(nb)); open(exe,'wb').write(f)
def get_strings(exe):
    f=open(exe,'rb').read(); out,secs=entries(f); p,e,drva,dsz=[x for x in out if x[0][0]==16][0]
    o=r2o(secs,drva); root=_parse_node(f[o:o+dsz],0); res={}
    def visit(n):
        if n['type']==1 and not n['kids']: res[n['key']]=n['val'].decode('utf-16-le').rstrip('\0')
        for c in n['kids']: visit(c)
    visit(root); return res
