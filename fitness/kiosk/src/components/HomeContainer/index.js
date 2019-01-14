import React from "react";
import { Placeholder } from "@sitecore-jss/sitecore-jss-react";
import withScrollToTop from "../../hoc/withScrollToTop";
import { translate } from "react-i18next";

const HomeContainer = props => <Placeholder name="hf-home" {...props} />;

export default withScrollToTop(translate()(HomeContainer));
