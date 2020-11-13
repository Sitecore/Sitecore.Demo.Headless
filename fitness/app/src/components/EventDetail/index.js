import React from "react";
import { Image, Text } from "@sitecore-jss/sitecore-jss-react";
import { withTranslation } from "react-i18next";
import EventMap from "../EventMap";
import EventLabels from "../EventLabels";
import withScrollToTop from "../../hoc/withScrollToTop";

const EventDetail = ({ context, t, fields, routeData, date, cta, icon, description }) => {
  const routeFields = routeData.fields;
  const eventName = routeData.name.value;
  return (
    <div className="eventDetail">
      <div className="eventDetail-image-container">
        <div className="eventDetail-image">
          <Image
            field={routeFields.image}
            srcSet={[{ mw: 650 }, { mw: 350 }]}
            sizes="(min-width: 960px) 650px, 350px"
            style={null}
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
            {date}
            {cta}
          </div>
          <div className="eventDetail-image-overlay-metas">
            <EventLabels
              labels={routeFields.labels}
              className="eventDetail-image-overlay-meta eventDetail-image-overlay-meta_type"
            />
          </div>
          <div className="eventDetail-image-overlay-badges">
            {icon}
          </div>
        </div>
      </div>
      <div className="eventDetail-content">
        <div className="eventDetail-description">{description}</div>
        <EventMap {...routeFields} eventName={eventName} />
      </div>
    </div>
  );
};

export default withScrollToTop(withTranslation()(EventDetail));
