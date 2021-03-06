const { join } = require('path');
const { pathExists, remove, moveSync } = require('fs-extra');
const { app, dialog } = require('electron');
const { get } = require('axios');
const { lt } = require('semver');
const { name: appName, version: appVersion } = require('./package.json');
const { download } = require('./lib/download');
const { main } = require('./src/main');

const checkForUpdates = async () => {

  const repository = 'idiaza/rebates-app';
  const localVersion = app.getVersion();
  let remoteVersion = 'v0.0.0';

  try {
    const response = await get('https://api.github.com/repos/' + repository + '/releases/latest');
    remoteVersion = response.data.tag_name;
  } catch (err) {
    return false;
  }

  console.log(remoteVersion);

  // Update
  if (lt(localVersion, remoteVersion)) {

    const userAction = await dialog.showMessageBox(null, {
      type: 'question',
      message: 'Actualización disponible: v' + remoteVersion,
      buttons: [
        'Actualizar ahora',
        'Cancelar'
      ]
    });

    if (userAction.response > 0) {
      return false;
    }

    await dialog.showMessageBox({ message: 'Iniciando actualización' });

    const updatePath = join(app.getPath('temp'), appName);

    if (await pathExists(updatePath)) {
      await remove(updatePath);
    }

    await download(
      'https://github.com/' + repository + '/archive/refs/tags/' + remoteVersion + '.zip',
      updatePath
    );

    const codePath = join(updatePath, appName + '-' + remoteVersion.replace('v', ''));
    // const appPath = '/Users/ismael/Desktop/app';
    const appPath = app.getAppPath();

    // await dialog.showMessageBox({ message: codePath });
    // await dialog.showMessageBox({ message: appPath });

    moveSync(codePath, appPath, { overwrite: true });
    return true;

    // return Promise((resolve, reject) => {
    //   move(codePath, appPath, { overwrite: true }, err => {
    //     resolve(true);
    //   });
    // });

  }

  return false;

};

const bootstrap = async () => {

  app.focus({ steal: true });

  if (await checkForUpdates()) {
    app.relaunch({ args: process.argv.slice(1).concat(['--relaunch']) });
    app.exit(0);
  }

  else {
    await main();
  }
}

module.exports = {
  bootstrap
};