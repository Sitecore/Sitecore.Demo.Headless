import React from "react";
import { NavLink } from "react-router-dom";
import { withRouter } from "react-router";
import { translate } from "react-i18next";

class BreadcrumbNavigation extends React.Component {
  render() {
    const { context, t, routeData } = this.props;
    const navItems = context.navigation ? context.navigation[0].children : [];
    const currentPageName = routeData.displayName
      ? routeData.displayName
      : routeData.name;

    return (
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <NavLink to="/">{t("habitat-fitness")}</NavLink>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {currentPageName}
          </li>
        </ol>
      </nav>
    );
  }
}

export default withRouter(translate()(BreadcrumbNavigation));
