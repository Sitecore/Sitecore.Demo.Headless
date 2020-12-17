const config = require('./temp/config');

/**
 * Check is disconnected mode started
 * @returns {boolean}
 */
const isDisconnected = () => /\/\/localhost/i.test(config.sitecoreApiHost);

module.exports.isDisconnected = isDisconnected;
