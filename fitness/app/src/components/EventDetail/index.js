import React from "react";
import { Image, Text, RichText, DateField } from "@sitecore-jss/sitecore-jss-react";
import { NavLink } from "react-router-dom";
import dayjs from 'dayjs';
import { translate } from "react-i18next";
import { promptToReceiveNotifications } from "../../utils";
import EventMap from "../EventMap";
import EventLabels from '../EventLabels';

const EventDetail = props => {
  const { t, routeData } = props;
  const { fields } = routeData;
  const eventName = fields.name.value;

  return (
    <div className="eventDetail">
      <div className="eventDetail-image-container">
        <div className="eventDetail-image">
          <Image field={fields.image} srcSet={[{ mw: 650 }, { mw: 350 }]} sizes="(min-width: 960px) 650px, 350px" width={null} height={null} />
        </div>
        
        <div className="eventDetail-image-overlay">
          <div className="eventDetail-image-overlay-content">
            <Text field={fields.name} tag="h1" className="eventDetail-title" />
            <DateField field={fields.date} tag="p" className="eventDetail-date" render={(date) => dayjs(date).format('MMM D YYYY')} />
            <NavLink to={`/create-account`} className="btn btn-primary">
              {t("register-to-signup")}
            </NavLink>
          </div>
          <div className="eventDetail-image-overlay-metas">
            <EventLabels labels={fields.labels} className="eventDetail-image-overlay-meta eventDetail-image-overlay-meta_type ico" />
          </div>
          
          <div className="eventDetail-image-overlay-badges">
            {/*
              <button
                onClick={promptToReceiveNotifications}
                className="btn btn-secondary float-right"
                style={{ position: "absolute", top: "0", right: "0" }}
              >
                <img src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCAzMDAgMzAwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAzMDAgMzAwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgd2lkdGg9IjMycHgiIGhlaWdodD0iMzJweCI+CjxnPgoJPGc+CgkJPHBhdGggZD0iTTE0OS45OTYsMEM2Ny4xNTcsMCwwLjAwMSw2Ny4xNjEsMC4wMDEsMTQ5Ljk5N1M2Ny4xNTcsMzAwLDE0OS45OTYsMzAwczE1MC4wMDMtNjcuMTYzLDE1MC4wMDMtMTUwLjAwMyAgICBTMjMyLjgzNSwwLDE0OS45OTYsMHogTTE0OS45OTksMjMyLjk1MWMtMTAuNzY2LDAtMTkuNDk5LTguNzI1LTE5LjQ5OS0xOS40OTloMzguOTk1ICAgIEMxNjkuNDk3LDIyNC4yMjYsMTYwLjc2NSwyMzIuOTUxLDE0OS45OTksMjMyLjk1MXogTTIxNS44ODksMTkzLjloLTAuMDA1di0wLjAwMWMwLDcuMjEtNS44NDMsNy42ODUtMTMuMDQ4LDcuNjg1SDk3LjE2ICAgIGMtNy4yMDgsMC0xMy4wNDYtMC40NzUtMTMuMDQ2LTcuNjg1di0xLjI0MmMwLTUuMTg1LDMuMDQ1LTkuNjI1LDcuNDItMTEuNzMxbDQuMTQyLTM1Ljc1M2MwLTI2LjE3NCwxOC41MS00OC4wMiw0My4xNTItNTMuMTc0ICAgIHYtMTMuODhjMC02LjE3LDUuMDAzLTExLjE3MywxMS4xNzYtMTEuMTczYzYuMTcsMCwxMS4xNzMsNS4wMDMsMTEuMTczLDExLjE3M1Y5MmMyNC42NDIsNS4xNTMsNDMuMTUyLDI2Ljk5Nyw0My4xNTIsNTMuMTc0ICAgIGw0LjE0MiwzNS43NThjNC4zNzUsMi4xMDksNy40MTgsNi41NDEsNy40MTgsMTEuNzI2VjE5My45eiIgZmlsbD0iI0ZGREE0NCIvPgoJPC9nPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=" />
              </button>
            */}
            <button
                onClick={promptToReceiveNotifications}
                className="eventDetail-add-to-favorite"
              >
              favorite
            </button>
          </div>
        </div>
      </div>
      
      <div className="eventDetail-content">
        <div className="eventDetail-description">
          <RichText field={fields.description} tag="p" className="" />
        </div>
        <EventMap {...fields} eventName={eventName} />
      </div>
    </div>
  );
};

export default translate()(EventDetail);
