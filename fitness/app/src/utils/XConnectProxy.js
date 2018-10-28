import axios from "axios";
import qs from "qs";
import config from "../temp/config";

function post(actionName, payload) {
  const url = `${
    config.sitecoreApiHost
  }/sitecore/api/habitatfitness/${actionName}?sc_apikey=${
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

export function setSportsPreferences() {
  if (typeof localStorage !== "undefined") {
    const sports = localStorage.getItem("sports");

    if (!sports) {
      throw new Error("No sports data found");
    }

    const sportsRatings = JSON.parse(sports);
    const payload = {
      Ratings: sportsRatings
    };

    return post("sportratings", payload);
  }
}

export function setDemographicsPreferences() {
  if (typeof localStorage !== "undefined") {
    const age = localStorage.getItem("age");
    const gender = localStorage.getItem("gender");

    if (!age || !gender) {
      throw new Error("No demographics data found");
    }

    const payload = {
      AgeGroup: age,
      Gender: gender
    };

    return post("demographics", payload);
  }
}

export function addToFavorites(eventId) {
  if (!eventId) {
    throw new Error("event id is not specified");
  }
  return post("favorites", { EventId: eventId });
}

export function register(eventId) {
  if (!eventId) {
    throw new Error("event id is not specified");
  }
  return post("register", { EventId: eventId });
}

export function setIdentifiers() {
  if (typeof localStorage !== "undefined") {
    const firstname = localStorage.getItem("firstname");
    const lastname = localStorage.getItem("lastname");
    const email = localStorage.getItem("email");

    if (!email) {
      throw new Error("No identification data found");
    }

    const payload = {
      Email: email,
      FirstName: firstname,
      LastName: lastname
    };

    return post("identifiers", payload);
  }
}

// TODO: disable in prod
export function flush() {
  return post("flush", {});
}
