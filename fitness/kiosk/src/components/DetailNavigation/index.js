import React from "react";
import { translate } from "react-i18next";
import { NavLink } from "react-router-dom";
import { flush } from "../../services/SessionService";
/* eslint-disable-next-line import/no-extraneous-dependencies */
import { withRouter } from "react-router";

class DetailNavigation extends React.Component {
  constructor(props) {
    super(props);
  }

  flushSession() {
    flush()
    .then(() => this.props.history.push("/"))
    .catch(err => {
      console.error(err);
    });
  }

  render() {
    const { t } = this.props;

    return (
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
                onClick={() => this.flushSession()}
                className="nav-link nav-link__close"
              >
                {t("flush-session")}
              </a>
            </li>
          </ul>
        </nav>
      </div>
    );
  }
}

export default withRouter(translate()(DetailNavigation));
