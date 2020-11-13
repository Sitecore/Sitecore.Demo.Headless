import React from "react";
import { NavLink } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { withLastLocation } from "react-router-last-location";

class DetailNavigation extends React.Component {
  render() {
    const { t, routeData, lastLocation } = this.props;
    const currentPageName = routeData.displayName
      ? routeData.displayName
      : routeData.name;

    let prevousLocation =
      routeData.templateName === "event-page" ? lastLocation : "/";
    if (!prevousLocation || prevousLocation.pathname === "/null") {
      prevousLocation = "/";
    }

    return (
      <div className="direction-fixedHeader headerBar">
        <NavLink className="btn-back" to={prevousLocation}>
          {t("lighthouse-fitness")}
        </NavLink>
        <h1 className="headerBar-title">{currentPageName}</h1>
      </div>
    );
  }
}

export default withTranslation()(withLastLocation(DetailNavigation));
