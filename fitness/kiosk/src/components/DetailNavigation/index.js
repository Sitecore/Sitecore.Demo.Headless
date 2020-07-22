import React from "react";
import { translate } from "react-i18next";
import { NavLink } from "react-router-dom";
import logo from "../../assets/img/logo.svg";
import { flush } from "../../services/SessionService";

const flushSession = () => {
  flush()
    .then(response => {
      console.log("session flushed");
    })
    .catch(err => {
      console.error(err);
    });
};

const DetailNavigation = ({ t }) => (
  <div className="nav-container">
    <nav className="navbar navbar-light">
      <div class="logo-container">
        <ul>
          <li>
            <div class="logo-holder logo">
              <NavLink className="navbar-brand" to="/">
                <h3> <span>LIGHT</span>HOUSE</h3>
                <p>FITNESS</p>
              </NavLink>
            </div>
          </li>
        </ul>
      </div>
      <ul className="navbar-nav">
        <li className="nav-item">
          <NavLink className="nav-link" to="/events">
            {t("events")}
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/personalize">
            {t("personalize")}
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/change-location">
            {t("set-location")}
          </NavLink>
        </li>
        <li className="nav-item">
          <a
            href="#"
            onClick={() => flushSession()}
            className="nav-link nav-link__close"
          >
            {t("flush-session")}
          </a>
        </li>
      </ul>
    </nav>
  </div>
);

export default translate()(DetailNavigation);
