import React, { Component } from "react";
import { getRawFieldValue } from "../../utils";

class InputFormField extends Component {
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
    return (
      <div className="field">
        <input
          type={getRawFieldValue(fields.type, "text")}
          value={this.state.value}
          name={getRawFieldValue(fields.name, "")}
          onChange={this.handleChange}
          id={getRawFieldValue(fields.id, getRawFieldValue(fields.name))}
          required={getRawFieldValue(fields.required, false)}
          placeholder={getRawFieldValue(fields.placeholder, "")}
        />
      </div>
    );
  }
}

export default InputFormField;
