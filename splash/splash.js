const { BrowserWindow } = require('electron');
const { join } = require('path');

let splashWindow;

const initSplash = async () => {

  return new Promise((resolve, reject) => {

    splashWindow = new BrowserWindow({
      alwaysOnTop: true,
      frame: false,
      height: 200,
      show: false,
      transparent: true,
      width: 400
    });

    splashWindow.loadFile(join(__dirname, 'client/splash.html'));

    splashWindow.on('ready-to-show', () => {
      resolve();
    });

  });

};

const showSplash = async () => {

  if (!splashWindow) {
    await initSplash();
  }

  return new Promise((resolve, reject) => {
    splashWindow.on('show', () => {
      resolve();
    });
    splashWindow.show();
  });

};

const hideSplash = async () => {
  return new Promise((resolve, reject) => {
    splashWindow.on('close', () => {
      resolve();
    });
    splashWindow.close();
  });
};

module.exports = {
  initSplash,
  showSplash,
  hideSplash
};