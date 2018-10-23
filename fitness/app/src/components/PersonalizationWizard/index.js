import React, { Component } from "react";
import { Text, withPlaceholder } from "@sitecore-jss/sitecore-jss-react";
import { PersonalizationWizardContext } from "../../contexts/PersonalizationWizardContext";

class PersonalizationWizardWrap extends Component {
  state = {
    activeStepIndex: 0,
    next: () => {
      this.setState({ activeStepIndex: this.state.activeStepIndex + 1 });
    },
    prev: () => {
      this.setState({ activeStepIndex: this.state.activeStepIndex - 1 });
    }
  };

  render() {
    return (
      <PersonalizationWizardContext.Provider value={this.state}>
        {this.props.children}
      </PersonalizationWizardContext.Provider>
    );
  }
}

class PersonalizationWizard extends Component {
  getPercentage(index, length) {
    return index === length - 1 ? 100 : Math.round(100 / length) * (index + 1);
  }

  render() {
    const { fields, wizardPlaceholder } = this.props;
    return (
      <PersonalizationWizardWrap>
        <div className="personalizationWizard">
          <div className="personalizationWizard-header">
            <Text tag='h3' field={fields.title} className='personalizationWizard-title' />
            <PersonalizationWizardContext.Consumer>
              {context => (
                <React.Fragment>
                  <ProgressBar
                    percentage={this.getPercentage(
                      context.activeStepIndex,
                      wizardPlaceholder.length
                    )}
                  />
                </React.Fragment>
              )}
            </PersonalizationWizardContext.Consumer>
          </div>
          <div className="personalizationWizard-body">
            <PersonalizationWizardContext.Consumer>
              {context => (
                <React.Fragment>
                  {wizardPlaceholder.filter(e => e.type !== "code")[context.activeStepIndex]}
                </React.Fragment>
              )}
            </PersonalizationWizardContext.Consumer>
          </div>
        </div>
      </PersonalizationWizardWrap>
    );
  }
}

const ProgressBar = ({ percentage, max }) => (
  <div className="progress">
    <div
      className="progress-bar"
      role="progressbar"
      style={{
        width: `${percentage}%`,
        ariaValueNow: percentage,
        ariaValueMin: 0,
        ariaValueMax: max
      }}
    >
      {percentage}%
    </div>
  </div>
);

export default withPlaceholder({
  placeholder: "hf-personalization-wizard",
  prop: "wizardPlaceholder"
})(PersonalizationWizard);
