import React from "react";
import { Text } from "@sitecore-jss/sitecore-jss-react";

const EventLabel = ({ label, className }) => {
  let fields = label.fields;
  if (!fields.value || !fields.icon) {
    fields = label.fields.fields;
  }
  return (
    <Text
      field={fields.value}
      tag="p"
      className={`${className} ${fields.icon.value}`}
    />
  );
};

const EventLabels = ({ labels, className }) => {
  return labels.map((label, index) => (
    <EventLabel key={index} label={label} className={className} />
  ));
};

EventLabels.defaultProps = {
  labels: []
}

export default EventLabels;
