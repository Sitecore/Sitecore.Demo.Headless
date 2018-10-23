import React, { Component } from "react";
import { Placeholder } from "@sitecore-jss/sitecore-jss-react";
import Helmet from "react-helmet";
import Navigation from "./components/Navigation";
import { initializeFirebase } from "./utils";

import { ToastContainer, toast } from "react-toastify";

import "bootstrap/dist/css/bootstrap.css";
import "./assets/app.css";
import "react-toastify/dist/ReactToastify.min.css";

const ToastBody = ({ title, body, link, icon, click_action }) => (
  <React.Fragment>
    {/* <img src={icon} /> */}
    <h5>{title}</h5>
    <p>{body}</p>
    <a className="btn btn-danger" href={click_action}>See more</a>
  </React.Fragment>
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
    const { route, context } = this.props;
    const navItems = context.navigation ? context.navigation[0].children : [];
    const pageTitle =
      (route.fields &&
        route.fields.pageTitle &&
        route.fields.pageTitle.value) ||
      "Page";

    return (
      <React.Fragment>
        {/* react-helmet enables setting <head> contents, like title and OG meta tags */}
        <Helmet>
          <title>Habitat Fitness | {pageTitle}</title>
        </Helmet>

        <Navigation navItems={navItems} />

        {/* root placeholder for the app, which we add components to using route data */}
        <main role="main">
          <ToastContainer />
          <Placeholder name="hf-body" rendering={route} routeData={route} context={context} />
        </main>
      </React.Fragment>
    );
  }
}

export default Layout;
