import React from "react";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";
import { translate } from "react-i18next";
import { flush } from "../../services/SessionService";
import logo from "../../assets/img/logo.svg";

import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink
} from "reactstrap";

class Navigation extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  flushSession() {
    flush()
      .then(response => {
        this.toggle();
      })
      .catch(err => {
        console.error(err);
      });
  }

  nav(url) {
    this.toggle();
    this.props.history.push(url);
  }

  render() {
    const { t, context } = this.props;
    const identification =
      context && context.contact ? context.contact.identification : null;

    return (
      <div className="nav-container">
        <Navbar light>
          <NavbarBrand tag={Link} to={"/"}>
            <img src={logo} alt={"habitat-fitness"} />
          </NavbarBrand>
          {/* <NavLink tag={Link} to={"/"} className="header-account-link">
            Login
          </NavLink> */}
          <NavbarToggler
            onClick={this.toggle}
            className={this.state.isOpen ? "active" : ""}
          />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink
                  tag={Link}
                  to={"/events"}
                  onClick={() => this.nav("/events")}
                  className="nav-link"
                >
                  {t("all-events")}
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  tag={Link}
                  to={"/my-events"}
                  onClick={() => this.nav("/my-events")}
                  className="nav-link"
                >
                  {t("my-events")}
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  tag={Link}
                  to={"/personalize"}
                  onClick={() => this.nav("/personalize")}
                  className="nav-link"
                >
                  {t("personalize")}
                </NavLink>
              </NavItem>
              {identification === "Known" ? null : (
                <NavItem>
                  <NavLink
                    tag={Link}
                    to={"/register"}
                    onClick={() => this.nav("/register")}
                    className="nav-link"
                  >
                    {t("register")}
                  </NavLink>
                </NavItem>
              )}
              <NavItem>
                <NavLink
                  tag={Link}
                  to={"/"}
                  onClick={() => this.flushSession()}
                  className="nav-link"
                >
                  {t("flush-session")}
                </NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

export default withRouter(translate()(Navigation));
