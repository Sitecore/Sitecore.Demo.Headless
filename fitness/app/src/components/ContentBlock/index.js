import React from "react";
import { Text, RichText } from "@sitecore-jss/sitecore-jss-react";

const ContentBlock = ({ fields }) => (
  <React.Fragment>
    <Text tag="h2" className="display-4" field={fields.heading} />
    <RichText className="contentDescription" field={fields.content} />
  </React.Fragment>
);

export default ContentBlock;