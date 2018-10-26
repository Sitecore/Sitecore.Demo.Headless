import React from "react";
import { NavLink } from "react-router-dom";
import { withRouter } from "react-router";
import { Placeholder, Text } from "@sitecore-jss/sitecore-jss-react";
import { canUseDOM } from "../../utils";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import icoCheck from "../../assets/img/check-blue.svg";
import { translate } from "react-i18next";
import { setIdentifiers } from "../../utils/XConnectProxy";

class CreateAccount extends React.Component {
  state = {
    gender: "",
    age: "",
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

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  isValid() {
    return (
      this.state.email &&
      this.state.gender &&
      this.state.age
    );
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

  render() {
    const { fields, rendering, t } = this.props;
    return (
      <span className="createAccount">
        <span className="createAccount-fixedHeader steppedProgressBar">
          <span className="steppedProgressBar-progress">
            <div className="progress">
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: "66%" }}
              />
            </div>
            <span className="progress-legends">
              <span>Your info</span>
              <span>Confirmation</span>
              <span>Complete</span>
            </span>
          </span>
        </span>
        <div className="createAccount-body">
          <form className="createAccount-form">
            <div className="createAccount-form-body">
              <Text
                field={fields.heading}
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
              <div className="createAccount-form-actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={!this.isValid()}
                  onClick={this.onCreateClick}
                >
                  {t("create-account")}
                </button>
              </div>
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
        </div>
      </span>
    );
  }
}

export default withRouter(translate()(CreateAccount));
