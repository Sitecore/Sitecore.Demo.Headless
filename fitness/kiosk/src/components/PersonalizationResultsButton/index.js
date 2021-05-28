import React from "react";
import { translate } from "react-i18next";

class PersonalizationResultsButton extends React.Component {
  handleOnclick = () => {
    this.props.onClick()
    .then(() => {
      window.location.assign("/events");
    });
  }

  render() {
    const { t } = this.props;

    return (
      <button className="btn btn-primary" onClick={this.handleOnclick}>
        {t("see-results")}
      </button>
    );
  }
}

export default translate()(PersonalizationResultsButton);
