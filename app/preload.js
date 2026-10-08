const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('cardApp', {
  storeGet: (key) => ipcRenderer.sendSync('store-get', key),
  storeSet: (key, value) => ipcRenderer.sendSync('store-set', key, value),
  openMail: (href) => ipcRenderer.send('open-mail', href),
  copyText: (text) => ipcRenderer.invoke('copy-text', text),
  onMenu: (cb) => ipcRenderer.on('menu', (_e, cmd) => cb(cmd)),
  platform: process.platform
});
