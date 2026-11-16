const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('cardApp', {
  storeGet: (key) => ipcRenderer.sendSync('store-get', key),
  storeSet: (key, value) => ipcRenderer.sendSync('store-set', key, value),
  openMail: (href) => ipcRenderer.send('open-mail', href),
  copyText: (text) => ipcRenderer.invoke('copy-text', text),
  saveFile: (name, text) => ipcRenderer.invoke('save-file', name, text),
  openRelease: () => ipcRenderer.send('open-release'),
  onMenu: (cb) => ipcRenderer.on('menu', (_e, cmd) => cb(cmd)),
  onUpdate: (cb) => ipcRenderer.on('update', (_e, info) => cb(info)),
  platform: process.platform
});
