import React, { Component, Fragment } from "react";
import { Placeholder, VisitorIdentification } from "@sitecore-jss/sitecore-jss-react";
import Helmet from "react-helmet";
import { translate } from "react-i18next";

import "bootstrap/dist/css/bootstrap.css";
import "./assets/app.css";
import BackToEventsButton from "./components/BackToEventsButton";

class Layout extends Component {
  render() {
    const { t, route, context } = this.props;

    const pageTitle =
      (route.fields &&
        route.fields.pageTitle &&
        route.fields.pageTitle.value) ||
      "Page";

    return (
      <Fragment>
        {/* react-helmet enables setting <head> contents, like title and OG meta tags */}
        <Helmet>
          <title>{`${t("lighthouse-fitness")} | ${pageTitle}`}</title>
        </Helmet>

        {/*
          VisitorIdentification is necessary for Sitecore Analytics to determine if the visitor is a robot.
          If Sitecore XP (with xConnect/xDB) is used, this is required or else analytics will not be collected for the JSS app.
          For XM (CMS-only) apps, this should be removed.

          VI detection only runs once for a given analytics ID, so this is not a recurring operation once cookies are established.
        */}
        <VisitorIdentification />

        <Placeholder
          name="hf-nav"
          rendering={route}
          routeData={route}
          context={context}
        />

        {/* root placeholder for the app, which we add components to using route data */}
        <main role="main">
          <div className="mainContent">
            <Placeholder
              name="hf-body"
              rendering={route}
              routeData={route}
              context={context}
            />
          </div>
          <div className="mainFooter backToTopContainer">
            <BackToEventsButton route={route} />
          </div>
        </main>
      </Fragment>
    );
  }
}

export default translate()(Layout);
