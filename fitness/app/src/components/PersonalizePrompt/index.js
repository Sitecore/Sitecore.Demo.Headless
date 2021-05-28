import React from "react";
import { RichText, withSitecoreContext } from "@sitecore-jss/sitecore-jss-react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { withTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { canUseDOM } from "../../utils";
import { getSessionCount, isBoxeverConfigured } from "../../services/BoxeverService";
import { hasSportsFacets } from "../../services/SportsService";
import { personalizePromptLocalStorageKey } from "../../services/SessionService";

class PersonalizePrompt extends React.Component {
  state = {
    open: false,
    pageEditing: false
  };

  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    const pageEditing = this.props.sitecoreContext.pageEditing === true;
    if (pageEditing) {
      this.setState({ pageEditing });
      return;
    }

    if (!isBoxeverConfigured()) {
      return;
    }

    if (!canUseDOM || localStorage.getItem(personalizePromptLocalStorageKey) !== null) {
      return;
    }

    var visitCount;

    getSessionCount()
    .then(count => {
      visitCount = parseInt(count.sessionCount);
      return hasSportsFacets();
    })
    .then(hasSports => {
      const shouldOpen = !hasSports && visitCount > 3;
      this.setState({ open: shouldOpen });
    })
    .catch(e => {
      console.log(e);
    });
  }

  toggle() {
    const open = !this.state.open;

    if (canUseDOM) {
      localStorage.setItem(personalizePromptLocalStorageKey, open);
    }

    this.setState({
      open: open
    });
  }

  render() {
    const { fields, t, className } = this.props;

    if (this.state.pageEditing) {
      return (
        <div style={{ paddingTop: 50, paddingBottom: 50, textAlign: "center" }}>
          <button className="btn btn-primary btn-sm" style={{margin: '0 auto'}}>Edit Personalization Prompt Modal</button>
        </div>
      );
    }

    return (
      <Modal
        isOpen={this.state.open}
        toggle={this.toggle}
        className={`${className ? className : ""} confirmPopup`}
      >
        <ModalHeader>
          <RichText field={fields.headerText} />
        </ModalHeader>
        <ModalBody>
          <RichText field={fields.bodyText} tag="p" />
        </ModalBody>
        <ModalFooter>
          <NavLink
            to="/personalize"
            onClick={this.toggle}
            className="btn btn-primary btn-sm"
          >
            {t("get-started")}
          </NavLink>
          <NavLink
            to="/"
            onClick={this.toggle}
            className="btn btn-secondary btn-sm"
          >
            {t("no-thanks")}
          </NavLink>
        </ModalFooter>
      </Modal>
    );
  }
}

export default withSitecoreContext()(withTranslation()(PersonalizePrompt));
