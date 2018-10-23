import React, { Component } from "react";
import { Placeholder, Text } from "@sitecore-jss/sitecore-jss-react";
import { NavLink } from "react-router-dom";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { canUseDOM } from "../../utils";
import { translate } from "react-i18next";
import { setIdentifiers } from "../../utils/XConnectProxy";

import icoCheck from "../../assets/img/check-blue.svg";

class SaveAsAccount extends Component {
  state = {
    firstname: "",
    lastname: "",
    email: "",
    modal: false
  };

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.toggle = this.toggle.bind(this);
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
        this.setState({ modal: true });
      })
      .catch(err => {
        console.log(err);
      });
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  isValid() {
    return this.state.email;
  }

  render() {
    const { fields, rendering, t } = this.props;
    return (
      <React.Fragment>
        <form className="personalizationWizardForm personalizationWizardForm_saveAsAccount">
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
                  <Placeholder
                    name="hf-createaccount-form"
                    rendering={rendering}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="personalizationWizardForm-skip">
                  <NavLink to="/" className="">
                    {t("skip this")}
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
          <div className="personalizationWizardForm-form-actions align-items-center">
            <button
              type="button"
              className="btn btn-primary"
              disabled={!this.isValid()}
              onClick={this.onCreateClick}
            >
              {t("create-account")}
            </button>

            <div className="consent">
              <p>
                By creating an account you agree to our{" "}
                <a href="/">Terms of Service</a> and{" "}
                <a href="/">Privacy Policy</a>
              </p>
            </div>
          </div>
        </form>

        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}
          className={`${
            this.props.className ? this.props.className : ""
          } confirmPopup`}
        >
          <img src={icoCheck} width="55" alt="check" />
          <ModalHeader toggle={this.toggle}>
            {t("validation link sent")}
          </ModalHeader>
          <ModalBody />
          <ModalFooter>
            <NavLink to="/" className="btn btn-primary btn-sm">
              {t("ok")}
            </NavLink>
          </ModalFooter>
        </Modal>
      </React.Fragment>
    );
  }
}

export default translate()(SaveAsAccount);
