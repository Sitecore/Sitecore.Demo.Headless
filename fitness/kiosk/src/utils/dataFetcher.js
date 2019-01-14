import axios from "axios";

export function dataFetcher(url, data) {
  return axios({
    url,
    method: data ? 'POST' : 'GET',
    data,
    withCredentials: true,
  });
}