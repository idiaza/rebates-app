const { createMainWindow } = require('./main-window');

const main = async () => {
  await createMainWindow();
  require('./backend');
};

module.exports = {
  main
};