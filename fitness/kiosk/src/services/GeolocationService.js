import { canUseDOM, required } from "../utils";
import axios from "axios";

const defaultLocation = "San Franciso, CA";

export function getLatitude() {
  const defaultLat = 37.773972;
  return canUseDOM ? Number.parseFloat(localStorage.getItem("lat") ? localStorage.getItem("lat") : `${defaultLat}`) : defaultLat;
}

export function getLongitude() {
  const defaultLng = -122.431297;
  return canUseDOM ? Number.parseFloat(localStorage.getItem("lng") ? localStorage.getItem("lng") : `${defaultLng}`) : defaultLng;
}

export function updateGeoLocation(locationData) {
  if(canUseDOM){
    const {lat, lng, location} = locationData;
    localStorage.setItem("lat", lat); 
    localStorage.setItem("lng", lng);
    localStorage.setItem("location", location);
  }
}

export function getCurrentLocation() {
  if(canUseDOM){
    return localStorage.getItem("location") ? localStorage.getItem("location") : defaultLocation;
  }
  return defaultLocation;
}

export function getCurrentCoordinates() {
  if(canUseDOM){
    return {
      lat: localStorage.getItem("lat"),
      lng: localStorage.getItem("lng")
    }
  }
  return {};
}

export function findLocationByAddress(address = required()) {
  const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
  if (!apiKey) {
    return Promise.reject(
      "GOOGLE_API_KEY is missing. Please add it to environment variables. More in readme: https://github.com/Sitecore/Sitecore.HabitatHome.Omni/blob/master/fitness/app/README.md"
    );
  }

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}`;
  const options = {
    method: "GET",
    url
  };

  return axios(options);
}


export function findLocationByLatLng(lat = required(), lng = required()) {
  const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
  if (!apiKey) {
    return Promise.reject(
      "GOOGLE_API_KEY is missing. Please add it to environment variables. More in readme: https://github.com/Sitecore/Sitecore.HabitatHome.Omni/blob/master/fitness/app/README.md"
    );
  }

  const latlng = `${lat},${lng}`;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latlng}&key=${apiKey}`;
  const options = {
    method: "GET",
    url
  };

  return axios(options);
}

