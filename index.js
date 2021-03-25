const { existsSync } = require('fs');
const { join } = require('path');
const { exec } = require('child_process');
const { app, dialog } = require('electron');

const { showSplash, hideSplash } = require('./splash/splash');

/**
 * Executes a shell command and return it as a Promise.
 * @param cmd {string}
 * @return {Promise<string>}
 */
function execShellCommand(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.warn(error);
      }
      resolve(stdout ? stdout : stderr);
    });
  });
}

(async () => {

  app.on('window-all-closed', () => {
    app.quit();
  });

  app.on('ready', async () => {

    // await showSplash();

    const appPath = app.getAppPath();
    const nodeModulesPath = join(appPath, './node_modules');

    if (!existsSync(nodeModulesPath)) {
      await dialog.showMessageBox({ message: 'Instalando dependencias' });
      const out = await execShellCommand('cd /d ' + appPath + ' && npm install');
    }

    // await hideSplash();
    await dialog.showMessageBox({ message: 'Iniciando app' });

    await require('./bootstrap').bootstrap();

  });

})();
