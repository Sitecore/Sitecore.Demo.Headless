import React from "react";
import { Text } from "@sitecore-jss/sitecore-jss-react";

const EventLabel = ({ icon, fieldName, fieldValue, className }) => {
  if (fieldValue) {
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
