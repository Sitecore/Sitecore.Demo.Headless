const config = require('./temp/config');

/**
 * Check if disconnected mode is started
 * @returns {boolean}
 */
const isDisconnected = () => /\/\/localhost/i.test(config.sitecoreApiHost);

module.exports.isDisconnected = isDisconnected;

/**
 * Check if the app is connected to a Sitecore instance that is not public on the Internet
 * @returns {boolean}
 */
module.exports.isConnectedToLocalInstance = () => /\.lighthouse\.localhost/i.test(config.sitecoreApiHost);
