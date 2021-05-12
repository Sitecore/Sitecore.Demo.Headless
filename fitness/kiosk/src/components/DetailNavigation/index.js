import React from "react";
import { translate } from "react-i18next";
import { NavLink } from "react-router-dom";
import { flush } from "../../services/SessionService";

const flushSession = () => {
  flush()
  .then(() => {
    this.toggle();

    // refreshing the current route
    // workaround for https://github.com/ReactTraining/react-router/issues/1982#issuecomment-172040295
    const currentLocation = this.props.history.location.pathname;
    this.props.history.push("/null");
    setTimeout(() => {
      this.props.history.push(currentLocation);
    });
  })
  .catch(err => {
    console.error(err);
  });
};

const DetailNavigation = ({ t }) => (
  <div className="nav-container">
    <nav className="navbar navbar-light">
      <div className="logo-container">
        <ul>
          <li>
            <div className="logo-holder logo">
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
