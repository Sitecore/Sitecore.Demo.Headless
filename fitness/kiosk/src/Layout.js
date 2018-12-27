import React, { Component, Fragment } from "react";
import { Placeholder } from "@sitecore-jss/sitecore-jss-react";
import Helmet from "react-helmet";
import { initializeFirebase } from "./services/SubscriptionService";
import { translate } from "react-i18next";

import { ToastContainer, toast } from "react-toastify";

import "bootstrap/dist/css/bootstrap.css";
import "./assets/app.css";
import "react-toastify/dist/ReactToastify.min.css";
import BackToEventsButton from "./components/BackToEventsButton";

const ToastBody = ({ title, body, link, icon, click_action }) => (
  <Fragment>
    {/* <img src={icon} /> */}
    <h5>{title}</h5>
    <p>{body}</p>
    <a className="btn btn-danger" href={click_action}>
      See more
    </a>
  </Fragment>
);

class Layout extends Component {
  componentDidMount() {
    initializeFirebase(this.onMessageReceived);
  }

  onMessageReceived(payload) {
    console.log("Layout. Message received. ", payload);
    toast.info(<ToastBody {...payload.notification} />, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    });
  }

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
          <title>{`${t("habitat-fitness")} | ${pageTitle}`}</title>
        </Helmet>

        <Placeholder
          name="hf-nav"
          rendering={route}
          routeData={route}
          context={context}
        />

        {/* root placeholder for the app, which we add components to using route data */}
        <main role="main">
          <ToastContainer />
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
