import React from "react";
import { Text } from "@sitecore-jss/sitecore-jss-react";

const EventLabel = ({ icon, fieldName, fieldValue, className }) => {
  if (fieldValue) {
    // When the field value is a number, the following error is displayed
    // in the browser console: "Warning: Failed prop type: Invalid prop
    // `field.value` of type `number` supplied to `Text`, expected `string`."
    // We ensure the field value is a string with this workaround.
    fieldValue.value = fieldValue.value.toString();

    return (
      <p className={`${className}`}>
        <img
          className="event-icon"
          src={icon}
          alt={fieldName}
        />
        <Text field={fieldValue} />
      </p>
    );
  } else {
    return(
      <p></p>
    );
  };
}

export default EventLabel;
