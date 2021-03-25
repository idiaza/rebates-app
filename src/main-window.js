const { app, BrowserWindow } = require('electron');
const { join } = require('path');

const createMainWindow = async () => {

  const mainWindow = new BrowserWindow({
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false, // is default value after Electron v5
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: false, // turn off remote
      preload: join(__dirname, "preload.js") // use a preload script
    }
  });

  mainWindow.loadFile(join(__dirname, 'client/index.html'));

  // mainWindow.webContents.openDevTools();

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('APP_INIT', {
      productName: app.getName(),
      version: app.getVersion()
    });
  });

};

module.exports = {
  createMainWindow
};