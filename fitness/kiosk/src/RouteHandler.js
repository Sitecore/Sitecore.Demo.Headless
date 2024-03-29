import React from "react";
import i18n from "i18next";
import Helmet from "react-helmet";
import {
  isExperienceEditorActive,
  dataApi
} from "@sitecore-jss/sitecore-jss-react";
import { dataFetcher } from "./utils/dataFetcher";
import config from "./temp/config";
import Layout from "./Layout";
import NotFound from "./NotFound";
import { getUrlParams, canUseDOM } from "./utils";
import Loading from "./components/Loading";
import { logViewEvent } from "./services/BoxeverService";

// Dynamic route handler for Sitecore items.
// Because JSS app routes are defined in Sitecore, traditional static React routing isn't enough -
// we need to be able to load dynamic route data from Sitecore after the client side route changes.
// So react-router delegates all route rendering to this handler, which attempts to get the right
// route data from Sitecore - and if none exists, renders the not found component.

export default class RouteHandler extends React.Component {
  constructor(props) {
    super(props);

    const ssrInitialState = props.ssrState;

    this.state = {
      notFound: true,
      routeData: ssrInitialState, // null when client-side rendering
      defaultLanguage: config.defaultLanguage
    };

    // route data from react-router - if route was resolved, it's not a 404
    if (props.route !== null) {
      this.state.notFound = false;
    }

    // if we have an initial SSR state, and that state doesn't have a valid route data,
    // then this is a 404 route.
    if (
      ssrInitialState &&
      (!ssrInitialState.sitecore || !ssrInitialState.sitecore.route)
    ) {
      this.state.notFound = true;
    }

    // if we have an SSR state, and that state has language data, set the current language
    // (this makes the language of content follow the Sitecore context language cookie)
    // note that a route-based language (i.e. /de-DE) will override this default; this is for home.
    if (
      ssrInitialState &&
      ssrInitialState.context &&
      ssrInitialState.context.language
    ) {
      this.state.defaultLanguage = ssrInitialState.context.language;
    }

    this.componentIsMounted = false;
    this.languageIsChanging = false;

    // tell i18next to sync its current language with the route language
    this.updateLanguage();
  }

  componentDidMount() {
    // once we initialize the route handler, we've "used up" the SSR data,
    // if it existed, so we want to clear it now that it's in react state.
    // future route changes that might destroy/remount this component should ignore any SSR data.
    // EXCEPTION: Unless we are still SSR-ing. Because SSR can re-render the component twice
    // We test for SSR by checking for Node-specific process.env variable.
    if (typeof window !== "undefined" && !this.props.ssrRenderComplete && this.props.setSsrRenderComplete) {
      this.props.setSsrRenderComplete(true);
    }

    // if no existing routeData is present (from SSR), get Layout Service fetching the route data
    if (!this.state.routeData) {
      this.updateRouteData();
    }

    this.componentIsMounted = true;
  }

  componentWillUnmount() {
    this.componentIsMounted = false;
  }

  /**
   * Loads route data from Sitecore Layout Service into state.routeData
   */
  updateRouteData() {
    let sitecoreRoutePath = this.props.route.match.params.sitecoreRoute || "/";
    if (!sitecoreRoutePath.startsWith("/")) {
      sitecoreRoutePath = `/${sitecoreRoutePath}`;
    }

    const language =
      this.props.route.match.params.lang || this.state.defaultLanguage;

    // get the route data for the new route
    getRouteData(sitecoreRoutePath, language).then(routeData => {
      if (
        routeData !== null &&
        routeData.sitecore &&
        routeData.sitecore.route
      ) {
        // set the sitecore context data and push the new route
        this.props.contextFactory.setSitecoreContext({
          route: routeData.sitecore.route,
          itemId: routeData.sitecore.route.itemId,
          ...routeData.sitecore.context
        });
        this.setState({ routeData, notFound: false });

        logViewEvent(routeData);
      } else {
        this.setState({ routeData, notFound: true });
      }
    });
  }

  /**
   * Updates the current app language to match the route data.
   */
  updateLanguage() {
    const newLanguage =
      this.props.route.match.params.lang || this.state.defaultLanguage;

    if (i18n.language !== newLanguage) {
      this.languageIsChanging = true;

      i18n.changeLanguage(newLanguage, () => {
        this.languageIsChanging = false;

        // if the component is not mounted, we don't care
        // (next time it mounts, it will render with the right language context)
        if (this.componentIsMounted) {
          // after we change the i18n language, we need to force-update React,
          // since otherwise React won't know that the dictionary has changed
          // because it is stored in i18next state not React state
          this.forceUpdate();
        }
      });
    }
  }

  componentDidUpdate(previousProps) {
    const existingRoute = previousProps.route.match.url;
    const newRoute = this.props.route.match.url;

    // don't change state (refetch route data) if the route has not changed
    if (existingRoute === newRoute) {
      return;
    }

    // if in experience editor - force reload instead of route data update
    // avoids confusing Sitecore's editing JS
    if (isExperienceEditorActive()) {
      window.location.assign(newRoute);
      return;
    }

    this.updateLanguage();
    this.updateRouteData();
  }

  render() {
    const { notFound, routeData } = this.state;

    // no route data for the current route in Sitecore - show not found component.
    // Note: this is client-side only 404 handling. Server-side 404 handling is the responsibility
    // of the server being used (i.e. node-express-ssr and Sitecore intergrated rendering know how to send 404 status codes).
    if (notFound) {
      return (
        <div>
          <Helmet>
            <title>{i18n.t("Page not found")}</title>
          </Helmet>
          <NotFound
            context={routeData.sitecore && routeData.sitecore.context}
          />
        </div>
      );
    }

    // Don't render anything if the route data or dictionary data is not fully loaded yet.
    // This is a good place for a "Loading" component, if one is needed.
    if (!routeData || this.languageIsChanging) {
      return <Loading />;
    }

    // Render the app's root structural layout
    return <Layout {...routeData.sitecore} />;
  }
}

/**
 * Gets route data from Sitecore. This data is used to construct the component layout for a JSS route.
 * @param {string} route Route path to get data for (e.g. /about)
 * @param {string} language Language to get route data in (content language, e.g. 'en')
 * @param {dataApi.LayoutServiceRequestOptions} options Layout service fetch options
 */
function getRouteData(route, language, options = {}) {
  let currentUrlParams = {};
  if (canUseDOM) {
    currentUrlParams = getUrlParams(window.location.search);
  }

  const systemQueryParams = {
    sc_lang: language,
    sc_apikey: config.sitecoreApiKey
  };

  // rewriting the url if it's event page to resolve against the lighthousefitness site
  if (route.startsWith("/events/")) {
    systemQueryParams.sc_site = "lighthousefitness";
  }

  const queryParams = Object.assign(currentUrlParams, systemQueryParams);

  const fetchOptions = {
    layoutServiceConfig: { host: config.sitecoreApiHost },
    querystringParams: queryParams,
    requestConfig: options,
    fetcher: dataFetcher
  };

  return dataApi.fetchRouteData(route, fetchOptions).catch(error => {
    if (
      error.response &&
      error.response.status === 404 &&
      error.response.data
    ) {
      return error.response.data;
    }

    console.error("Route data fetch error", error, error.response);

    return null;
  });
}
