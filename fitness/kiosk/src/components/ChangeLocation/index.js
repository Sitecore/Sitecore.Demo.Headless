import React from "react";
import { translate } from "react-i18next";
import { Text } from "@sitecore-jss/sitecore-jss-react";
import GoogleMapReact from "google-map-react";

const lat = 37.773972;
const lng = -122.431297;

const ChangeLocation = ({ zoom, t }) => {
  const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
  if (!apiKey) {
    console.error(
      "GOOGLE_API_KEY is missing. Please add it to environment variables. More in readme: https://github.com/Sitecore/Sitecore.HabitatHome.Omni/blob/master/fitness/app/README.md"
    );
  }

  const defaultCenter = {
    lat: lat,
    lng: lng
  };

  return (
    <div className="changeLocation">
      <div className="changeLocation-search">
        <input type="text" placeholder="Enter Zip Code" />
        <button className="btn btn-primary">{t("go")}</button>
      </div>

      <div className="changeLocation-map">
        <div className="map">
          <GoogleMapReact
            bootstrapURLKeys={{ key: apiKey }}
            defaultZoom={zoom}
            defaultCenter={defaultCenter}
          />
        </div>
        <a href="#" className="btn btn-primary btn-action">
          {t("choose-location")}
        </a>
      </div>
    </div>
  );
};

ChangeLocation.defaultProps = {
  zoom: 11
};

export default translate()(ChangeLocation);
