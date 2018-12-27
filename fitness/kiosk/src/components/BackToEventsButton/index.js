import React from "react";
import { Text } from "@sitecore-jss/sitecore-jss-react";
import { NavLink } from "react-router-dom";
import { translate } from "react-i18next";

const BackToEventsButton = ({ fields, t, route }) => {
  return (
    route.templateName === "event-page" && <NavLink exact className="btn btn-secondary" to={"/events"}>
      <span className="ico ico-left-text ico-back" />
      <span className="txt">{t("back-events")}</span>
    </NavLink>
  );
};

export default translate()(BackToEventsButton);
