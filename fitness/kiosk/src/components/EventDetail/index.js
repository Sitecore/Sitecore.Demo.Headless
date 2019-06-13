import React from "react";
import {
  Image,
  Text,
  RichText,
  DateField
} from "@sitecore-jss/sitecore-jss-react";
import { translate } from "react-i18next";
import { NavLink } from "react-router-dom";
import dayjs from "dayjs";
import EventMap from "../EventMap";
import EventLabels from "../EventLabels";

const EventDetail = ({ t, routeData }) => {
  const routeFields = routeData.fields;
  const eventName = routeData.name.value;
  return (
    <div className="eventDetail">
      <div className="eventDetail-image-container">
        <div className="eventDetail-image">
          <Image
            field={routeFields.image}
            style={null}
            srcSet={[{ mw: 650 }, { mw: 350 }]}
            sizes="(min-width: 960px) 650px, 350px"
            width={null}
            height={null}
          />
        </div>
        <div className="eventDetail-image-overlay">
          <div className="eventDetail-image-overlay-content">
            <Text
              field={routeFields.name}
              tag="h1"
              className="eventDetail-title"
            />
            <DateField
              field={routeFields.date}
              tag="p"
              className="eventDetail-date"
              render={date => dayjs(date).format("MMM D YYYY")}
            />
            <NavLink to={"/register"} className="btn btn-primary">
              {t("register")}
            </NavLink>
          </div>
          <div className="eventDetail-image-overlay-metas">
            <EventLabels
              labels={routeFields.labels}
              className="eventDetail-image-overlay-meta eventDetail-image-overlay-meta_type"
            />
          </div>
        </div>
      </div>
      <div className="eventDetail-content">
        <div className="eventDetail-description">
          <RichText field={routeFields.description} tag="p" />
        </div>
        <EventMap {...routeFields} eventName={eventName} />
      </div>
    </div>
  );
};

export default translate()(EventDetail);
