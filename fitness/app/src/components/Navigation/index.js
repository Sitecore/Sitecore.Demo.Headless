import React from "react";
import { Link } from "react-router-dom";
/* eslint-disable-next-line import/no-extraneous-dependencies */
import { withRouter } from "react-router";
import { withTranslation } from "react-i18next";
import { flush } from "../../services/SessionService";
import { isAnonymousGuest } from "../../services/BoxeverService";
import { isOrderCloudConfigured } from "../../services/OrderCloudService";
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
      isOpen: false,
      isIdentified: false
    };
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  flushSession() {
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
  }

  nav(url) {
    this.toggle();
    this.props.history.push(url);
  }

  componentDidMount() {
    isAnonymousGuest()
    .then(isAnonymous => {
      this.setState({isIdentified: !isAnonymous});
    })
    .catch(e => {
      console.log(e);
    });
  }

  render() {
    const { t } = this.props;

    const shopNavItem = !isOrderCloudConfigured() ? null : (
      <NavItem>
        <NavLink
          tag={Link}
          to={"/shop"}
          onClick={() => this.nav("/shop")}
          className="nav-link"
        >
          Shop
        </NavLink>
      </NavItem>
    );

    const registerNavItem = this.state.isIdentified ? null : (
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
    );

    return (
      <div className="nav-container">
        <Navbar light>
          <div className="logo-container">
            <ul>
              <li>
                <div className="logo-holder logo">
                  <NavbarBrand tag={Link} to={"/"}>
                    <h3> <span>LIGHT</span>HOUSE</h3>
                    <p>FITNESS</p>
                  </NavbarBrand>
                </div>
              </li>
            </ul>
          </div>
          <NavbarToggler
            onClick={this.toggle}
            className={this.state.isOpen ? "active" : ""}
          />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              {shopNavItem}
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
              {registerNavItem}
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

export default withRouter(withTranslation()(Navigation));
