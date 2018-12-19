import React from "react";
import { translate } from "react-i18next";
import { NavLink } from "react-router-dom";

const PersonalizationResultsButton = ({ t }) => (
  <NavLink to={"/events"} className="btn btn-primary">
    {t("see-results")}
  </NavLink>
);

export default translate()(PersonalizationResultsButton);
