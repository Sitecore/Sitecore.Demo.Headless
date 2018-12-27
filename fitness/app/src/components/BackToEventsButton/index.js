import React from "react";
import { Text } from "@sitecore-jss/sitecore-jss-react";
import { NavLink } from "react-router-dom";

const BackToEventsButton = ({ fields }) => (
  <NavLink exact className="btn btn-secondary" to={"/events"}>
    <span className="ico ico-left-text ico-back" />
    <span className="txt">Back</span>
  </NavLink>
);

export default BackToEventsButton;