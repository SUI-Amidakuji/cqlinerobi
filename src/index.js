const { app, BrowserWindow, Menu, ipcMain, clipboard } = require('electron');
const fetch = require("node-fetch");
const path = require('path');
const iconv = require('iconv-lite');
const http = require("http");
const fs = require("fs");
const Stream = require('stream').Transform
const URL = require('url').URL;

//FILE_Picture
if(! fs.existsSync('PictureCache')){
  fs.mkdir('PictureCache', (err) => {
    if (err) { throw err; }
  });
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    title: "LINE風ロビチャ",
    width: 400,
    height: 600,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'contextBridge.js')
    },
    icon: "build/icon-512x512.png"
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'main.html'));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // Opacity
  ipcMain.on('Opacity', (event, value) => {
    mainWindow.setOpacity(value / 100);
  });

  ipcMain.on('OnTop', (event, boolean) => {
    mainWindow.setAlwaysOnTop(boolean);
  });

  // minimized and restore
  ipcMain.on('minimize', () => {
    mainWindow.isMinimized() ? mainWindow.restore() : mainWindow.minimize();
  });

};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

//context-menu
ipcMain.on('show_context_menu', (event, template) => {
  if(!template){
    template = [
      {role: 'selectAll', accelerator: 'CmdOrCtrl+A'},
    ]
  }
  const menu = Menu.buildFromTemplate(template)
  menu.popup(BrowserWindow.fromWebContents(event.sender))
});
ipcMain.on('show_context_menu_message', (event, MESSAGE) => {
  const template = [
    {
      label: 'コピー',
      click: () => { clipboard.writeText(MESSAGE, 'selection') }
    },
    {role: 'copy', accelerator: 'CmdOrCtrl+C'},
  ]
  const menu = Menu.buildFromTemplate(template)
  menu.popup(BrowserWindow.fromWebContents(event.sender))
})

//file_exists
ipcMain.handle("file_exists", (event, file_path) => {
  let _path = path.join("./", file_path)
  return {exists:fs.existsSync(_path), file_path:_path};
});

//picture_download
ipcMain.on('PictDownload', (event, url, Referer,  filepath) => {
  const host = new URL(url);
  const option = {
    hostname  : host.hostname,
    path  : host.pathname,
    headers : {
      'Referer' : Referer
    },
    method: "GET",
    mode: "cors"
  };
  http.request(option, (response) => {
    var data = new Stream();
    response.on("data", (chunk) => {
      data.push(chunk);
    })
    response.on("end", () => {
      fs.writeFileSync(filepath, data.read());
    });
  }).end();
})

ipcMain.on('close', () => {
  app.quit();
});

//request
//http://bt.chibiquest.net/cqmain.php?num=???&sid=???&sv_no=?&com2=chat
ipcMain.handle("fetch_req", async(event, url) => {
  //https://github.com/node-fetch/node-fetch
  const response = await fetch(encodeURI(url));
  //SJIS_Decode
  return iconv.decode(Buffer.from(await response.buffer()), "Shift_JIS");
});
