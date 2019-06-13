import React from "react";
import {
  Image,
  Text,
  RichText,
  DateField
} from "@sitecore-jss/sitecore-jss-react";
import dayjs from "dayjs";
import { NavLink } from "react-router-dom";
import { translate } from "react-i18next";
import EventLabels from "../EventLabels";

const EventListItem = ({
  fields,
  url,
  label,
  featured,
  showDescription,
  showMetatags,
  badge
}) => {
  return (
    <div className={`events-item ${featured ? "events-item_featured" : ""}`}>
      <div className="events-item-image-container">
        <div className="events-item-image">
          <NavLink to={`${url}`}>
            <Image
              field={fields.image}
              srcSet={[{ mw: 650 }, { mw: 350 }]}
              sizes="(min-width: 960px) 650px, 350px"
              style={null}
              width={null}
              height={null}
            />
          </NavLink>
        </div>
        {showMetatags && (
          <div className="events-item-image-overlay">
            <div className="events-item-image-overlay-content">
              <div className="events-item-metas">
                {featured && (
                  <Text
                    field={label}
                    tag="p"
                    className="events-item-meta events-item-meta_recommended"
                  />
                )}
                <EventLabels
                  labels={fields.labels}
                  className="events-item-meta events-item-meta_type"
                />
              </div>
            </div>
          </div>
        )}
        <div className="eventDetail-image-overlay-badges">{badge}</div>
      </div>
      <div className="events-item-content">
        <div className="events-item-content-inner">
          <NavLink to={`${url}`} className="events-item-name-link">
            <Text field={fields.name} tag="h5" className="events-item-name" />
          </NavLink>
          <DateField
            field={fields.date}
            tag="p"
            className="events-item-date"
            render={date => dayjs(date).format("MMM D YYYY")}
          />
          {showDescription && (
            <RichText
              field={fields.description}
              tag="p"
              className="events-item-name-description"
            />
          )}
        </div>
      </div>
    </div>
  );
};

EventListItem.defaultProps = {
  fields: {},
  showDescription: true,
  showMetatags: true
};

export default translate()(EventListItem);
