import React from 'react';
import { SitecoreContext } from '@sitecore-jss/sitecore-jss-react';
import { Route, Switch } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import componentFactory from './temp/componentFactory';
import RouteHandler from './RouteHandler';
import { LastLocationProvider } from 'react-router-last-location';
import OcProvider from './ordercloud/redux/ocProvider'
import ProductDetail from './components/ProductDetail'
import config from './temp/config';
import CategoryDetail from './components/CategoryDetail'

import { fetchFromBoxever } from "./services/GenericService";
import { getGuestRef } from "./services/BoxeverService";

const ocConfig = {
  clientId: config.ocBuyerClientId,
  baseApiUrl: config.ocBaseApiUrl,
  scope: ['Shopper'],
  allowAnonymous: Boolean("true")
};

// This is the main JSX entry point of the app invoked by the renderer (server or client rendering).
// By default the app's normal rendering is delegated to <RouteHandler> that handles the loading of JSS route data.

// support languages in the URL prefix
// e.g. /da-DK/path, or /en/path, or /path
export const routePatterns = [
  '/:lang([a-z]{2}-[A-Z]{2})/:sitecoreRoute*',
  '/:lang([a-z]{2})/:sitecoreRoute*',
  '/:sitecoreRoute*',
];



const renderProductDetail = (props) => <ProductDetail productId={props.match.params.productid} />

// wrap the app with:
// ApolloProvider: provides an instance of Apollo GraphQL client to the app to make Connected GraphQL queries.
//    Not needed if not using connected GraphQL.
// SitecoreContext: provides component resolution and context services via withSitecoreContext
// Router: provides a basic routing setup that will resolve Sitecore item routes and allow for language URL prefixes.
// LastLocationProvider: TODO
class AppRoot extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ssrRenderComplete: false,
    };

    if (props.ssrState) {
      this.sitecoreContext =
        props.ssrState.sitecore && props.ssrState.sitecore.route
          ? {
              route: props.ssrState.sitecore.route,
              itemId: props.ssrState.sitecore.route.itemId,
              ...props.ssrState.sitecore.context,
            }
          : props.ssrState.sitecore.context;
    } else {
      this.sitecoreContext = null;
    }
  }

  setSsrRenderComplete = (ssrRenderComplete) =>
    this.setState({
      ssrRenderComplete,
    });

  componentDidMount() {
    this.setSsrRenderComplete(true);

    let user = localStorage.getItem("user");
    if (user) {
      user = JSON.parse(user);
      this.setState({ user });
    } else {
      getGuestRef().then(response => {
        var resp = fetchFromBoxever(
          "/getguestByRef?guestRef="+ response.guestRef
        );
        var userName = {"name":resp.firstname + " " + resp.lastname};
        this.setState({ userName });
      }).catch(e => {
        console.log(e);
      });



      fetch("https://jsonplaceholder.typicode.com/users")
        .then(res => res.json())
        .then(users => {
          this.setState({ users });
          localStorage.setItem("users", JSON.stringify(users));
        });
    }
  }

  render() {
    const { path, Router, graphQLClient } = this.props;

    return (
      <ApolloProvider client={graphQLClient}>
        <SitecoreContext componentFactory={componentFactory} context={this.sitecoreContext}>
          <OcProvider config={ocConfig}>
            <Router location={path} context={{}}>
              <LastLocationProvider>
                <Switch>
                  <Route path="/null" component={null} />
                  <Route path="/products/:productid" render={renderProductDetail} />
                  <Route path="/shop/:categoryid" render={props => <CategoryDetail categoryId={props.match.params.categoryid}></CategoryDetail>} />
                  {routePatterns.map((routePattern) => (
                    <Route
                      key={routePattern}
                      path={routePattern}
                      render={(props) => (
                        <RouteHandler route={props} ssrRenderComplete={this.state.ssrRenderComplete} />
                      )}
                    />
                  ))}
                </Switch>
              </LastLocationProvider>
            </Router>
          </OcProvider>
        </SitecoreContext>
      </ApolloProvider>
    );
  }
}

export default AppRoot;
