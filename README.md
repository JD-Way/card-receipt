# Card Receipt

Build card receipts from TCGplayer prices and your own inventory. Open a card's page on TCGplayer and click **Add this card**, or scan a barcode from your inventory. Adjust prices, add notes, then save, print or email the receipt.

Sort the receipt by name, price or card number, or drag cards into any order.

**Export** prints the receipt, emails it with a PDF attached, or saves it as a PDF, a PNG picture, a CSV file or an Excel (.xls) file. The CSV and Excel files have these columns, one row per card: Item #, Item Name, Attribute, Size, Qty, Price, Ext Price, Tax Code. Item #, Attribute, Size and Tax Code are left blank, and there is no total row.

Also included: an inventory with barcode labels and stock counts, CSV import and export, an average of the checked prices, numbered receipts, a shop logo on printed receipts, color themes, and one-file backups.

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

## Your data

Receipts, inventory and settings stay on the computer or browser that made them. Use **Settings > Back up all data** to save everything to one file, and **Restore backup** to load it on another device. In the desktop app, **Receipt > Show data folder** opens the folder with the data files.

## Emailing receipts

**Email with PDF** attaches the receipt as a PDF:

- **Windows desktop app:** opens your default email program (classic Outlook, Thunderbird and others that support "Send to mail recipient") with the PDF attached.
- **Mac desktop app:** opens a new message in Apple Mail or Outlook with the PDF attached. The first time, macOS asks to let Card Receipt control Mail. Click OK.
- **Phones, tablets and browsers:** opens the share menu with the PDF attached. Choose Mail or your email app.

If none of these work (for example, you use Gmail in a web browser), the PDF is saved, its folder opens, and a new email opens with the receipt as text so you can drag the PDF in.

## Barcode scanners

Any USB or Bluetooth barcode scanner that types like a keyboard works. Click the barcode box on the receipt (or press Ctrl+B / Cmd+B in the desktop app) and scan. Set the scanner to send Enter after each scan, which is the usual factory setting.

## Inventory CSV columns

Import recognizes these column names (others are ignored): Barcode, Name, Game (or Product Line), Set, Condition, Number, Rarity, Your Price (or Price), In Stock (or Quantity), TCGplayer Page, Market Price and Listed Median. A TCGplayer seller pricing export also works: it uses Product Name, Set Name, TCG Marketplace Price, Total Quantity and TCGplayer Id. Rows that match an existing barcode, or the same TCGplayer page and condition, update that item.

## Project layout

- `app/` desktop app source (Electron 44). `core.js` is the receipt panel shared with the bookmark version.
- `bookmark/` bookmark version and its setup page. Run `python3 bookmark/build.py` to build `bookmark/setup-page.html` from `app/core.js`.
- `packaging/` scripts and icons used to package the Windows and Mac builds.

## Publishing a new version

Open the **Actions** tab, choose **Build and publish apps**, click **Run workflow**, enter a new version number (like 1.0.1) and click the green **Run workflow** button. GitHub builds the three zips and publishes them on the Releases page in about 10 minutes.
