import React from 'react';
import { Placeholder } from '@sitecore-jss/sitecore-jss-react';
import { withTranslation } from 'react-i18next';
import Helmet from 'react-helmet';

import { initializeFirebase } from './services/SubscriptionService';
import { ToastContainer, toast } from 'react-toastify';

// Using bootstrap is completely optional. It's used here to provide a clean layout for samples,
// without needing extra CSS in the sample app. Remove it in package.json as well if it's removed here.
import 'bootstrap/dist/css/bootstrap.css';
import 'react-toastify/dist/ReactToastify.min.css';
import './assets/app.css';

/*
  APP LAYOUT
  This is where the app's HTML structure and root placeholders should be defined.

  All routes share this root layout by default (this could be customized in RouteHandler),
  but components added to inner placeholders are route-specific.
*/

// remove double quotes
const unquote = str => str.replace(/['"]+/g, "");

const ToastBody = ({ title, body, ctaText, click_action }) => (
  <React.Fragment>
    <h5 dangerouslySetInnerHTML={{ __html: unquote(title) }} />
    <p dangerouslySetInnerHTML={{ __html: unquote(body) }} />
    <a className="btn btn-primary" href={click_action}>
      {ctaText}
    </a>
  </React.Fragment>
);

class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.onMessageReceived = this.onMessageReceived.bind(this);
  }

  componentDidMount() {
    initializeFirebase(this.onMessageReceived);
  }

  onMessageReceived(payload) {
    console.log("Layout. Message received. ", payload);
    if (!payload.notification) {
      console.warn(
        "Received empty notification body. The notification was already processed."
      );
      return;
    }

    toast.info(
      <ToastBody {...payload.notification} ctaText={this.props.t("ok")} />,
      {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      }
    );
  }

  render() {
    const { t, route, context } = this.props;

    const pageTitle =
      (route.fields &&
        route.fields.pageTitle &&
        route.fields.pageTitle.value) ||
      "Page";

    return (
      <React.Fragment>
        {/* react-helmet enables setting <head> contents, like title and OG meta tags */}
        <Helmet>
          <title>{`${t("lighthouse-fitness")} | ${pageTitle}`}</title>
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
          <Placeholder
            name="hf-body"
            rendering={route}
            routeData={route}
            context={context}
          />
        </main>
      </React.Fragment>
    );
  }
}

export default withTranslation()(Layout);
