import React from "react";
import { translate } from "react-i18next";
import { NavLink } from "react-router-dom";

const PersonalizationResultsButton = ({ t, onClick }) => (
  <NavLink to={"/events"} className="btn btn-primary" onClick={onClick}>
    {t("see-results")}
  </NavLink>
);

export default translate()(PersonalizationResultsButton);
