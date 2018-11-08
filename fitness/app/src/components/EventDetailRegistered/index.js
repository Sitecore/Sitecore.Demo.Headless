import React, { Component, Fragment } from "react";
import { RichText } from "@sitecore-jss/sitecore-jss-react";
import dayjs from "dayjs";
import { translate } from "react-i18next";
import { promptToReceiveNotifications } from "../../utils";
import EventDetail from "../EventDetail";

class EventDetailRegistered extends Component {
  state = {
    subscribed: false
  };

  constructor(props){
    super(props);
    this.onSubscribeClick = this.onSubscribeClick.bind(this);
  }

  onSubscribeClick() {
    this.setState({ subscribed: true });
    promptToReceiveNotifications();
  }

  render() {
    const { t, fields, routeData } = this.props;
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

    const description = (
      <RichText field={routeFields.longDescription} tag="p" />
    );

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

    const icon = (
      <div
        className="event-action event-action-subscribe"
        onClick={this.onSubscribeClick}
      />
    );

    return (
      <EventDetail
        {...this.props}
        date={date}
        description={description}
        cta={cta}
        icon={icon}
      />
    );
  }
}

export default translate()(EventDetailRegistered);
