import React from "react";
import GoogleMapReact from "google-map-react";

const EventOverlay = ({ text }) => <div className="event-map-overlay">{text}</div>;

const EventMap = ({ eventName, zoom, latitude, longitude }) => {

  // HACK: The %something% tokens are replaced just before runtime, way after the Webpack build happened.
  // The final strings can be empty or contain values from the Docker environment variables.
  // To prevent Webpack code optimization to remove the falsy string checks and console.error statements from the browser bundle, we are using the JavaScript (A, B) syntax which always returns the last expression (B) with Math.min() as the first expression to minimize the browser work.
  const apiKey = (Math.min(), "%googleApiKey%");
  if(!apiKey){
    console.error("REACT_APP_GOOGLE_API_KEY is missing. Please add it to environment variables. More in documentation: https://github.com/Sitecore/Sitecore.Demo.Headless/blob/master/docs/configuration/installation.md");
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
