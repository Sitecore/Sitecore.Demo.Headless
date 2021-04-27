const express = require('express');
const compression = require('compression');
const scProxy = require('@sitecore-jss/sitecore-jss-proxy').default;
const config = require('./config');
const cacheMiddleware = require('./cacheMiddleware');

const server = express();
// BEGIN DEMO CUSTOMIZATION - Change default port from 3000 to 80
const port = process.env.PORT || 80;
// END DEMO CUSTOMIZATION

// enable gzip compression for appropriate file types
server.use(compression());

// turn off x-powered-by http header
server.settings['x-powered-by'] = false;

// Serve static app assets from local /dist folder
server.use(
  '/dist',
  express.static('dist', {
    fallthrough: false, // force 404 for unknown assets under /dist
  }),
  // BEGIN DEMO CUSTOMIZATION - Allow services static assets from the root (i.e. /firebase-messaging-sw.js)
  express.static(__dirname + '/dist/' + config.appName)
  // END DEMO CUSTOMIZATION
);

/**
 * Output caching, can be enabled,
 * Read about restrictions here: {@link https://jss.sitecore.com/docs/techniques/performance/caching}
 */
// server.use(cacheMiddleware());

// For any other requests, we render app routes server-side and return them
server.use('*', scProxy(config.serverBundle.renderView, config, config.serverBundle.parseRouteUrl));

server.listen(port, () => {
  console.log(`server listening on port ${port}!`);
});