import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import AppRoot from "./AppRoot";
import { setServerSideRenderingState } from "./RouteHandler";
import i18ninit from "./i18n";
import registerServiceWorker from "./registerServiceWorker";

/* eslint-disable no-underscore-dangle */

let renderFunction = ReactDOM.render;

/*
  SSR Data
  If we're running in a server-side rendering scenario,
  the server will provide the window.__JSS_STATE__ object
  for us to acquire the initial state to run with on the client.

  This enables us to skip a network request to load up the layout data.

  SSR is initiated from /server/server.js.
*/
if (window.__JSS_STATE__) {
  // push the initial SSR state into the route handler, where it will be used
  setServerSideRenderingState(window.__JSS_STATE__);

  // when React initializes from a SSR-based initial state, you need to render with `hydrate` instead of `render`
  renderFunction = ReactDOM.hydrate;
}

/*
  App Rendering
*/
// initialize the dictionary, then render the app
// note: if not making a multlingual app, the dictionary init can be removed.
i18ninit().then(() => {
  // HTML element to place the app into
  const rootElement = document.getElementById("root");

  renderFunction(
    <AppRoot path={window.location.pathname} Router={BrowserRouter} />,
    rootElement
  );

  registerServiceWorker();
});