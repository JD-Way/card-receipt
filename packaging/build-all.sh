#!/usr/bin/env bash
# Builds the Windows and Mac zips into dist/. Usage: packaging/build-all.sh 1.0.0
set -euo pipefail
VERSION="${1:-1.0.0}"
[[ "$VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]] || { echo "Version must look like 1.2.3"; exit 1; }
ELECTRON=44.4.0
RCS_URL="https://github.com/indygreg/apple-platform-rs/releases/download/apple-codesign%2F0.29.0/apple-codesign-0.29.0-x86_64-unknown-linux-musl.tar.gz"
RCS_SHA=dbe85cedd8ee4217b64e9a0e4c2aef92ab8bcaaa41f20bde99781ff02e600002
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PKG="$ROOT/packaging"
WORK="$ROOT/.work"; DIST="$ROOT/dist"
rm -rf "$WORK" "$DIST"; mkdir -p "$WORK/dl" "$DIST"

echo "Downloading Electron $ELECTRON"
BASE="https://github.com/electron/electron/releases/download/v$ELECTRON"
cd "$WORK/dl"
curl -fsSL -o SHASUMS256.txt "$BASE/SHASUMS256.txt"
for P in win32-x64 darwin-arm64 darwin-x64; do
  F="electron-v$ELECTRON-$P.zip"
  [ -f "$F" ] || curl -fsSL -o "$F" "$BASE/$F"
  grep " \*$F\$" SHASUMS256.txt | sed 's/ \*/  /' | sha256sum -c -
done
curl -fsSL -o rcodesign.tgz "$RCS_URL"
echo "$RCS_SHA  rcodesign.tgz" | sha256sum -c -
tar xzf rcodesign.tgz
RCS="$(ls -d "$WORK"/dl/apple-codesign-*/)rcodesign"

echo "Preparing app files"
APP="$WORK/app"; mkdir -p "$APP"
cp "$ROOT"/app/{package.json,main.js,preload.js,index.html,app.css,renderer.js,core.js,icon.png} "$APP/"
python3 - "$APP/package.json" "$VERSION" <<'PY'
import json,sys
p,v=sys.argv[1],sys.argv[2]; d=json.load(open(p)); d['version']=v; json.dump(d,open(p,'w'),indent=2)
PY

echo "Building Windows"
W="$WORK/win/Card Receipt"; mkdir -p "$W"
unzip -q "$WORK/dl/electron-v$ELECTRON-win32-x64.zip" -d "$W"
rm -f "$W/resources/default_app.asar"
mkdir -p "$W/resources/app"; cp "$APP"/* "$W/resources/app/"; cp "$ROOT/app/icon.ico" "$W/resources/app/"
mv "$W/electron.exe" "$W/Card Receipt.exe"
find "$W/locales" -name '*.pak' ! -name 'en-US.pak' ! -name 'en-GB.pak' ! -name 'es.pak' ! -name 'es-419.pak' ! -name 'fr.pak' -delete
python3 - "$W/Card Receipt.exe" "$ROOT/app/icon.png" "$VERSION" "$PKG" <<'PY'
import io,sys
sys.path.insert(0,sys.argv[4]); import peicon
from PIL import Image
exe,icon,ver=sys.argv[1],sys.argv[2],sys.argv[3]
src=Image.open(icon).convert('RGBA'); pngs=[]
for s in (16,32,48,256):
    b=io.BytesIO(); src.resize((s,s),Image.LANCZOS).save(b,'PNG',optimize=True); pngs.append((s,b.getvalue()))
peicon.set_icon(exe,pngs)
peicon.set_strings(exe,{'FileDescription':'Card Receipt','ProductName':'Card Receipt','CompanyName':'Card Receipt','LegalCopyright':'Card Receipt',
  'InternalName':'Card Receipt','OriginalFilename':'Card Receipt.exe','FileVersion':ver,'ProductVersion':ver})
print(peicon.get_strings(exe)['FileDescription'])
PY
sed 's/$/\r/' "$PKG/README-windows.txt" > "$W/Read me first.txt"
(cd "$WORK/win" && zip -qr -9 "$DIST/Card-Receipt-Windows.zip" "Card Receipt")

build_mac() {
  ARCH=$1; OUT=$2
  echo "Building Mac $ARCH"
  D="$WORK/mac-$ARCH"; mkdir -p "$D"; cd "$D"
  unzip -q "$WORK/dl/electron-v$ELECTRON-darwin-$ARCH.zip"
  mv Electron.app "Card Receipt.app"
  A="Card Receipt.app/Contents"
  rm -f "$A/Resources/default_app.asar"
  mkdir -p "$A/Resources/app"; cp "$APP"/* "$A/Resources/app/"
  cp "$PKG/icon.icns" "$A/Resources/electron.icns"
  python3 - "$A" "$VERSION" <<'PY'
import plistlib,sys,os,glob
A,v=sys.argv[1],sys.argv[2]
p=os.path.join(A,'Info.plist'); d=plistlib.load(open(p,'rb'))
d.update({'CFBundleDisplayName':'Card Receipt','CFBundleName':'Card Receipt','CFBundleIdentifier':'com.cardreceipt.desktop',
 'CFBundleShortVersionString':v,'CFBundleVersion':v,'NSHumanReadableCopyright':'Card Receipt','LSApplicationCategoryType':'public.app-category.business'})
d.pop('ElectronAsarIntegrity',None); plistlib.dump(d,open(p,'wb'))
for h in glob.glob(os.path.join(A,'Frameworks','*.app')):
    p=os.path.join(h,'Contents','Info.plist'); d=plistlib.load(open(p,'rb'))
    d['CFBundleExecutable']=os.listdir(os.path.join(h,'Contents','MacOS'))[0]
    d['CFBundleIdentifier']='com.cardreceipt.desktop.helper'+d['CFBundleName'].replace('Electron Helper','').replace(' (','.').replace(')','').lower()
    plistlib.dump(d,open(p,'wb'))
PY
  for L in "$A/Resources/"*.lproj "$A/Frameworks/Electron Framework.framework/Versions/A/Resources/"*.lproj; do
    case "$(basename "$L")" in en.lproj|en_GB.lproj|es.lproj|es_419.lproj|fr.lproj|Base.lproj) ;; *) rm -rf "$L" ;; esac
  done
  "$RCS" sign "Card Receipt.app" > sign.log 2>&1 || { tail -20 sign.log; exit 1; }
  if grep -q "could not find main executable" sign.log; then echo "Signing missed a helper app"; exit 1; fi
  cp "$PKG/README-mac.txt" "Read me first.txt"
  zip -qry -9 "$DIST/$OUT" "Card Receipt.app" "Read me first.txt"
}
build_mac arm64 Card-Receipt-Mac-AppleSilicon.zip
build_mac x64 Card-Receipt-Mac-Intel.zip
ls -la "$DIST"
