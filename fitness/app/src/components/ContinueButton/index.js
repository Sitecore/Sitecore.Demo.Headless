import React, { Component } from 'react';
import PropTypes from "prop-types";
import { translate } from 'react-i18next';
import { PersonalizationWizardContext } from "../../contexts/PersonalizationWizardContext";

class ContinueButton extends Component {

  constructor(props){
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(context){
    this.props.onContinue();
    context.next();
  }

  render() {
    const { disabled, className, t } = this.props;
    return (
      <PersonalizationWizardContext.Consumer>
      {context => (
        <button
          type="button"
          className={className}
          disabled={disabled}
          onClick={() => this.handleClick(context)}
        >
          <span className="txt">{t('continue')}</span>
          <span className="ico ico-right-text ico-arrow"></span>
        </button>
      )}
    </PersonalizationWizardContext.Consumer>
    );
  }
}

ContinueButton.propTypes = {
  title: PropTypes.string,
  className: PropTypes.string,
  onContinue: PropTypes.func
};

ContinueButton.defaultProps = {
  className: "btn btn-primary"
};

export default translate()(ContinueButton);