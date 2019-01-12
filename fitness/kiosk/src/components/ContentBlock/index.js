import React, { Fragment } from "react";
import { Text, RichText } from "@sitecore-jss/sitecore-jss-react";

const ContentBlock = ({ fields }) => (
  <Fragment>
    <Text tag="h2" className="display-4" field={fields.heading} />
    <RichText className="contentDescription" field={fields.content} />
  </Fragment>
);

export default ContentBlock;
