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

/**
 * Get hostname which used to access application, in disconnected mode it can be localhost or ip address
 * @returns {string} hostname
 */
module.exports.getHostname = () =>
  isDisconnected() ? window.location.origin : config.sitecoreApiHost;

/**
 * Get a query string key value
 * @returns {string} query string key value
 */
module.exports.getQueryStringValue = function(queryStringKey) {
  if (window !== undefined && window.location.search) {
    var queryString = window.location.search;
    if (queryString) {
      var queryStringSubstringToLookFor = queryStringKey + "=";
      var keyIndex = queryString.indexOf(queryStringSubstringToLookFor);
      if (keyIndex !== -1) {
        var startIndexOfSubstring = keyIndex + queryStringSubstringToLookFor.length;
        var startOfNextKey = queryString.indexOf("&", keyIndex);
        return decodeURI(startOfNextKey === -1 ? queryString.substr(startIndexOfSubstring) : queryString.substr(startIndexOfSubstring, startOfNextKey - startIndexOfSubstring));
      }
    }
  }

  return "";
}