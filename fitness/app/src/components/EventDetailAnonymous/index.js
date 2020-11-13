import React from "react";
import { RichText, DateField } from "@sitecore-jss/sitecore-jss-react";
import { NavLink } from "react-router-dom";
import dayjs from "dayjs";
import { withTranslation } from "react-i18next";
import EventDetail from "../EventDetail";
import EventFavoriteButton from "../EventFavoriteButton";

const EventDetailAnonymous = (props) => {
  const { fields, routeData } = props;
  const routeFields = routeData.fields;

  const date = (
    <DateField
      field={routeFields.date}
      tag="p"
      className="eventDetail-date"
      render={date => dayjs(date).format("MMM D YYYY")}
    />
  );

  const cta = (
    <NavLink to={fields.ctaLink.value.href} className="btn btn-primary">
      {fields.ctaText.value}
    </NavLink>
  );

  return (
    <EventDetail
      {...props}
      date={date}
      description={<RichText field={routeFields.description} tag="p" />}
      cta={cta}
      icon={<EventFavoriteButton {...props} />}
    />
  );
};

export default withTranslation()(EventDetailAnonymous);
