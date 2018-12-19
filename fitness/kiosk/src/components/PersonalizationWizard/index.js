import React, { Component, Fragment } from "react";
import {
  Text,
  Placeholder,
  withPlaceholder
} from "@sitecore-jss/sitecore-jss-react";
import { PersonalizationWizardContext } from "../../contexts/PersonalizationWizardContext";
import { NavLink } from "react-router-dom";

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

  getStepNames(placeholder) {
    return placeholder
      .filter(e => e.type !== "code")
      .map((element, i) => {
        return <Text field={element.props.fields.stepName} />;
      });
  }

  render() {
    const { fields, wizardPlaceholder, rendering } = this.props;
    const stepNames = this.getStepNames(wizardPlaceholder);
    return (
      <PersonalizationWizardWrap>
        <div className="personalizationWizard">
          <PersonalizationWizardContext.Consumer>
            {context => (
              <Fragment>
                {stepNames.length > 1 && (
                  <div className="personalizationWizard-header">
                    <Text
                      tag="h3"
                      field={fields.title}
                      className="personalizationWizard-title"
                    />
                    <ProgressBar
                      percentage={this.getPercentage(
                        context.activeStepIndex,
                        wizardPlaceholder.length
                      )}
                      steps={stepNames}
                    />
                  </div>
                )}
                <div className="personalizationWizard-body">
                  <Placeholder
                    name="hf-personalization-wizard"
                    rendering={rendering}
                    currentContext={context}
                    stepCount={stepNames.length}
                    render={(components, placeholderData, props) => (
                      <Fragment>{components[context.activeStepIndex]}</Fragment>
                    )}
                  />
                </div>
              </Fragment>
            )}
          </PersonalizationWizardContext.Consumer>
        </div>
      </PersonalizationWizardWrap>
    );
  }
}

const ProgressBar = ({ percentage, max, steps }) => (
  <span className="steppedProgressBar-progress">
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
    <div className="progress-legends">
      {steps.map((step, index) => (
        <span key={index}>{step}</span>
      ))}
    </div>
  </span>
);

export default withPlaceholder({
  placeholder: "hf-personalization-wizard",
  prop: "wizardPlaceholder"
})(PersonalizationWizard);
