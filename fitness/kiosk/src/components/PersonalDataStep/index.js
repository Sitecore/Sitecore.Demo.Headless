import React, { Component } from "react";
import { Placeholder, Text } from "@sitecore-jss/sitecore-jss-react";
import ContinueButton from "../ContinueButton/";
import { NavLink } from "react-router-dom";
import { translate } from "react-i18next";
import {
  setDemographicsFacet,
  setDemographicsProfile
} from "../../services/DemographicsService";

class PersonalDataStep extends Component {
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
  }

  handleContinueClick(event) {
    const { age, gender } = this.state;
    setDemographicsFacet(age, gender)
      .catch(err => {
        console.log(err);
      });

    setDemographicsProfile(age, gender)
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    const { fields, rendering, t } = this.props;
    const canContinue = this.state.age && this.state.gender;

    return (
      <div className="wizardStep wizardStep_personalInfo">
        <div className="wizardStep-content">
          <div className="wizardStep-header">
            <Text field={fields.title} tag="h4" className="wizardStep-title" />
          </div>
          <div className="wizardStep-form-container">
            <div className="wizardStep-form">
              <div className="fieldset">
                <div className="fields">
                  <Placeholder
                    name="hf-createaccount-form"
                    rendering={rendering}
                    onChange={this.handleChange}
                  />
                </div>
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
            disabled={!canContinue}
            onContinue={this.handleContinueClick}
          />
        </div>
      </div>
    );
  }
}

export default translate()(PersonalDataStep);
