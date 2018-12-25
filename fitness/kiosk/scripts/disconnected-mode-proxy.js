/*
  When the app runs in disconnected mode, and Sitecore is not present, we need to give
  the app copies of the Sitecore APIs it depends on (layout service, dictionary service, content service)
  to talk to so that the app can run using the locally defined disconnected data.

  This is accomplished by spinning up a small Express server that mocks the APIs, and then
  telling the dev server to proxy requests to the API paths to this express instance.
*/

/* eslint-disable no-console */

const fs = require("fs");
const {
  createDefaultDisconnectedServer
} = require("@sitecore-jss/sitecore-jss-dev-tools");
const config = require("../package.json").config;
const touchToReloadFilePath = "src/temp/config.js";
const events = require("../data/fake-api/events");
const products = require("../data/fake-api/products");

const proxyOptions = {
  appRoot: __dirname,
  appName: config.appName,
  watchPaths: ["../data"],
  language: config.language,
  port: 3042,
  onManifestUpdated: manifest => {
    // if we can resolve the config file, we can alter it to force reloading the app automatically
    // instead of waiting for a manual reload. We must materially alter the _contents_ of the file to trigger
    // an actual reload, so we append "// reloadnow" to the file each time. This will not cause a problem,
    // since every build regenerates the config file from scratch and it's ignored from source control.
    if (fs.existsSync(touchToReloadFilePath)) {
      const currentFileContents = fs.readFileSync(
        touchToReloadFilePath,
        "utf8"
      );
      const newFileContents = `${currentFileContents}\n// reloadnow`;
      fs.writeFileSync(touchToReloadFilePath, newFileContents, "utf8");

      console.log("Manifest data updated. Reloading the browser.");
    } else {
      console.log(
        "Manifest data updated. Refresh the browser to see latest content!"
      );
    }
  },
  afterMiddlewareRegistered: app => {
    app.get("/sitecore/api/habitatfitness/events", (req, res) =>
      res.send(getFilteredEvents(req))
    );
    app.get("/sitecore/api/habitatfitness/products", (req, res) =>
      res.send(products)
    );
  }
};

const getFilteredEvents = req => {
  const filter = req.query.filter;
  if (filter) {
    const sportFilters = filter.split("|");
    return events.filter(e => sportFilters.includes(e.type));
  } else {
    return events;
  }
};

createDefaultDisconnectedServer(proxyOptions);
