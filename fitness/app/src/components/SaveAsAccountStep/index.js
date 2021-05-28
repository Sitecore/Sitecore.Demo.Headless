import React, { Component } from "react";
import { Placeholder, Text } from "@sitecore-jss/sitecore-jss-react";
import { NavLink } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { setIdentification } from "../../services/IdentificationService";
import Consent from "../Consent";
import ContinueButton from "../ContinueButton";
import {
  getGuestRef,
  getRegisteredEventsResponse,
  isAnonymousGuestInGuestResponse,
  isBoxeverConfigured
} from "../../services/BoxeverService";
import Loading from "../Loading";

class SaveAsAccountStep extends Component {
  state = {
    firstname: "",
    lastname: "",
    email: "",
    shouldDisplayLoading: isBoxeverConfigured()
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

  onCreateClick() {
    if (!isBoxeverConfigured()) {
      return new Promise(function (resolve) { resolve(); });
    }

    const { firstname, lastname, email } = this.state;

    return setIdentification(firstname, lastname, email)
    .catch(err => {
      console.log(err);
    });
  }

  isValid() {
    return this.state.email;
  }

  componentDidMount() {
    if (!isBoxeverConfigured()) {
      return;
    }

    getGuestRef()
    .then(response => {
      return getRegisteredEventsResponse(response.guestRef);
    })
    .then(guestResponse => {
      const isAnonymousGuest = isAnonymousGuestInGuestResponse(guestResponse);
      if(!isAnonymousGuest){
        this.props.currentContext.next();
        return;
      }
      this.setState({
        shouldDisplayLoading: false
      });
    })
    .catch(e => {
      console.log(e);
    });
  }

  render() {
     // Don't render anything if the Boxever state is not received yet.
     if (this.state.shouldDisplayLoading) {
      return <Loading />;
    }

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

export default withTranslation()(SaveAsAccountStep);
