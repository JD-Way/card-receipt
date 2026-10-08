#!/bin/bash
set -e
ARCH=$1   # arm64 or x64
RCS=/home/claude/dl/apple-codesign-0.29.0-x86_64-unknown-linux-musl/rcodesign
D=/home/claude/build/mac-$ARCH
rm -rf "$D" && mkdir -p "$D" && cd "$D"
unzip -q /home/claude/dl/electron-v44.4.0-darwin-$ARCH.zip
mv Electron.app "Card Receipt.app"
A="Card Receipt.app/Contents"
rm -f "$A/Resources/default_app.asar"
mkdir -p "$A/Resources/app"
cp /home/claude/cr/app/{package.json,main.js,preload.js,index.html,app.css,renderer.js,core.js,icon.png} "$A/Resources/app/"
cp /home/claude/cr/icon.icns "$A/Resources/electron.icns"
python3 - "$A/Info.plist" <<'PY'
import plistlib,sys
p=sys.argv[1]; d=plistlib.load(open(p,'rb'))
d.update({'CFBundleDisplayName':'Card Receipt','CFBundleName':'Card Receipt','CFBundleIdentifier':'com.cardreceipt.desktop',
 'CFBundleShortVersionString':'1.0.0','CFBundleVersion':'1.0.0','NSHumanReadableCopyright':'Card Receipt','LSApplicationCategoryType':'public.app-category.business'})
d.pop('ElectronAsarIntegrity',None)
plistlib.dump(d,open(p,'wb'))
PY
python3 - "$A/Frameworks" <<'PY'
import plistlib,sys,os,glob
for h in glob.glob(os.path.join(sys.argv[1],'*.app')):
    p=os.path.join(h,'Contents','Info.plist'); d=plistlib.load(open(p,'rb'))
    exe=os.listdir(os.path.join(h,'Contents','MacOS'))[0]
    d['CFBundleExecutable']=exe; d['CFBundleIdentifier']='com.cardreceipt.desktop.helper'+d['CFBundleName'].replace('Electron Helper','').replace(' (','.').replace(')','').lower()
    plistlib.dump(d,open(p,'wb'))
PY
for d in "$A/Resources/"*.lproj "$A/Frameworks/Electron Framework.framework/Versions/A/Resources/"*.lproj; do
  case "$(basename "$d")" in en.lproj|en_GB.lproj|es.lproj|es_419.lproj|fr.lproj|Base.lproj) ;; *) rm -rf "$d" ;; esac
done
$RCS sign "Card Receipt.app" > sign.log 2>&1 || { tail -20 sign.log; exit 1; }
$RCS verify "Card Receipt.app/Contents/MacOS/Electron" 2>&1 | tail -2 || true
rm -f "../Card-Receipt-Mac-$ARCH.zip"
mkdir -p pkg && mv "Card Receipt.app" pkg/
cp /home/claude/build/README-mac.txt "pkg/Read me first.txt"
(cd pkg && zip -qry -9 "../../Card-Receipt-Mac-$ARCH.zip" "Card Receipt.app" "Read me first.txt")
ls -la ../Card-Receipt-Mac-$ARCH.zip
