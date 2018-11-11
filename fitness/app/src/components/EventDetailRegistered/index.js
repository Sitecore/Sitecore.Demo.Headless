import React, { Fragment } from "react";
import { RichText } from "@sitecore-jss/sitecore-jss-react";
import dayjs from "dayjs";
import { translate } from "react-i18next";
import EventDetail from "../EventDetail";
import EventSubscribeButton from "../EventSubscribeButton";

const EventDetailRegistered = props => {
  const { t, fields, routeData } = props;
  const routeFields = routeData.fields;

  const eventDate = dayjs(routeFields.date.value);
  const days = eventDate.diff(dayjs(Date()), "days");
  const hours = eventDate.diff(dayjs(Date()), "hours") - days * 24;

  const dayLabel = days > 1 ? t("days") : t("day");
  const hourLabel = hours > 1 ? t("hours") : t("hour");
  const countdown = `${days} ${dayLabel} ${hours} ${hourLabel}`;

  const date = (
    <Fragment>
      {t("countdown")}
      <h3>{countdown}</h3>
    </Fragment>
  );

  const description = <RichText field={routeFields.longDescription} tag="p" />;

  const lat = parseFloat(routeFields.latitude.value);
  const lng = parseFloat(routeFields.longitude.value);
  const directionsLink = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  const cta = (
    <a
      href={directionsLink}
      target="_new"
      className="btn btn-primary"
      style={{ marginTop: 0 }}
    >
      {fields.ctaText.value}
    </a>
  );

  return (
    <EventDetail
      {...props}
      date={date}
      description={description}
      cta={cta}
      icon={<EventSubscribeButton {...props} />}
    />
  );
};

export default translate()(EventDetailRegistered);
