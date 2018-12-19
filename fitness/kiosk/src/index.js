import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import AppRoot from "./AppRoot";
import { setServerSideRenderingState } from "./RouteHandler";
import i18ninit from "./i18n";
import registerServiceWorker from "./registerServiceWorker";

let renderFunction = ReactDOM.render;

/*
  SSR Data
  If we're running in a server-side rendering scenario,
  the server will provide JSON in the #__JSS_STATE__ element
  for us to acquire the initial state to run with on the client.

  This enables us to skip a network request to load up the layout data.
  We are emitting a quiescent script with JSON so that we can take advantage
  of JSON.parse()'s speed advantage over parsing full JS, and enable
  working without needing `unsafe-inline` in Content Security Policies.

  SSR is initiated from /server/server.js.
*/
let __JSS_STATE__ = null;
const ssrRawJson = document.getElementById('__JSS_STATE__');
if (ssrRawJson) {
  __JSS_STATE__ = JSON.parse(ssrRawJson.innerHTML);
}
if (__JSS_STATE__) {
  // push the initial SSR state into the route handler, where it will be used
  setServerSideRenderingState(__JSS_STATE__);

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