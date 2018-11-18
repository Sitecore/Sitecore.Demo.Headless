import axios from "axios";
import qs from "qs";
import config from "../temp/config";

const apiStem = `/sitecore/api/habitatfitness`;

export function post(action, payload) {
  const url = `${config.sitecoreApiHost}${apiStem}${action}?sc_apikey=${
    config.sitecoreApiKey
  }`;

  const options = {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded"
    },
    data: qs.stringify(payload),
    withCredentials: true,
    url
  };

  return axios(options);
}

export function get(action, payload) {
  const url = `${config.sitecoreApiHost}${apiStem}${action}?sc_apikey=${
    config.sitecoreApiKey
  }`;

  const options = {
    method: "GET",
    params: payload,
    withCredentials: true,
    url
  };

  return axios(options);
}