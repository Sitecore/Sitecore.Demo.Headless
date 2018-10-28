import React, { Component } from "react";
import { Placeholder, Text } from "@sitecore-jss/sitecore-jss-react";
import { NavLink } from "react-router-dom";
import { canUseDOM } from "../../utils";
import { translate } from "react-i18next";
import { setIdentifiers } from "../../utils/XConnectProxy";
import Consent from "../Consent";
import ContinueButton from "../ContinueButton";

class SaveAsAccountStep extends Component {
  state = {
    firstname: "",
    lastname: "",
    email: ""
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

    if (canUseDOM) {
      localStorage.setItem(event.target.name, event.target.value);
    }
  }

  onCreateClick() {
    setIdentifiers()
      .then(response => {
        console.log(response.data);
      })
      .catch(err => {
        console.log(err);
      });
  }

  isValid() {
    return this.state.email;
  }

  render() {
    const { fields, rendering, t } = this.props;
    return (
      <form className="wizardStep wizardStep_SaveAsAccountStep">
        <div className="wizardStep-content">
          <div className="wizardStep-header">
            <Text field={fields.title} tag="h4" className="wizardStep-title" />
          </div>
          <div className="wizardStep-form-container">
            <div className="wizardStep-form">
              <div className="fieldset">
                <Placeholder
                  name="hf-createaccount-form"
                  rendering={rendering}
                  onChange={this.handleChange}
                />
              </div>
              <div className="wizardStep-skip">
                <NavLink to="/" className="">
                  {t("skip this")}
                </NavLink>
              </div>
            </div>
          </div>
        </div>
        <div className="wizardStep-form-actions align-items-center">
          <ContinueButton
            currentContext={this.props.currentContext}
            onContinue={this.onCreateClick}
            disabled={!this.isValid()}
          />
          <Consent />
        </div>
      </form>
    );
  }
}

export default translate()(SaveAsAccountStep);
