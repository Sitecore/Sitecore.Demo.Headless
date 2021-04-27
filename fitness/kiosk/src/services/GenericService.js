import axios from "axios";
import { setupCache } from "axios-cache-adapter";
/* eslint-disable-next-line import/no-extraneous-dependencies */
import qs from "qs";
import config from "../temp/config";

const apiStem = `/sitecore/api/lighthousefitness`;

const cache = setupCache({
  maxAge: 15 * 60 * 1000,
  exclude: { query: false },
});

const api = axios.create({
  adapter: cache.adapter
});

export async function clearCache() {
  await cache.store.clear();
  console.log("memory cache cleared");
}

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

export function get(action, payload, useCache = false) {
  const url = `${config.sitecoreApiHost}${apiStem}${action}?sc_apikey=${
    config.sitecoreApiKey
  }`;

  const options = {
    method: "GET",
    params: payload,
    withCredentials: true,
    url
  };

  return useCache ? api(options) : axios(options);
}


export function boxeverPost(action, payload) {
  const url = `${config.boxeverApiHost}/Boxever${action}&sc_apikey={EBF6D5C1-EB80-4B15-91AB-DD3845797774}`;

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

export function boxeverGet(action, payload, useCache = false) {
  const url = `${config.boxeverApiHost}/Boxever${action}?sc_apikey={EBF6D5C1-EB80-4B15-91AB-DD3845797774}`;

  const options = {
    method: "GET",
    params: payload,
    withCredentials: false,
    url
  };

  return useCache ? api(options) : axios(options);
}

export function boxeverDelete(action, payload, useCache = false) {
  const url = `${config.boxeverApiHost}/Boxever${action}&sc_apikey={EBF6D5C1-EB80-4B15-91AB-DD3845797774}`;

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