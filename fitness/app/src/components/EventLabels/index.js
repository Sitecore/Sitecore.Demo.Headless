import React from "react";
import { Text } from "@sitecore-jss/sitecore-jss-react";

const EventLabel = ({ label, className }) => {
  let fields = label.fields;
  // TODO: workaround for a serialization issue in connected
  if (fields.fields) {
    fields = label.fields.fields;
  }

  const labelImage = fields.image && fields.image.value ? fields.image.value.src : '';
  return (
    <p className={`${className}`}>
      <img
        className="event-icon"
        src={labelImage}
        alt={fields.value}
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
