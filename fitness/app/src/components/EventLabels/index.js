import React from "react";
import { Text } from "@sitecore-jss/sitecore-jss-react";

const EventLabel = ({ label, className }) => {
  let fields = label.fields;
  // TODO: workaround for a serialization issue in connected
  if (fields.fields) {
    fields = label.fields.fields;
  }
  return (
    <p className={`${className}`}>
      <img
        style={{
          backgroundImage: `url(${label.fields.image.value.src})`,
          backgroundSize: "15px 15px",
          marginRight: "5px",
          width: "15px",
          height: "15px",
        }}
      />
      <Text field={fields.value} />
    </p>
  );
};

const EventLabels = ({ labels, className }) => {
  return labels.map((label, index) => (
    <EventLabel key={index} label={label} className={className} />
  ));
};

EventLabels.defaultProps = {
  labels: []
};

export default EventLabels;
