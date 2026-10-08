# Card Receipt

Build card receipts from TCGplayer prices. Open a card's page on TCGplayer, click **Add this card**, and its Market Price, Listed Median, other price points and page link go onto a receipt. Adjust prices, add notes, then save, print or email the receipt.

## Download

Get the latest version from the **Releases** page (right side of this page):

- **Card-Receipt-Windows.zip** for Windows 10 or 11 (64-bit)
- **Card-Receipt-Mac-AppleSilicon.zip** for Macs with an M1 chip or newer
- **Card-Receipt-Mac-Intel.zip** for Macs with an Intel processor

The Mac versions need macOS 13 Ventura or newer. Each zip has a "Read me first" file with install steps.

### Windows

1. Right-click the zip and choose **Extract All**. Keep the **Card Receipt** folder somewhere permanent, like Documents.
2. Double-click **Card Receipt.exe**.
3. If Windows shows "Windows protected your PC", click **More info**, then **Run anyway**. This only happens the first time.

### Mac

1. Double-click the zip to unzip it, then drag **Card Receipt** into **Applications**.
2. Open it. When macOS says it can't verify the app, click **Done**.
3. Go to **System Settings > Privacy & Security**, click **Open Anyway** next to Card Receipt, and confirm. This only happens the first time.

If macOS says the app is damaged, run `xattr -cr "/Applications/Card Receipt.app"` in Terminal and open it again.

## Phones and tablets

On iPhone, iPad and Android, use the bookmark version: a bookmark that adds the same receipt panel to TCGplayer in the browser. The setup page is in `bookmark/`.

## Saved receipts

Saved receipts stay on the computer or browser that made them. In the desktop app, choose **Receipt > Show saved receipts file** to find the file and back it up.

## Project layout

- `app/` desktop app source (Electron 44). `core.js` is the receipt panel shared with the bookmark version.
- `bookmark/` bookmark version and its setup page. Run `python3 build.py` to rebuild `setup-page.html`.
- `packaging/` scripts and icons used to package the Windows and Mac builds.

## Publishing a new version

Open the **Actions** tab, choose **Build and publish apps**, click **Run workflow**, enter a new version number (like 1.0.1) and click the green **Run workflow** button. GitHub builds the three zips and publishes them on the Releases page in about 10 minutes.
