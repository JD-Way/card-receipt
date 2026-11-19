const { app, BrowserWindow, ipcMain, shell, Menu, clipboard, dialog, net } = require('electron');
const path = require('path');
const fs = require('fs');
const { execFile } = require('child_process');

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
const FILE_TYPES = {
  csv: 'CSV file', json: 'Backup file', pdf: 'PDF document', png: 'PNG image', txt: 'Text file', xls: 'Excel workbook'
};
function safeName(name, fallback) { return String(name || fallback).replace(/[\\/:*?"<>|\u0000-\u001f]+/g, '-').slice(0, 120); }
function toBuffer(data) { return typeof data === 'string' ? Buffer.from(data, 'utf8') : Buffer.from(data || []); }
ipcMain.handle('save-file', async (e, name, data) => {
  const safe = safeName(name, 'card-receipt.txt');
  const ext = path.extname(safe).slice(1).toLowerCase();
  const filters = FILE_TYPES[ext] ? [{ name: FILE_TYPES[ext], extensions: [ext] }] : [];
  const parent = BrowserWindow.fromWebContents(e.sender) || win;
  const r = await dialog.showSaveDialog(parent, { defaultPath: path.join(app.getPath('documents'), safe), filters });
  if (r.canceled || !r.filePath) return 'canceled';
  try { fs.writeFileSync(r.filePath, toBuffer(data)); return 'saved'; } catch (err) { return 'failed'; }
});

/* ----- Email with the receipt PDF attached ----- */
// Windows: Simple MAPI opens the default mail program (Outlook, Thunderbird and others) with the file attached.
const MAPI_PS = [
  "$ErrorActionPreference = 'Stop'",
  "Add-Type -TypeDefinition @'",
  "using System;",
  "using System.Runtime.InteropServices;",
  "public static class CardReceiptMapi {",
  "  [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Unicode)]",
  "  public struct Msg { public int reserved; public string subject; public string noteText; public string messageType; public string dateReceived; public string conversationID; public int flags; public IntPtr originator; public int recipCount; public IntPtr recips; public int fileCount; public IntPtr files; }",
  "  [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Unicode)]",
  "  public struct Recip { public int reserved; public int recipClass; public string name; public string address; public int eIDSize; public IntPtr entryID; }",
  "  [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Unicode)]",
  "  public struct FileDesc { public int reserved; public int flags; public int position; public string pathName; public string fileName; public IntPtr fileType; }",
  "  [DllImport(\"MAPI32.DLL\", CharSet = CharSet.Unicode)]",
  "  static extern int MAPISendMailW(IntPtr session, IntPtr uiParam, ref Msg message, int flags, int reserved);",
  "  [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Ansi)]",
  "  public struct MsgA { public int reserved; public string subject; public string noteText; public string messageType; public string dateReceived; public string conversationID; public int flags; public IntPtr originator; public int recipCount; public IntPtr recips; public int fileCount; public IntPtr files; }",
  "  [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Ansi)]",
  "  public struct RecipA { public int reserved; public int recipClass; public string name; public string address; public int eIDSize; public IntPtr entryID; }",
  "  [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Ansi)]",
  "  public struct FileDescA { public int reserved; public int flags; public int position; public string pathName; public string fileName; public IntPtr fileType; }",
  "  [DllImport(\"MAPI32.DLL\", CharSet = CharSet.Ansi)]",
  "  static extern int MAPISendMail(IntPtr session, IntPtr uiParam, ref MsgA message, int flags, int reserved);",
  "  public static int Send(string to, string subject, string body, string path, string name) {",
  "    try { return SendW(to, subject, body, path, name); } catch (EntryPointNotFoundException) { return SendA(to, subject, body, path, name); }",
  "  }",
  "  static int SendA(string to, string subject, string body, string path, string name) {",
  "    MsgA m = new MsgA(); m.subject = subject; m.noteText = body;",
  "    FileDescA f = new FileDescA(); f.position = -1; f.pathName = path; f.fileName = name;",
  "    m.fileCount = 1; m.files = Marshal.AllocHGlobal(Marshal.SizeOf(typeof(FileDescA))); Marshal.StructureToPtr(f, m.files, false);",
  "    if (!String.IsNullOrEmpty(to)) {",
  "      RecipA r = new RecipA(); r.recipClass = 1; r.name = to; r.address = \"SMTP:\" + to;",
  "      m.recipCount = 1; m.recips = Marshal.AllocHGlobal(Marshal.SizeOf(typeof(RecipA))); Marshal.StructureToPtr(r, m.recips, false);",
  "    }",
  "    return MAPISendMail(IntPtr.Zero, IntPtr.Zero, ref m, 9, 0);",
  "  }",
  "  static int SendW(string to, string subject, string body, string path, string name) {",
  "    Msg m = new Msg(); m.subject = subject; m.noteText = body;",
  "    FileDesc f = new FileDesc(); f.position = -1; f.pathName = path; f.fileName = name;",
  "    m.fileCount = 1; m.files = Marshal.AllocHGlobal(Marshal.SizeOf(typeof(FileDesc))); Marshal.StructureToPtr(f, m.files, false);",
  "    if (!String.IsNullOrEmpty(to)) {",
  "      Recip r = new Recip(); r.recipClass = 1; r.name = to; r.address = \"SMTP:\" + to;",
  "      m.recipCount = 1; m.recips = Marshal.AllocHGlobal(Marshal.SizeOf(typeof(Recip))); Marshal.StructureToPtr(r, m.recips, false);",
  "    }",
  "    return MAPISendMailW(IntPtr.Zero, IntPtr.Zero, ref m, 9, 0);",
  "  }",
  "}",
  "'@",
  "exit (100 + [CardReceiptMapi]::Send($env:CR_TO, $env:CR_SUBJECT, $env:CR_BODY, $env:CR_FILE, $env:CR_NAME))"
].join('\n');
function runMapi(exe, file, m) {
  return new Promise((resolve) => {
    let done = false;
    const finish = (ok) => { if (!done) { done = true; resolve(ok); } };
    const env = Object.assign({}, process.env, {
      CR_TO: m.to || '', CR_SUBJECT: m.subject || '', CR_BODY: String(m.body || '').replace(/\r?\n/g, '\r\n'),
      CR_FILE: file, CR_NAME: path.basename(file)
    });
    try {
      execFile(exe, ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-STA', '-EncodedCommand', Buffer.from(MAPI_PS, 'utf16le').toString('base64')],
        { env, windowsHide: true }, (err) => {
          const code = err ? err.code : 0;
          finish(code === 100 || code === 101); // 0 = sent, 1 = the person closed the email
        });
    } catch (err) { finish(false); return; }
    // The call waits while the email window is open, so a process still running means it opened.
    setTimeout(() => finish(true), 15000);
  });
}
async function emailWindows(file, m) {
  const root = process.env.SystemRoot || 'C:\\Windows';
  if (await runMapi(path.join(root, 'System32', 'WindowsPowerShell', 'v1.0', 'powershell.exe'), file, m)) return true;
  // A 32-bit Outlook only answers 32-bit programs.
  const wow = path.join(root, 'SysWOW64', 'WindowsPowerShell', 'v1.0', 'powershell.exe');
  return fs.existsSync(wow) ? runMapi(wow, file, m) : false;
}
// Mac: AppleScript for Apple Mail or Outlook, whichever opens email links.
const MAIL_SCRIPT = [
  'on run argv',
  '  set theTo to item 1 of argv',
  '  set theSubject to item 2 of argv',
  '  set theBody to item 3 of argv',
  '  set theFile to (POSIX file (item 4 of argv)) as alias',
  '  tell application "Mail"',
  '    set newMessage to make new outgoing message with properties {subject:theSubject, content:theBody & return & return, visible:true}',
  '    tell newMessage',
  '      if theTo is not "" then make new to recipient at end of to recipients with properties {address:theTo}',
  '      tell content to make new attachment with properties {file name:theFile} at after the last paragraph',
  '    end tell',
  '    activate',
  '  end tell',
  'end run'
].join('\n');
const OUTLOOK_SCRIPT = [
  'on run argv',
  '  set theTo to item 1 of argv',
  '  set theSubject to item 2 of argv',
  '  set theBody to item 5 of argv',
  '  set theFile to (POSIX file (item 4 of argv)) as alias',
  '  tell application "Microsoft Outlook"',
  '    set newMessage to make new outgoing message with properties {subject:theSubject, content:theBody}',
  '    if theTo is not "" then make new to recipient at newMessage with properties {email address:{address:theTo}}',
  '    make new attachment at newMessage with properties {file:theFile}',
  '    open newMessage',
  '    activate',
  '  end tell',
  'end run'
].join('\n');
function escHtml(t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function emailMac(file, m) {
  let handler = '';
  try { handler = app.getApplicationNameForProtocol('mailto:') || ''; } catch (e) { handler = ''; }
  const script = /outlook/i.test(handler) ? OUTLOOK_SCRIPT : (!handler || /^mail(\.app)?$/i.test(handler)) ? MAIL_SCRIPT : null;
  if (!script) return Promise.resolve(false);
  const html = escHtml(m.body || '').replace(/\n/g, '<br>');
  return new Promise((resolve) => {
    execFile('osascript', ['-e', script, m.to || '', m.subject || '', m.body || '', file, html], { timeout: 60000 }, (err) => resolve(!err));
  });
}
function tidyAttachments(dir) {
  try {
    const old = Date.now() - 30 * 24 * 3600 * 1000;
    fs.readdirSync(dir).forEach((f) => { const p = path.join(dir, f); try { if (fs.statSync(p).mtimeMs < old) fs.unlinkSync(p); } catch (e) {} });
  } catch (e) {}
}
ipcMain.handle('email-pdf', async (_e, m) => {
  m = m || {};
  const dir = path.join(app.getPath('userData'), 'Email attachments');
  fs.mkdirSync(dir, { recursive: true });
  tidyAttachments(dir);
  const file = path.join(dir, safeName(m.name, 'receipt.pdf'));
  try { fs.writeFileSync(file, toBuffer(m.data)); } catch (e) { return { result: 'failed' }; }
  let ok = false;
  try {
    if (process.platform === 'win32') ok = await emailWindows(file, m);
    else if (process.platform === 'darwin') ok = await emailMac(file, m);
  } catch (e) { ok = false; }
  if (ok) return { result: 'opened', path: file };
  shell.showItemInFolder(file);
  return { result: 'fallback', path: file };
});
ipcMain.on('open-release', () => shell.openExternal(RELEASES));

function newer(a, b) {
  const pa = String(a).replace(/^v/, '').split('.').map(Number), pb = String(b).replace(/^v/, '').split('.').map(Number);
  for (let i = 0; i < 3; i++) { if ((pa[i] || 0) > (pb[i] || 0)) return true; if ((pa[i] || 0) < (pb[i] || 0)) return false; }
  return false;
}
// net.fetch is newer than the Windows 7 engine, so fall back to net.request there.
function getJson(url) {
  const headers = { 'Accept': 'application/vnd.github+json', 'User-Agent': 'Card-Receipt/' + app.getVersion() };
  if (typeof net.fetch === 'function') return net.fetch(url, { headers }).then((r) => (r.ok ? r.json() : null));
  return new Promise((resolve) => {
    const req = net.request({ url, method: 'GET' });
    Object.keys(headers).forEach((k) => req.setHeader(k, headers[k]));
    req.on('response', (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => { try { resolve(res.statusCode === 200 ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : null); } catch (e) { resolve(null); } });
      res.on('error', () => resolve(null));
    });
    req.on('error', () => resolve(null));
    req.end();
  });
}
async function checkForUpdate() {
  try {
    const rel = await getJson(RELEASES_API);
    if (!rel) return;
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
    const nav = contents.navigationHistory || contents;
    items.push({ label: 'Back', enabled: nav.canGoBack(), click: () => nav.goBack() });
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
    // Keep the built-in browser on TCGplayer; other sites open in the computer's own browser.
    contents.on('will-navigate', (ev, url) => {
      if (isTcg(url)) return;
      ev.preventDefault();
      if (/^(https?|mailto):/i.test(url)) shell.openExternal(url);
    });
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
