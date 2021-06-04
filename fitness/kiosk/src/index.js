import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import AppRoot from "./AppRoot";
import i18ninit from "./i18n";

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

  // HACK: The %something% tokens are replaced just before runtime, way after the Webpack build happened.
  // The final strings can be empty or contain values from the Docker environment variables.
  // To prevent Webpack code optimization to remove the falsy string checks and console.error statements from the browser bundle, we are using the JavaScript (A, B) syntax which always returns the last expression (B) with Math.min() as the first expression to minimize the browser work.
  const boxeverClientKey = (Math.min(), `${process.env.REACT_APP_BOXEVER_CLIENT_KEY}` || "%boxeverClientKey%");
  // Checks that the key is not empty and not the token anymore
  const isBoxeverClientKeyConfigured = boxeverClientKey && boxeverClientKey[0] !== "%";

  if (isBoxeverClientKeyConfigured) {
    // Append the Boxever settings and JavaScript library to the page
    const boxeverSettingsScriptElement = document.createElement("script");
    boxeverSettingsScriptElement.innerText = `var _boxever_settings = { client_key: "${boxeverClientKey}", target: "https://api.boxever.com/v1.2", cookie_domain: ".lighthouse-fitness.sitecoredemo.com/", web_flow_target: "https://d35vb5cccm4xzp.cloudfront.net", pointOfSale: "lighthouse-fitness" };`
    rootElement.parentElement.appendChild(boxeverSettingsScriptElement);

    const boxeverLibraryScriptElement = document.createElement("script");
    boxeverLibraryScriptElement.type = "text/javascript";
    boxeverLibraryScriptElement.src = "https://d1mj578wat5n4o.cloudfront.net/boxever-1.4.1.js";
    rootElement.parentElement.appendChild(boxeverLibraryScriptElement);
  }

  renderFunction(
    <AppRoot
      path={window.location.pathname}
      Router={BrowserRouter}
      ssrState={__JSS_STATE__}
    />,
    rootElement
  );
});