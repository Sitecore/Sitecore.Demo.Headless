import React from "react";
import GoogleMapReact from "google-map-react";

const EventOverlay = ({ text }) => <div className="event-map-overlay">{text}</div>;

// TODO: move API key to config
const EventMap = ({ eventName, zoom, latitude, longitude }) => {

  const lat = parseFloat(latitude.value);
  const lng = parseFloat(longitude.value);
  const defaultCenter = {
    lat: lat,
    lng: lng
  };

  return (
    <div className="eventDetail-map" style={{ height: "300px", width: "100%" }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: "AIzaSyByGj2X2KrpmqTaZXKS4HH6FEYayQkJQ64" }}
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
