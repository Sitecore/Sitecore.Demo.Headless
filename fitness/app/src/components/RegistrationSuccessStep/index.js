import React, { Fragment } from "react";
import { Text } from "@sitecore-jss/sitecore-jss-react";
import { NavLink } from "react-router-dom";
import { withTranslation } from "react-i18next";

const RegistrationSuccessStep = ({ fields, t }) => (
  <Fragment>
    <div className="wizardStep-content">
      <div className="wizardStep-header">
        <Text field={fields.title} tag="h4" className="wizardStep-title" />
      </div>
    </div>
    <div className="wizardStep-form-actions align-items-center">
      <NavLink to={"/"} className="btn btn-primary">
        {t("home")}
      </NavLink>
    </div>
  </Fragment>
);

export default withTranslation()(RegistrationSuccessStep);
