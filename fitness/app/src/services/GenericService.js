import axios from "axios";
import { setupCache } from "axios-cache-adapter";
import qs from "qs";
import config from "../temp/config";

const apiStem = `/sitecore/api/habitatfitness`;

const cache = setupCache({
  maxAge: 15 * 60 * 1000,
  exclude: { query: false },
});

const api = axios.create({
  adapter: cache.adapter
});

export async function clearCache(){
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
