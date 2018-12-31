import React, { Component } from "react";
import { Text } from "@sitecore-jss/sitecore-jss-react";
import { getRawFieldValue } from "../../utils";

class SelectFormField extends Component {
  state = {
    value: ""
  };

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
    this.props.onChange(event);
  }

  render() {
    const { fields } = this.props;
    const defaultValue = getRawFieldValue(fields.selectName);
    return (
      <div className="field">
        <select
          name={defaultValue}
          value={this.state.value}
          onChange={this.handleChange}
        >
          <option value="" disabled>
            {defaultValue}
          </option>
          {fields.options.map((option, index) => {
            const value = getRawFieldValue(option.fields.Name);
            return (
              <option key={index} value={value}>
                {value}
              </option>
            );
          })}
        </select>
      </div>
    );
  }
}

export default SelectFormField;