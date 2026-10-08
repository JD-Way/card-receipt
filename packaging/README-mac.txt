Card Receipt for Mac

1. Drag "Card Receipt" into your Applications folder.
2. Double-click it. The first time, macOS says it can't verify the app.
   Click Done (not Move to Trash).
3. Open System Settings, then Privacy & Security. Scroll down and click
   "Open Anyway" next to Card Receipt, then confirm.
   (On older macOS versions you can instead right-click the app and choose Open.)

You only need to do this once.

If macOS says the app "is damaged", open Terminal and run:
  xattr -cr "/Applications/Card Receipt.app"
then open the app again.

Saved receipts are kept on this Mac. To find the file, choose
Receipt > Show saved receipts file from the menu bar.
