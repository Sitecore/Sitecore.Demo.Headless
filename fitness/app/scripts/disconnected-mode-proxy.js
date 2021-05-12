/*
  When the app runs in disconnected mode, and Sitecore is not present, we need to give
  the app copies of the Sitecore APIs it depends on (layout service, dictionary service, content service)
  to talk to so that the app can run using the locally defined disconnected data.

  This is accomplished by spinning up a small Express server that mocks the APIs, and then
  telling the dev server to proxy requests to the API paths to this express instance.
*/

/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');
const { createDefaultDisconnectedServer } = require('@sitecore-jss/sitecore-jss-dev-tools');
const config = require('../package.json').config;

const touchToReloadFilePath = 'src/temp/config.js';

const events = require("../data/fake-api/events");
const products = require("../data/fake-api/products");
const favoritedEvents = require("../data/fake-api/favorited-events");
const registeredEvents = require("../data/fake-api/registered-events");

const proxyOptions = {
  appRoot: path.join(__dirname, '..'),
  appName: config.appName,
  watchPaths: ['./data'],
  language: config.language,
  port: process.env.PROXY_PORT || 3042,
  sourceFiles: [
    "./src/**/*.sitecore.js",
    "./sitecore/definitions/**/*.sitecore.js",
    "./sitecore/definitions/**/*.sitecore.ts",
  ],
  onManifestUpdated: (manifest) => {
    // if we can resolve the config file, we can alter it to force reloading the app automatically
    // instead of waiting for a manual reload. We must materially alter the _contents_ of the file to trigger
    // an actual reload, so we append "// reloadnow" to the file each time. This will not cause a problem,
    // since every build regenerates the config file from scratch and it's ignored from source control.
    if (fs.existsSync(touchToReloadFilePath)) {
      const currentFileContents = fs.readFileSync(touchToReloadFilePath, 'utf8');
      const newFileContents = `${currentFileContents}\n// reloadnow`;
      fs.writeFileSync(touchToReloadFilePath, newFileContents, 'utf8');

      console.log('Manifest data updated. Reloading the browser.');
    } else {
      console.log('Manifest data updated. Refresh the browser to see latest content!');
    }
  },
  afterMiddlewareRegistered: (app) => {
    app.get("/sitecore/api/lighthousefitness/events", (req, res) =>
      res.send(events)
    );
    app.get("/sitecore/api/lighthousefitness/products", (req, res) =>
      res.send(products)
    );
    app.get("/sitecore/api/lighthousefitness/events/getfavorites", (req, res) =>
      res.send(favoritedEvents)
    );
    app.get("/sitecore/api/lighthousefitness/events/GetEventsById", (req, res) =>
      res.send(favoritedEvents)
    );
    app.get("/sitecore/api/lighthousefitness/events/getregistrations", (req, res) =>
      res.send(registeredEvents)
    );
  }
};

// Need to customize something that the proxy options don't support?
// createDefaultDisconnectedServer() is a boilerplate that you can copy from
// and customize the middleware registrations within as you see fit.
// See https://github.com/Sitecore/jss/blob/master/packages/sitecore-jss-dev-tools/src/disconnected-server/create-default-disconnected-server.ts
createDefaultDisconnectedServer(proxyOptions);
