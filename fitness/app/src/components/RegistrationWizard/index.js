import React, { Component, Fragment } from "react";
import {
  Text,
  Placeholder,
  withPlaceholder
} from "@sitecore-jss/sitecore-jss-react";
import { RegistrationWizardContext } from "../../contexts/RegistrationWizardContext";

class RegistrationWizardWrap extends Component {
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
      <RegistrationWizardContext.Provider value={this.state}>
        {this.props.children}
      </RegistrationWizardContext.Provider>
    );
  }
}

class RegistrationWizard extends Component {
  getPercentage(index, length) {
    return index === length - 1 ? 100 : Math.round(100 / length) * (index + 1);
  }

  getStepNames(placeholder) {
    return placeholder.filter(e => e.type !== "code").map((element, i) => {
      return <Text field={element.props.fields.stepName} />;
    });
  }

  render() {
    const { fields, wizardPlaceholder, rendering } = this.props;
    return (
      <RegistrationWizardWrap>
        <div className="personalizationWizard">
          <RegistrationWizardContext.Consumer>
            {context => (
              <Fragment>
                <div className="personalizationWizard-header">
                  {fields &&
                    fields.title && (
                      <Text
                        tag="h3"
                        field={fields.title}
                        className="personalizationWizard-title"
                      />
                    )}
                  <ProgressBar
                    percentage={this.getPercentage(
                      context.activeStepIndex,
                      wizardPlaceholder.length
                    )}
                    steps={this.getStepNames(wizardPlaceholder)}
                  />
                </div>
                <div className="personalizationWizard-body">
                  <Placeholder
                    name="hf-registration-wizard"
                    rendering={rendering}
                    currentContext={context}
                    render={(components, placeholderData, props) => (
                      <Fragment>{components[context.activeStepIndex]}</Fragment>
                    )}
                  />
                </div>
              </Fragment>
            )}
          </RegistrationWizardContext.Consumer>
        </div>
      </RegistrationWizardWrap>
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
  placeholder: "hf-registration-wizard",
  prop: "wizardPlaceholder"
})(RegistrationWizard);
