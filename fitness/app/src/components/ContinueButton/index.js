import React, { Component } from "react";
/* eslint-disable-next-line import/no-extraneous-dependencies */
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";

class ContinueButton extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.onContinue();
    this.props.currentContext.next();
  }

  render() {
    const { disabled, className, t } = this.props;
    return (
      <button
        type="button"
        className={className}
        disabled={disabled}
        onClick={this.handleClick}
      >
        <span className="txt">{t("continue")}</span>
        <span className="ico ico-right-text ico-arrow" />
      </button>
    );
  }
}

ContinueButton.propTypes = {
  title: PropTypes.string,
  className: PropTypes.string,
  onContinue: PropTypes.func,
  currentContext: PropTypes.object
};

ContinueButton.defaultProps = {
  className: "btn btn-primary"
};

export default withTranslation()(ContinueButton);
