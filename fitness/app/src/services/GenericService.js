import axios from "axios";
import { setupCache } from "axios-cache-adapter";
/* eslint-disable-next-line import/no-extraneous-dependencies */
import qs from "qs";
import config from "../temp/config";

const apiStem = `/sitecore/api/lighthousefitness`;

const cache = setupCache({
  maxAge: 15 * 60 * 1000,
  key: req => req.url + JSON.stringify(req.params),
  exclude: { query: false }
});

const api = axios.create({
  adapter: cache.adapter
});

export async function clearCache() {
  await cache.store.clear();
  console.log("memory cache cleared");
}

export function getActionUrl(action) {
  return `${config.sitecoreApiHost}${apiStem}${action}?sc_apikey=${
    config.sitecoreApiKey
  }`;
}

export function post(action, payload) {
  const url = getActionUrl(action);

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

export function get(action, payload, useCache = false) {
  const url = getActionUrl(action);

  const options = {
    method: "GET",
    params: payload,
    withCredentials: true,
    url
  };

  return useCache ? api(options) : axios(options);
}

export function boxeverPost(action, payload) {
  const url = `${config.boxeverApiHost}/Boxever${action}`;

  const options = {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    data: payload,
    withCredentials: false,
    url
  };

  return axios(options);
}

export function boxeverGet(action, payload) {
  const url = `${config.boxeverApiHost}/Boxever${action}`;

  const options = {
    method: "GET",
    params: payload,
    withCredentials: false,
    url
  };

  return axios(options);
}

export function boxeverDelete(action, payload) {
  const url = `${config.boxeverApiHost}/Boxever${action}`;

  const options = {
    method: "DELETE",
    headers: {
      "content-type": "application/json"
    },
    data: payload,
    withCredentials: false,
    url
  };

  return axios(options);
}