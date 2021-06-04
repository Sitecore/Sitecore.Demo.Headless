import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { translate } from "react-i18next";
import SportOption from "../SportOption";
import { logFilterEvent } from "../../services/BoxeverService";

class SportsFilter extends React.Component {
  state = {
    previousSelectedSports: [],
    selectedSports: []
  };

  constructor(props) {
    super(props);
    this.onCardClick = this.onCardClick.bind(this);
    this.onApplyClick = this.onApplyClick.bind(this);
    this.onCancelClick = this.onCancelClick.bind(this);
  }

  onApplyClick() {
    this.setState({ previousSelectedSports: this.state.selectedSports });
    this.props.onApply(this.state.selectedSports);
    logFilterEvent(this.state.selectedSports);
  }

  selectionChanged() {
    return (
      this.state.previousSelectedSports.join("") !==
      this.state.selectedSports.join("")
    );
  }

  onCancelClick() {
    this.props.onCancel();
  }

  onCardClick(key, remove) {
    this.setState(state => {
      let selectedSports;
      if (remove) {
        selectedSports = state.selectedSports.filter(sport => sport !== key);
      } else {
        selectedSports = state.selectedSports.concat(key).sort();
      }
      return {
        selectedSports
      };
    });
  }

  render() {
    const { sports, t, className, onToggle } = this.props;
    const { selectedSports } = this.state;

    return (
      <Modal
        isOpen={this.props.open}
        toggle={onToggle}
        className={`${className ? className : ""} confirmPopup`}
      >
        <ModalHeader>
          <div className="sportPicker-header">{t("select-sports")}</div>
        </ModalHeader>
        <ModalBody>
          <div className="sportPicker">
            <div className="sportPicker-options">
              {sports
                ? sports.map((sport, index) => (
                    <SportOption
                      key={index}
                      data={sport}
                      selected={selectedSports.includes(
                        sport.fields.Name.value
                      )}
                      onCardClick={this.onCardClick}
                    />
                  ))
                : null}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <div
            className="sportPicker-actions align-items-center"
            style={{ textAlign: "center" }}
          >
            <button
              className="btn btn-primary btn-sm"
              disabled={!this.selectionChanged()}
              onClick={this.onApplyClick}
              style={{ marginRight: 10 }}
            >
              {t("apply-filter")}
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={this.onCancelClick}
            >
              {t("cancel")}
            </button>
          </div>
        </ModalFooter>
      </Modal>
    );
  }
}

export default translate()(SportsFilter);
