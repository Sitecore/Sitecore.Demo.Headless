import React from "react";
import { Link } from "@sitecore-jss/sitecore-jss-react";
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
    <div className="logo-container">
      <ul>
        <li>
          <div className="logo-holder logo">
            <NavLink className="logo" to="/">
              <h3> <span>LIGHT</span>HOUSE</h3>
              <p>FITNESS</p>
            </NavLink>
          </div>
        </li>
      </ul>
    </div>
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
      bottom: 50,
      position: "absolute"
    };
  }
  if (value === "top") {
    return {
      top: 250,
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
