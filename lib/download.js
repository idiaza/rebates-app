const { get } = require('axios');
const { promisePipe } = require('./promise-pipe');
const { Extract } = require('unzipper');

module.exports = {
  download: async (from, to) => {
    const zipStream = (await get(from, { responseType: 'stream' })).data;
    await promisePipe(zipStream, Extract({ path: to, forceStream: true }));
  }
};