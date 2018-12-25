import React from "react";
import { Text, Link } from "@sitecore-jss/sitecore-jss-react";
import logo from "../../assets/img/logo.svg";
import { NavLink } from "react-router-dom";

const WelcomeScreen = ({ context, fields, params }) => (
  <div
    className="welcomeScreen"
    style={
      fields.backgroundImage
        ? { backgroundImage: `url(${fields.backgroundImage.value.src})` }
        : null
    }
  >
    <NavLink className="logo" to="/">
      <img src={logo} alt="Habitat Fitness Kiosk" />
    </NavLink>
    <div className="welcomeScreen-content">
      {context.pageEditing ? (
        <Link
          field={fields.cta}
          style={getStyleFromAlignmentParam(params.alignment)}
        />
      ) : (
        <NavLink
          className="btn btn-primary btn-action"
          to={fields.cta.value.href}
          style={getStyleFromAlignmentParam(params.alignment)}
        >
          {fields.cta.value.text}
        </NavLink>
      )}
    </div>
  </div>
);

const getStyleFromAlignmentParam = alignment => {
  debugger;
  if (alignment === "bottom") {
    return {
      bottom: 0,
      position: "absolute"
    };
  }
  if (alignment === "top") {
    return {
      top: 200,
      position: "absolute"
    };
  }
  // default returns empty style object, which will center the button
  if (alignment === "middle") {
    return {};
  }
  return {};
};

export default WelcomeScreen;