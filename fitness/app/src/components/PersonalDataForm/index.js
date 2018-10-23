import React, { Component } from "react";
import { Placeholder, Text } from "@sitecore-jss/sitecore-jss-react";
import ContinueButton from "../ContinueButton/";
import { NavLink } from "react-router-dom";
import { canUseDOM } from "../../utils";
import { translate } from "react-i18next";
import { setDemographicsPreferences } from "../../utils/XConnectProxy";

class PersonalDataForm extends Component {
  state = {
    gender: "",
    age: ""
  };

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleContinueClick = this.handleContinueClick.bind(this);
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

  handleContinueClick(event) {
    setDemographicsPreferences()
      .then(response => {
        console.log(response.data);
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    const { fields, rendering, t } = this.props;
    const canContinue = this.state.age && this.state.gender;

    return (
      <div className="personalizationWizardForm personalizationWizardForm_personalInfo">
        <div className="personalizationWizardForm-content">
          <div className="personalizationWizardForm-header">
            <Text
              field={fields.title}
              tag="h4"
              className="personalizationWizardForm-title"
            />
          </div>
          <div className="personalizationWizardForm-form-container">
            <div className="personalizationWizardForm-form">
              <div className="fieldset">
                <div className="fields">
                  <Placeholder
                    name="hf-createaccount-form"
                    rendering={rendering}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="personalizationWizardForm-skip">
                <NavLink to="/" className="">
                  {t("skip this")}
                </NavLink>
              </div>
            </div>
          </div>
        </div>
        <div className="personalizationWizardForm-form-actions align-items-end">
          <ContinueButton
            disabled={!canContinue}
            onContinue={this.handleContinueClick}
          />
        </div>
      </div>
    );
  }
}

export default translate()(PersonalDataForm);
