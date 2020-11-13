import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { withTranslation } from "react-i18next";

class RegistrationPrompt extends React.Component {
  render() {
    const { t, className, open, toggle, onRegister } = this.props;
    return (
      <Modal
        isOpen={open}
        toggle={toggle}
        className={`${className ? className : ""} confirmPopup`}
      >
        <ModalHeader>
          {t("registration-confirmation")}
          <button type="button" className="close" aria-label="Close">
            <span aria-hidden="true">×</span>
          </button>
        </ModalHeader>
        <ModalBody />
        <ModalFooter>
          <button
            onClick={onRegister}
            className="btn btn-primary btn-yes"
            dangerouslySetInnerHTML={{ __html: t("yes") }}
          />
          <button
            onClick={toggle}
            className="btn btn-secondary btn-no"
            dangerouslySetInnerHTML={{ __html: t("no") }}
          />
        </ModalFooter>
      </Modal>
    );
  }
}

export default withTranslation()(RegistrationPrompt);
