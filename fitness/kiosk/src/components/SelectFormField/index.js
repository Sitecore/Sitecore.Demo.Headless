import React, { Component } from "react";
import { Text } from "@sitecore-jss/sitecore-jss-react";
import { getRawFieldValue } from "../../utils";

class SelectFormField extends Component {
  state = {
    value: ""
  };

  constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
    this.props.onChange(event);
  }

  render() {
    const { fields } = this.props;
    return (
      <div className="field">
        <select
          name={getRawFieldValue(fields.selectName)}
          value={this.state.value}
          onChange={this.handleChange}
        >
          <option value="" disabled>
            <Text field={fields.selectTitle} />
          </option>
          {fields.options.map((option, index) => (
            <option
              key={index}
              value={getRawFieldValue(option.fields.Name)}
            >
              <Text field={option.fields.Name} />
            </option>
          ))}
        </select>
      </div>
    );
  }
}

export default SelectFormField;
