import React, { PureComponent } from "react";
import {
  Image,
  Text,
  RichText,
  DateField
} from "@sitecore-jss/sitecore-jss-react";
import dayjs from "dayjs";
import { NavLink } from "react-router-dom";
import { translate } from "react-i18next";
import EventLabel from "../EventLabel";

class EventListItem extends PureComponent {
  render() {
    const { fields, url, label, featured, } = this.props;
    let eventUrl = url;
    if(url.startsWith('/sitecore/content/lighthousefitness/home/events')){
      eventUrl = eventUrl.replace('/sitecore/content/lighthousefitness/home/events', '/events');
    }

    return (
      <div className={`events-item ${featured ? "events-item_featured" : ""}`}>
        <NavLink to={`${eventUrl}`}>
          <div className="events-item-image-container">
            <div className="events-item-image">
              <Image
                field={fields.image}
                style={null}
                srcSet={[{ mw: 650 }, { mw: 350 }]}
                sizes="(min-width: 960px) 650px, 350px"
                width={null}
                height={null}
              />
            </div>
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
                  <EventLabel
                    fieldName="length"
                    fieldValue={fields.length}
                    className="events-item-meta events-item-meta_type text-center"
                  />
                  <EventLabel
                    fieldName="sportType"
                    fieldValue={fields.sportType}
                    className="events-item-meta events-item-meta_type text-center"
                  />
                  <EventLabel
                    fieldName="numberOfParticipants"
                    fieldValue={fields.numberOfParticipants}
                    className="events-item-meta events-item-meta_type text-center"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="events-item-content">
            <div className="events-item-content-inner">
              <Text field={fields.name} tag="h5" className="events-item-name" />
              <DateField
                field={fields.date}
                tag="p"
                className="events-item-date"
                render={date => dayjs(date).format("MMM D YYYY")}
              />
              <RichText
                field={fields.description}
                tag="p"
                className="events-item-name-description"
              />
            </div>
          </div>
        </NavLink>
      </div>
    );
  }
}

EventListItem.defaultProps = {
  fields: {}
};

export default translate()(EventListItem);
