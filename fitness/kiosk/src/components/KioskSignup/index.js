import React, { Fragment } from "react";
import Consent from "../Consent";
import { translate } from "react-i18next";
import { Text } from "@sitecore-jss/sitecore-jss-react";
import { setIdentification } from "../../services/IdentificationService";
import { NavLink } from "react-router-dom";

class KioskSignup extends React.Component {
  state = {
    firstname: "",
    lastname: "",
    email: "",
    signedUp: false,
    error: false
  };

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.onCreateClick = this.onCreateClick.bind(this);
  }

  handleChange(event) {
    this.setState(
      Object.assign(this.state, {
        [event.target.name]: event.target.value
      })
    );
  }

  isValid() {
    return this.state.email;
  }

  onCreateClick() {
    const { firstname, lastname, email } = this.state;
    setIdentification(firstname, lastname, email)
      .then(response => this.setState({ signedUp: true }))
      .catch(err => {
        this.setState({ error: true });
        console.log(err);
      });
  }

  render() {
    const { t, fields } = this.props;
    const { firstname, lastname, email, signedUp, error } = this.state;

    const form = (
      <form className="form createAccount-form">
        <div className="form-body">
          <Text field={fields.title} tag="h2" className="form-title" />
          <fieldset className="fieldset">
            <div className="field">
              <input
                type="text"
                name="firstname"
                value={firstname}
                required
                placeholder="First Name"
                onChange={this.handleChange}
              />
            </div>
            <div className="field">
              <input
                type="text"
                name="lastname"
                value={lastname}
                required
                placeholder="Last Name"
                onChange={this.handleChange}
              />
            </div>
            <div className="field">
              <input
                type="email"
                name="email"
                value={email}
                required
                placeholder="Email"
                onChange={this.handleChange}
              />
            </div>
          </fieldset>
        </div>
        <div className="form-footer">
          <div className="form-actions">
            <button
              type="button"
              disabled={!this.isValid()}
              className="btn btn-primary"
              onClick={this.onCreateClick}
            >
              {t("create-account")}
            </button>
          </div>
          <Consent />
        </div>
      </form>
    );

    let message = (
      <Fragment>
        <div className="form-body">
          <h2 className="form-title">{t("register-thanks")}</h2>
          <p className="form-title">{t("registration-directions")}</p>
        </div>
        <div className="form-footer">
          <div className="form-actions">
            <NavLink to={"/"} className="btn btn-primary">
              {t("home")}
            </NavLink>
          </div>
        </div>
      </Fragment>
    );

    if (error) {
      message = (
        <Fragment>
          <div className="form-body">
            <h2 className="form-title">{t("error-registering-title")}</h2>
            <p className="form-title">{t("error-registering-text")}</p>
          </div>
          <div className="form-footer">
            <div className="form-actions">
              <NavLink to={"/"} className="btn btn-primary">
                {t("home")}
              </NavLink>
            </div>
          </div>
        </Fragment>
      );
    }

    return (
      <div className="createAccount">
        <div className="createAccount-body">{signedUp || error ? message : form}</div>
      </div>
    );
  }
}

export default translate()(KioskSignup);
