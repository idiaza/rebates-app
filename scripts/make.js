const { renameSync } = require('fs');
const { readdir } = require('fs').promises;
const { join } = require('path');
const { exec } = require('child_process');
const { copySync } = require('fs-extra');
const { name, version } = require('../package.json');
const { download } = require('../lib/download');

const platform = 'win32';
const architecture = 'ia32';
const electronVersion = 'v11.4.1';
const distPath = './dist/' + platform + '-' + architecture;
const appPath = join(distPath, 'resources/app');

(async () => {

  // Electron pre-build binaries
  await download(
    'https://github.com/electron/electron/releases/download/' + electronVersion + '/electron-' + electronVersion + '-' + platform + '-' + architecture + '.zip',
    distPath
  );

  // Rename the executable
  renameSync(join(distPath, 'electron.exe'), join(distPath, name + '-' + version + '.exe'));

  // // Clone the latest release
  // await download(
  //   'https://github.com/electron/electron/releases/download/' + electronVersion + '/electron-' + electronVersion + '-' + platform + '-' + architecture + '.zip',
  //   appPath
  // );

  // Or copy local files in "app" directory
  const list = await readdir('.');
  for (let i = 0; i < list.length; i++) {
    const item = list[i];

    if (/(^|\/)\.[^/.]/g.test(item)) {
      continue;
    }

    if (
      item === 'node_modules' ||
      item === 'dist' ||
      item === 'data'
    ) {
      continue;
    }

    copySync(item, join(appPath, item));
  }

  // // Install npm packages
  // console.log('Running "npm install"');
  // exec('cd ' + appPath + ' && ls && npm install', function (a, b) { console.log(b) });

})();



