import React from "react";
import { Text } from "@sitecore-jss/sitecore-jss-react";
import logo from "../../assets/img/logo.svg";
import { NavLink } from "react-router-dom";

const WelcomeScreen = props => (
  <div
    className="welcomeScreen"
    style={{ backgroundImage: "url(//via.placeholder.com/1728x3072/312213)" }}
  >
    <a className="logo" href="/">
      <img src={logo} alt="Habitat Fitness Kiosk" />
    </a>
    <div className="welcomeScreen-content">
      <NavLink className="btn btn-primary btn-action" to="/events">
        Get Started
      </NavLink>
    </div>
  </div>
);

export default WelcomeScreen;
