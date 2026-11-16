(function () {
  var web = document.getElementById('web');
  var api = window.cardApp;
  var HOME = 'https://www.tcgplayer.com/';
  var isTcg = function (u) { return /^https:\/\/([a-z0-9-]+\.)*tcgplayer\.com(\/|$)/i.test(u || ''); };

  var receipt = CardReceipt({
    mode: 'dock',
    mount: document.getElementById('receipt'),
    store: { get: function (k) { return api.storeGet(k); }, set: function (k, v) { api.storeSet(k, v); } },
    readPage: function () {
      return web.executeJavaScript('(' + cardReceiptReadPage.toString() + ')()');
    },
    isCardSite: function (h) { return /(^|\.)tcgplayer\.com$/i.test(h || ''); },
    openMail: function (href) { api.openMail(href); },
    copyText: function (t) { return api.copyText(t); },
    saveFile: function (name, text) { return api.saveFile(name, text); },
    onTheme: function (v, dark) {
      var root = document.documentElement.style;
      Object.keys(v).forEach(function (k) { root.setProperty('--' + k, v[k]); });
      root.colorScheme = dark ? 'dark' : 'light';
    },
    openLink: function (url) { if (isTcg(url)) web.loadURL(url); }
  });

  var back = document.getElementById('back'), fwd = document.getElementById('fwd');
  var progress = document.getElementById('progress'), offline = document.getElementById('offline');
  function navState() {
    try { back.disabled = !web.canGoBack(); fwd.disabled = !web.canGoForward(); } catch (e) {}
  }
  back.addEventListener('click', function () { if (web.canGoBack()) web.goBack(); });
  fwd.addEventListener('click', function () { if (web.canGoForward()) web.goForward(); });
  document.getElementById('reload').addEventListener('click', function () { web.reload(); });
  document.getElementById('home').addEventListener('click', function () { web.loadURL(HOME); });
  document.getElementById('retry').addEventListener('click', function () { offline.hidden = true; web.reload(); });
  document.getElementById('search').addEventListener('submit', function (e) {
    e.preventDefault();
    var q = document.getElementById('q').value.trim();
    if (q) web.loadURL('https://www.tcgplayer.com/search/all/product?q=' + encodeURIComponent(q) + '&view=grid');
  });
  web.addEventListener('did-start-loading', function () { progress.hidden = false; });
  web.addEventListener('did-stop-loading', function () { progress.hidden = true; navState(); });
  web.addEventListener('did-navigate', function () { offline.hidden = true; navState(); });
  web.addEventListener('did-navigate-in-page', navState);
  web.addEventListener('did-fail-load', function (e) {
    if (e.isMainFrame && e.errorCode !== -3) { progress.hidden = true; offline.hidden = false; }
  });

  var upd = document.getElementById('update');
  api.onUpdate(function (info) {
    document.getElementById('upv').textContent = info && info.version ? info.version : 'A new version';
    upd.hidden = false;
  });
  document.getElementById('upget').addEventListener('click', function () { api.openRelease(); });
  document.getElementById('upx').addEventListener('click', function () { upd.hidden = true; });

  api.onMenu(function (cmd) {
    if (cmd === 'add') receipt.add();
    else if (cmd === 'save') receipt.save();
    else if (cmd === 'print') receipt.print();
    else if (cmd === 'email') receipt.email();
    else if (cmd === 'saved') receipt.showSaved();
    else if (cmd === 'inventory') receipt.showInventory();
    else if (cmd === 'settings') receipt.showSettings();
    else if (cmd === 'scan') receipt.scan();
    else if (cmd === 'back' && web.canGoBack()) web.goBack();
    else if (cmd === 'forward' && web.canGoForward()) web.goForward();
    else if (cmd === 'reload') web.reload();
    else if (cmd === 'home') web.loadURL(HOME);
    else if (cmd === 'search') { var q = document.getElementById('q'); q.focus(); q.select(); }
  });
})();
