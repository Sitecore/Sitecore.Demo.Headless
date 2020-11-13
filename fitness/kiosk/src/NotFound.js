import React from 'react';

// Renders a route-not-found message when no route is available from Sitecore
// The JSS equivalent of a 404 Not Found page.

// This is invoked from RouteHandler when Sitecore returns no valid route data.
// The NotFound component receives the Layout Service Context data, but no route data.
// This can be used to power parts of your site, such as navigation, from LS context additions
// without losing the ability to render them on your 404 pages :)

const NotFound = (props) => <h1>Page not found</h1>;

export default NotFound;
