import React, { Component } from "react";
import { Text } from "@sitecore-jss/sitecore-jss-react";
import { iconPaths } from "../../Resources";
import Icon from '../Icon';

class SportOption extends Component {
  state = {
    selected: this.props.selected
  };

  onClick() {
    const reset = this.state.selected;

    this.setState(prevState => ({
      selected: !prevState.selected
    }));

    const { data } = this.props;
    const key = data.fields.Name.value;
    this.props.onCardClick(key, reset);
  }

  render() {
    const { selected } = this.state;
    const { fields } = this.props.data;
    const imageName = fields.Name.value;

    return (
      <div
        className={`sportPicker-option ${selected ? "selected" : ""}`}
        onClick={() => this.onClick()}
      >
        <div className="sportPicker-option-inner">
          <div className="sportPicker-option-icon">
            <Icon name={imageName} path={iconPaths[imageName]} />
          </div>
          <div className="sportPicker-option-content">
            <Text
              field={fields.Name}
              tag="h6"
              className="sportPicker-option-title"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default SportOption;
