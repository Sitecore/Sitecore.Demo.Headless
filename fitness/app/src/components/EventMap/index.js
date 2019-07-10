import React from "react";
import GoogleMapReact from "google-map-react";

const EventOverlay = ({ text }) => <div className="event-map-overlay">{text}</div>;

const EventMap = ({ eventName, zoom, latitude, longitude }) => {

  const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
  if(!apiKey){
    console.error("GOOGLE_API_KEY is missing. Please add it to environment variables. More in documentation: https://github.com/Sitecore/Sitecore.HabitatHome.Omni/blob/master/docs/configuration/installation.md");
  }

  const lat = parseFloat(latitude.value);
  const lng = parseFloat(longitude.value);
  const defaultCenter = {
    lat: lat,
    lng: lng
  };

  return (
    <div className="eventDetail-map" style={{ height: "300px", width: "100%" }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: apiKey }}
        defaultZoom={zoom}
        defaultCenter={defaultCenter}
      >
        <EventOverlay
          lat={lat}
          lng={lng}
          text={eventName}
        />
      </GoogleMapReact>
    </div>
  );
};

EventMap.defaultProps = {
  zoom: 11
};

export default EventMap;
