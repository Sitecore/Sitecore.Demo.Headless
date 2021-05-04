import React from "react";
/* eslint-disable-next-line import/no-extraneous-dependencies */
import { withRouter } from "react-router";
import { Placeholder, Text } from "@sitecore-jss/sitecore-jss-react";
import { withTranslation } from "react-i18next";
import { sendDemographicsToBoxever } from "../../services/DemographicsService";
import { setIdentification } from "../../services/IdentificationService";
import { getGuestRef, getRegisteredEventsResponse, isAnonymousGuestInGuestResponse } from "../../services/BoxeverService";
import ContinueButton from "../ContinueButton";
import Consent from "../Consent";
import Loading from "../Loading";

class CreateAccountStep extends React.Component {
  state = {
    gender: "",
    age: "",
    firstname: "",
    lastname: "",
    email: "",
    shouldDisplayLoading: true
  };

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.onContinueClick = this.onContinueClick.bind(this);
  }

  handleChange(event) {
    this.setState(
      Object.assign(this.state, {
        [event.target.name]: event.target.value
      })
    );
  }

  isValid() {
    return this.state.email && this.state.gender && this.state.age;
  }

  onContinueClick() {
    const { firstname, lastname, email, gender, age } = this.state;
    var promises = [];

    promises.push(
      setIdentification(firstname, lastname, email)
      .catch(err => {
        console.log(err);
      })
    );

    promises.push(
      sendDemographicsToBoxever(age, gender)
      .catch(err => {
        console.log(err);
      })
    );

    return Promise.all(promises);
  }

  componentDidMount() {
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

    const { fields, rendering } = this.props;
    return (
      <span className="createAccount">
        <div className="createAccount-body">
          <form className="createAccount-form">
            <div className="createAccount-form-body">
              <Text
                field={fields.title}
                tag="h2"
                className="createAccount-form-title"
              />
              <fieldset className="fieldset">
                <Placeholder
                  name="hf-createaccount-form"
                  rendering={rendering}
                  onChange={this.handleChange}
                />
                <div className="fields">
                  <Placeholder
                    name="hf-createaccount-form-group"
                    rendering={rendering}
                    onChange={this.handleChange}
                  />
                </div>
              </fieldset>
            </div>
            <div className="createAccount-form-footer">
              <div className="createAccount-form-actions align-items-center">
                <ContinueButton
                  currentContext={this.props.currentContext}
                  disabled={!this.isValid()}
                  onContinue={this.onContinueClick}
                />
              </div>
              <Consent />
            </div>
          </form>
        </div>
      </span>
    );
  }
}

export default withRouter(withTranslation()(CreateAccountStep));
