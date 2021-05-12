import React from "react";
import { translate } from "react-i18next";
import { NavLink } from "react-router-dom";

class PersonalizationResultsButton extends React.Component {
  constructor(props) {
    super(props);
  }

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
