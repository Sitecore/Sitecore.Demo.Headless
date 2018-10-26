import React from "react";
import { NavLink } from "react-router-dom";
import { withRouter } from "react-router";
import { translate } from "react-i18next";

class EventDetailsNavigation extends React.Component {
  render() {
    const { t, routeData } = this.props;
    const currentPageName = routeData.displayName
      ? routeData.displayName
      : routeData.name;

    return (
      <div className="direction-fixedHeader headerBar">
        <NavLink className="btn-back" to="/">
          {t("habitat-fitness")}
          Back
        </NavLink>
        <h1 className="headerBar-title">{currentPageName}</h1>
      </div>
    );
  }
}

export default withRouter(translate()(EventDetailsNavigation));
