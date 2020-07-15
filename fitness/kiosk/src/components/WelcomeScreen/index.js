import React from "react";
import { Link } from "@sitecore-jss/sitecore-jss-react";
import logo from "../../assets/img/logo.svg";
import { NavLink } from "react-router-dom";

const WelcomeScreen = ({ context, fields }) => (
  <div
    className="welcomeScreen"
    style={
      fields.backgroundImage
        ? { backgroundImage: `url(${fields.backgroundImage.value.src})` }
        : null
    }
  >
    <NavLink className="logo" to="/">
      <img src={logo} alt="Lighthouse Fitness Kiosk" />
    </NavLink>
    <div className="welcomeScreen-content">
      {context.pageEditing ? (
        <Link
          field={fields.cta}
          className="btn btn-primary btn-action"
          style={getStyleFromAlignment(fields.alignment)}
        />
      ) : (
        <NavLink
          className="btn btn-primary btn-action"
          to={fields.cta.value.href}
          style={getStyleFromAlignment(fields.alignment)}
        >
          {fields.cta.value.text}
        </NavLink>
      )}
    </div>
  </div>
);

const getStyleFromAlignment = alignmentItem => {
  if (!alignmentItem || !alignmentItem.fields || !alignmentItem.fields.name) {
    return {};
  }

  const value = alignmentItem.fields.name.value;
  if (value === "bottom") {
    return {
      bottom: 0,
      position: "absolute"
    };
  }
  if (value === "top") {
    return {
      top: 200,
      position: "absolute"
    };
  }
  // default returns empty style object, which will center the button
  if (value === "middle") {
    return {};
  }
  return {};
};

export default WelcomeScreen;
