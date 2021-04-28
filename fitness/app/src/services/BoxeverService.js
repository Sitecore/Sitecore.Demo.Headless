import { required } from "../utils";

function createBaseEvent() {
  return {
    "browser_id": window.Boxever.getID(), // For eventCreate calls
    "browserId": window.Boxever.getID(), // For callFlows calls
    "channel": "WEB",
    "language": "EN",
    "currency": "CAD",
    "pos": "fitness-kiosk.com",
    "page": window.location.pathname + window.location.search,
  };
}

function sendEventCreate(event) {
  if (window === undefined) {
    return new Promise(function (resolve) { resolve(); });
  }

  return new Promise(function (resolve, reject) {
    try {
      window.Boxever.eventCreate(
        event,
        function (response) {
          if (!response) {
            reject("No response provided.");
          }
          if (response.status !== "OK") {
            reject("Response status: " + response.status);
          }
          resolve(response);
        },
        'json'
      );
    } catch (err) {
      reject(err);
    }
  });
}

function callFlows(request) {
  if (window === undefined) {
    return new Promise(function (resolve) { resolve(); });
  }

  return new Promise(function (resolve, reject) {
    try {
      window.Boxever.callFlows(
        request,
        function (response) {
          if (!response) {
            reject("No response provided.");
          }
          resolve(response);
        },
        'json'
      );
    } catch (err) {
      reject(err);
    }
  });
}

// Boxever view page tracking
export function logViewEvent(
  routeData = required()
) {
  var viewEvent = createBaseEvent();
  viewEvent.type = "VIEW";
  viewEvent.sitecoreTemplateName = routeData.sitecore.route.templateName;

  if (routeData.sitecore.route.templateName === "event-page") {
    viewEvent.event_name = routeData.sitecore.route.displayName;
    viewEvent.event_date = routeData.sitecore.route.fields["date"].value;
    viewEvent.event_lat = routeData.sitecore.route.fields["latitude"].value;
    viewEvent.event_long = routeData.sitecore.route.fields["longitude"].value;
    viewEvent.event_participants = routeData.sitecore.route.fields["numberOfParticipants"].value;
    viewEvent.event_length = routeData.sitecore.route.fields["length"].value;
    viewEvent.event_sportType = routeData.sitecore.route.fields["sportType"].value;
  }

  return sendEventCreate(viewEvent);
}

// Boxever identification
export function identifyVisitor(
  firstname = required(),
  lastname = required(),
  email = required()
) {
  var identifyEvent = createBaseEvent();
  identifyEvent.type = "IDENTITY";
  identifyEvent.firstname = firstname;
  identifyEvent.lastname = lastname;
  identifyEvent.email = email;

  return sendEventCreate(identifyEvent);
}

// Boxever custom set app settings event
export function setAppSettings() {
  var appSettingsEvent = createBaseEvent();
  appSettingsEvent.type = "SET_APP_SETTINGS";
  // Returns either https://app.lighthouse.localhost, https://instance-name-app.sitecoredemo.com, or http://localhost:3000
  appSettingsEvent.appBaseUrl = window.location.origin.replace("kiosk.", "app.");

  return sendEventCreate(appSettingsEvent);
}

// Boxever custom complete registration event
export function trackRegistration(
  eventId = required(),
  eventName = required(),
  eventDate = required(),
  eventUrlPath = required(),
  sportType = required()
) {
  return setAppSettings().then(() => {
    var registrationEvent = createBaseEvent();
    registrationEvent.type = "COMPLETE_REGISTRATION";
    registrationEvent.event_id = eventId;
    registrationEvent.event_name = eventName;
    registrationEvent.event_date = eventDate;
    registrationEvent.event_urlPath = eventUrlPath;
    registrationEvent.event_sportType = sportType;

    return sendEventCreate(registrationEvent);
  });
}

// Boxever custom favorited event
export function trackEventFavorite(
  eventId = required()
) {
  var favoriteEvent = createBaseEvent();
  favoriteEvent.type = "EVENT_FAVORITED";
  favoriteEvent.event_id = eventId;

  return sendEventCreate(favoriteEvent);
}

// Boxever custom unfavorite event
export function trackEventUnfavorite(
  eventId = required()
) {
  var unfavoriteEvent = createBaseEvent();
  unfavoriteEvent.type = "EVENT_UNFAVORITED";
  unfavoriteEvent.event_id = eventId;

  return sendEventCreate(unfavoriteEvent);
}

// Boxever identification from an email address
export function identifyByEmail(
  email = required()
) {
  window._boxeverq.push(function() {
    var identifyEvent = createBaseEvent();
    identifyEvent.type = "IDENTITY";
    identifyEvent.email = email;

    sendEventCreate(identifyEvent);
  });
}

// Flush Boxever local storage for current guest and starts a new anonymous visitor session
export function forgetCurrentGuest() {
  if (window === undefined) {
    return new Promise(function (resolve) { resolve(); });
  }

  return new Promise(function (resolve) {
    window.Boxever.reset();
    resolve();
  });
}

// Boxever get Guest Ref
export function getGuestRef() {
  if (window === undefined) {
    return new Promise(function (resolve) { resolve(); });
  }
  var getGuestRefRequest = createBaseEvent();

  getGuestRefRequest.clientKey = window._boxever_settings.client_key;
  getGuestRefRequest.friendlyId = "getguestref";

  return callFlows(getGuestRefRequest);
}

// Boxever get personalized events FullStack Interactive Experience with Decision Model
export function getPersonalizedEvents(eventsApiUrl, filteredSportsPayload) {
  if (window === undefined) {
    return new Promise(function (resolve) { resolve(); });
  }

  var personalizedEventsRequest = createBaseEvent();
  personalizedEventsRequest.clientKey = window._boxever_settings.client_key;
  personalizedEventsRequest.friendlyId = "getpersonalizedevents";
  personalizedEventsRequest.params = {
    url: eventsApiUrl,
    payload: filteredSportsPayload
  };

  return callFlows(personalizedEventsRequest);
}
