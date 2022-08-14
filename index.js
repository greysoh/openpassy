const { app, ipcMain, BrowserWindow } = require('electron')
const path = require('path')

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'src', 'preloader.js'),
      nodeIntegration: true
    }
  })

  ipcMain.on("minimize", function () {
    win.minimize();
  });
  
  ipcMain.on("maximize", function () {
    win.maximize();
  });
  
  ipcMain.on("unmaximize", function () {
    win.unmaximize();
  });
  
  ipcMain.on("close", function () {
    win.close();
  });
  
  win.onBeforeUnload = () => {
    win.removeAllListeners();
  }

  win.loadFile(path.join(__dirname, 'src', 'pages', 'index.html'));
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
