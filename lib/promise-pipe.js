const util = require('util');
const stream = require('stream');

module.exports = {
  promisePipe: async (...streams) => {
    return util.promisify(stream.pipeline)(streams);
  }
};