const proxy = require("http-proxy-middleware");

module.exports = function(app) {
  app.use(proxy("/sitecore", { target: "http://localhost:3042" }));
  app.use(proxy("/data/media", { target: "http://localhost:3042" }));
  app.use(proxy("/sitecore/api/habitatfitness/events", { target: "http://localhost:3042" }));
  app.use(proxy("/sitecore/api/habitatfitness/products", { target: "http://localhost:3042" }));
};
