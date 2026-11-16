const { app, BrowserWindow, ipcMain, shell, Menu, clipboard, dialog, net } = require('electron');
const path = require('path');
const fs = require('fs');

app.setName('Card Receipt');
// Present as a normal Chrome browser to websites.
app.userAgentFallback = app.userAgentFallback.replace(/\(KHTML, like Gecko\) .*?Chrome\//, '(KHTML, like Gecko) Chrome/').replace(/ Electron\/\S+/, '');

const TCG_HOME = 'https://www.tcgplayer.com/';
const isMac = process.platform === 'darwin';
const ICON = path.join(__dirname, 'icon.png');
const FILES = {
  'cardReceipt.v1': 'current-receipt.json',
  'cardReceipt.saved.v1': 'saved-receipts.json',
  'cardReceipt.inventory.v1': 'inventory.json',
  'cardReceipt.settings.v1': 'settings.json'
};
const RELEASES = 'https://github.com/JD-Way/card-receipt/releases/latest';
const RELEASES_API = 'https://api.github.com/repos/JD-Way/card-receipt/releases/latest';
let win = null;

function dataFile(key) {
  const name = FILES[key];
  return name ? path.join(app.getPath('userData'), name) : null;
}
function readJSON(file) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { return null; }
}
function writeJSON(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = file + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(value, null, 1));
  if (fs.existsSync(file)) { try { fs.copyFileSync(file, file.replace(/\.json$/, '.backup.json')); } catch (e) {} }
  fs.renameSync(tmp, file);
}

ipcMain.on('store-get', (e, key) => { const f = dataFile(key); e.returnValue = f ? readJSON(f) : null; });
ipcMain.on('store-set', (e, key, value) => {
  const f = dataFile(key);
  try { if (f) writeJSON(f, value); e.returnValue = true; } catch (err) { e.returnValue = false; }
});
ipcMain.on('open-mail', (_e, href) => { if (typeof href === 'string' && href.startsWith('mailto:')) shell.openExternal(href); });
ipcMain.handle('copy-text', (_e, text) => { clipboard.writeText(String(text || '')); return true; });
ipcMain.handle('save-file', async (e, name, text) => {
  const safe = String(name || 'card-receipt.txt').replace(/[\\/:*?"<>|]+/g, '-');
  const ext = path.extname(safe).slice(1).toLowerCase();
  const filters = ext === 'csv' ? [{ name: 'CSV file', extensions: ['csv'] }] : ext === 'json' ? [{ name: 'Backup file', extensions: ['json'] }] : [];
  const parent = BrowserWindow.fromWebContents(e.sender) || win;
  const r = await dialog.showSaveDialog(parent, { defaultPath: path.join(app.getPath('documents'), safe), filters });
  if (r.canceled || !r.filePath) return 'canceled';
  try { fs.writeFileSync(r.filePath, String(text == null ? '' : text), 'utf8'); return 'saved'; } catch (err) { return 'failed'; }
});
ipcMain.on('open-release', () => shell.openExternal(RELEASES));

function newer(a, b) {
  const pa = String(a).replace(/^v/, '').split('.').map(Number), pb = String(b).replace(/^v/, '').split('.').map(Number);
  for (let i = 0; i < 3; i++) { if ((pa[i] || 0) > (pb[i] || 0)) return true; if ((pa[i] || 0) < (pb[i] || 0)) return false; }
  return false;
}
async function checkForUpdate() {
  try {
    const res = await net.fetch(RELEASES_API, { headers: { 'Accept': 'application/vnd.github+json', 'User-Agent': 'Card-Receipt/' + app.getVersion() } });
    if (!res.ok) return;
    const rel = await res.json();
    if (rel && rel.tag_name && newer(rel.tag_name, app.getVersion()) && win && !win.isDestroyed()) {
      win.webContents.send('update', { version: String(rel.tag_name).replace(/^v/, '') });
    }
  } catch (e) { /* offline or rate limited: try again next launch */ }
}

function isTcg(url) { return /^https:\/\/([a-z0-9-]+\.)*tcgplayer\.com(\/|$)/i.test(url || ''); }

function send(cmd) { if (win && !win.isDestroyed()) win.webContents.send('menu', cmd); }

function buildMenu() {
  const template = [
    ...(isMac ? [{ role: 'appMenu' }] : []),
    { label: 'Receipt', submenu: [
      { label: 'Add this card', accelerator: 'CmdOrCtrl+D', click: () => send('add') },
      { label: 'Save receipt', accelerator: 'CmdOrCtrl+S', click: () => send('save') },
      { label: 'Print receipt', accelerator: 'CmdOrCtrl+P', click: () => send('print') },
      { label: 'Email receipt', accelerator: 'CmdOrCtrl+E', click: () => send('email') },
      { label: 'Scan a barcode', accelerator: 'CmdOrCtrl+B', click: () => send('scan') },
      { type: 'separator' },
      { label: 'Saved receipts', accelerator: 'CmdOrCtrl+O', click: () => send('saved') },
      { label: 'Inventory', accelerator: 'CmdOrCtrl+I', click: () => send('inventory') },
      { label: 'Settings', accelerator: 'CmdOrCtrl+,', click: () => send('settings') },
      { type: 'separator' },
      { label: 'Show data folder', click: () => {
        const f = dataFile('cardReceipt.saved.v1');
        if (fs.existsSync(f)) shell.showItemInFolder(f); else shell.openPath(app.getPath('userData'));
      } },
      { label: 'Check for updates', click: () => shell.openExternal(RELEASES) },
      ...(isMac ? [] : [{ type: 'separator' }, { role: 'quit', label: 'Exit' }])
    ] },
    { role: 'editMenu' },
    { label: 'View', submenu: [
      { label: 'Back', accelerator: isMac ? 'Cmd+[' : 'Alt+Left', click: () => send('back') },
      { label: 'Forward', accelerator: isMac ? 'Cmd+]' : 'Alt+Right', click: () => send('forward') },
      { label: 'Reload page', accelerator: 'CmdOrCtrl+R', click: () => send('reload') },
      { label: 'TCGplayer home', click: () => send('home') },
      { type: 'separator' },
      { label: 'Search TCGplayer', accelerator: 'CmdOrCtrl+F', click: () => send('search') },
      { type: 'separator' },
      { role: 'resetZoom' }, { role: 'zoomIn' }, { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ] },
    { role: 'windowMenu' }
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

function editMenu(contents, params) {
  const items = [];
  if (params.linkURL && contents.getType() === 'webview') {
    items.push({ label: 'Open link', click: () => contents.loadURL(params.linkURL) });
    items.push({ label: 'Copy link', click: () => clipboard.writeText(params.linkURL) });
    items.push({ type: 'separator' });
  }
  if (params.isEditable) items.push({ role: 'cut' }, { role: 'copy' }, { role: 'paste' }, { role: 'selectAll' });
  else if (params.selectionText) items.push({ role: 'copy' });
  if (contents.getType() === 'webview') {
    if (items.length) items.push({ type: 'separator' });
    items.push({ label: 'Back', enabled: contents.navigationHistory.canGoBack(), click: () => contents.navigationHistory.goBack() });
    items.push({ label: 'Reload', click: () => contents.reload() });
  }
  if (items.length) Menu.buildFromTemplate(items).popup();
}

app.on('web-contents-created', (_e, contents) => {
  contents.on('will-attach-webview', (ev, webPreferences, params) => {
    delete webPreferences.preload;
    webPreferences.nodeIntegration = false;
    webPreferences.contextIsolation = true;
    webPreferences.sandbox = true;
    if (!isTcg(params.src)) ev.preventDefault();
  });
  contents.on('context-menu', (_ev, params) => editMenu(contents, params));
  if (contents.getType() === 'webview') {
    contents.setWindowOpenHandler(({ url }) => {
      if (isTcg(url)) contents.loadURL(url);
      else if (/^https?:/i.test(url)) shell.openExternal(url);
      return { action: 'deny' };
    });
    contents.on('will-navigate', (ev, url) => { if (!/^https?:/i.test(url)) { ev.preventDefault(); if (/^mailto:/i.test(url)) shell.openExternal(url); } });
  }
});

function createWindow() {
  win = new BrowserWindow({
    width: 1360, height: 880, minWidth: 960, minHeight: 600,
    title: 'Card Receipt', icon: ICON, backgroundColor: '#EEF0F4', autoHideMenuBar: true,
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, sandbox: true, nodeIntegration: false, webviewTag: true }
  });
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url === 'about:blank' || url === '') {
      return { action: 'allow', overrideBrowserWindowOptions: { width: 780, height: 920, title: 'Receipt', icon: ICON, autoHideMenuBar: true, backgroundColor: '#FFFFFF', webPreferences: { sandbox: true, contextIsolation: true } } };
    }
    if (/^https?:/i.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });
  win.webContents.on('will-navigate', (ev, url) => {
    if (!url.startsWith('file:')) { ev.preventDefault(); if (/^(https?|mailto):/i.test(url)) shell.openExternal(url); }
  });
  win.loadFile(path.join(__dirname, 'index.html'));
  win.webContents.once('did-finish-load', () => { setTimeout(checkForUpdate, 3000); });
  win.on('closed', () => { win = null; });
}

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', () => { if (win) { if (win.isMinimized()) win.restore(); win.focus(); } });
  app.whenReady().then(() => {
    buildMenu();
    createWindow();
    app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
  });
  app.on('window-all-closed', () => { if (!isMac) app.quit(); });
}
