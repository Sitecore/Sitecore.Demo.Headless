import React from "react";
import { Image, Text } from "@sitecore-jss/sitecore-jss-react";
import { withTranslation } from "react-i18next";
import EventMap from "../EventMap";
import EventLabel from "../EventLabel";
import withScrollToTop from "../../hoc/withScrollToTop";
import OcProductList from "../../ordercloud/components/OcProductList";
import {getMasterImageUrl} from "../ProductDetail";
import { Link } from "react-router-dom";
import { isOrderCloudConfigured } from "../../services/OrderCloudService";

import length from '../../assets/icons/length.svg';
import sportType from '../../assets/icons/sportType.svg';
import numberOfParticipants from '../../assets/icons/numberOfParticipants.svg';

const getListImage = (p) => {
  return `${getMasterImageUrl(p)}&t=w400`
}

const EventDetail = ({ routeData, date, cta, icon, description }) => {
  const routeFields = routeData.fields;
  const eventName = routeData.name.value;

  const relatedProducts = !isOrderCloudConfigured() ? null : (
    <div className="eventDetail-products">
      <OcProductList options={{pageSize:4, categoryID: routeFields.sportType.value}} columns={{xs:2}} imgSrcMap={getListImage} hrefMap={p => `/products/${p.ID}`}/>
      <Link className="btn btn-secondary" to={`/shop/${routeFields.sportType.value}`}>{`Shop All ${routeFields.sportType.value} Products`}</Link>
    </div>
  );

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
            <EventLabel
              icon={length}
              fieldName="length"
              fieldValue={routeFields.length}
              className="col events-item-meta events-item-meta_type text-center"
            />
            <EventLabel
              icon={sportType}
              fieldName="sportType"
              fieldValue={routeFields.sportType}
              className="col events-item-meta events-item-meta_type text-center"
            />
            <EventLabel
              icon={numberOfParticipants}
              fieldName="numberOfParticipants"
              fieldValue={routeFields.numberOfParticipants}
              className="col events-item-meta events-item-meta_type text-center"
            />
          </div>
          <div className="eventDetail-image-overlay-badges">
            {icon}
          </div>
        </div>
      </div>
      <div className="eventDetail-content">
      <Text field={routeFields.description} tag="div" encode={false} className="eventDetail-description" />
      <EventMap {...routeFields} eventName={eventName} />
      </div>
      {relatedProducts}
    </div>
  );
};

export default withScrollToTop(withTranslation()(EventDetail));
