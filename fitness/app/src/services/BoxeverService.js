import { boxeverGet } from "./GenericService";
import { required } from "../utils";

export function isBoxeverConfigured() {
  return !!(
    typeof window !== "undefined" &&
    window._boxever_settings &&
    window._boxever_settings.client_key
  );
}

function getConfigWithCurrentPage(config) {
  return Object.assign(
    {
      "page": window.location.pathname + window.location.search,
    },
    config
  );
}

function createEventPayload(eventConfig) {
  return Object.assign(
    {
      "browser_id": window.Boxever.getID(), // For eventCreate calls
      "browserId": window.Boxever.getID(), // For callFlows calls
      "channel": "APP",
      "language": "EN",
      "currency": "CAD",
      "pos": "lighthouse-fitness",
    },
    eventConfig
  );
}

function createFlowPayload(flowConfig) {
  return Object.assign(
    createEventPayload(flowConfig),
    {
      clientKey: window._boxever_settings.client_key
    }
  );
}

function delayUntilBoxeverIsReady(functionToDelay) {
  if (window.Boxever && window.Boxever.getID() !== "anonymous" && window._boxeverq) {
    functionToDelay();
  } else {
    const timeToWaitInMilliseconds = 100;
    console.log(`Boxever is not ready yet. Waiting ${timeToWaitInMilliseconds}ms before retrying.`);
    window.setTimeout(delayUntilBoxeverIsReady, timeToWaitInMilliseconds, functionToDelay);
  }
}

function sendEventCreate(eventConfig) {
  if (typeof window === "undefined" || !isBoxeverConfigured()) {
    return new Promise(function (resolve) { resolve(); });
  }

  // Set the page now as the location might have already changed when createEventPayload will be executed.
  const eventWithCurrentPage = getConfigWithCurrentPage(eventConfig);

  return new Promise(function (resolve, reject) {
    try {
      delayUntilBoxeverIsReady(function() {
        window._boxeverq.push(function() {
          window.Boxever.eventCreate(
            // Set the browserId on the event just before sending it to ensure it is up to date.
            createEventPayload(eventWithCurrentPage),
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
        });
      });
    } catch (err) {
      reject(err);
    }
  });
}

function callFlows(flowConfig) {
  if (typeof window === "undefined" || !isBoxeverConfigured()) {
    return new Promise(function (resolve) { resolve(); });
  }

  // Set the page now as the location might have already changed when createFlowPayload will be executed.
  const eventWithCurrentPage = getConfigWithCurrentPage(flowConfig);

  return new Promise(function (resolve, reject) {
    try {
      delayUntilBoxeverIsReady(function() {
        window._boxeverq.push(function() {
          window.Boxever.callFlows(
            // Set the browserId on the flow just before sending it to ensure it is up to date.
            createFlowPayload(eventWithCurrentPage),
            function (response) {
              if (!response) {
                reject("No response provided.");
              }
              resolve(response);
            },
            'json'
          );
        });
      });
    } catch (err) {
      reject(err);
    }
  });
}

// Boxever view page tracking
export function logViewEvent(
  routeData = required()
) {
  var eventConfig = {
    type: "VIEW",
    sitecoreTemplateName: routeData.sitecore.route.templateName
  };
  if (routeData.sitecore.route.templateName === "event-page") {
    eventConfig = Object.assign(
      eventConfig,
      {
        event_name: routeData.sitecore.route.displayName,
        event_date: routeData.sitecore.route.fields["date"].value,
        event_lat: routeData.sitecore.route.fields["latitude"].value,
        event_long: routeData.sitecore.route.fields["longitude"].value,
        event_participants: routeData.sitecore.route.fields["numberOfParticipants"].value,
        event_length: routeData.sitecore.route.fields["length"].value,
        event_sportType: routeData.sitecore.route.fields["sportType"].value
      }
    );
  }

  return sendEventCreate(eventConfig);
}

export function logFilterEvent(
  selectedSports = required()
) {
  return sendEventCreate({
    type: "FILTER_SPORT",
    filteredSports: selectedSports
  });
}

// Boxever identification
export function identifyVisitor(
  firstname = required(),
  lastname = required(),
  email = required()
) {
  return sendEventCreate({
    type: "IDENTITY",
    firstname: firstname,
    lastname: lastname,
    email: email
  });
}

// Boxever custom set app settings event
export function setAppSettings() {
  return sendEventCreate({
    type: "SET_APP_SETTINGS",
    // Returns either https://app.lighthouse.localhost, https://instance-name-app.sitecoredemo.com, or http://localhost:3000
    appBaseUrl: window.location.origin.replace("kiosk.", "app.")
  });
}

// Boxever custom complete registration event
export function trackRegistration(
  eventId = required(),
  eventName = required(),
  eventDate = required(),
  eventUrlPath = required(),
  sportType = required(),
  imageUrl = required()
) {
  return setAppSettings()
  .then(() => sendEventCreate({
    type: "COMPLETE_REGISTRATION",
    event_id: eventId,
    event_name: eventName,
    event_date: eventDate,
    event_urlPath: eventUrlPath,
    event_sportType: sportType,
    event_image: imageUrl
  }));
}

// Boxever custom favorited event
export function trackEventFavorite(
  eventId = required(),
  eventName = required(),
  eventDate = required(),
  sportType = required()
) {
  return sendEventCreate({
    type: "EVENT_FAVORITED",
    event_id: eventId,
    event_name: eventName,
    event_date: eventDate,
    event_sportType: sportType
  });
}

// Boxever custom unfavorite event
export function trackEventUnfavorite(
  eventId = required(),
  eventName = required(),
  eventDate = required(),
  sportType = required()
) {
  return sendEventCreate({
    type: "EVENT_UNFAVORITED",
    event_id: eventId,
    event_name: eventName,
    event_date: eventDate,
    event_sportType: sportType
  });
}

// Boxever identification from an email address
export function identifyByEmail(
  email = required()
) {
  return sendEventCreate({
    type: "IDENTITY",
    email: email
  });
}

// Flush Boxever local storage for current guest and starts a new anonymous visitor session
export function forgetCurrentGuest() {
  if (typeof window === "undefined" || !isBoxeverConfigured()) {
    return new Promise(function (resolve) { resolve(); });
  }

  return new Promise(function (resolve, reject) {
    try {
      // Code copied from Boxever library
      window._boxeverq = [];
      if (window.Boxever.storage) {
        window.Boxever.storage.removeItem(window.Boxever.cookie_name);
      }

      window.Boxever.browserCreate(
        {},
        function (data) {
          try {
            if (!data || !data.ref) {
              reject("No response or ref provided.");
            }

            // Code copied from Boxever library to make it into a promise
            window._boxever.browser_id = data.ref;
            // If ITP Version of Safari set storage with storage_ttl
            if (window._boxever.isITPBrowser) {
              window._boxever.storage.setItem(window._boxever.cookie_name, window._boxever.browser_id, {TTL: window._boxever.storage_ttl});
            } else {
              // Set the cookie expiration time to be the current time
              // plus cookie_expires_days
              window._boxever.storage.setItem(window._boxever.cookie_name, window._boxever.browser_id, window._boxever.cookie_expires_days);
            }
            // get the existing _boxeverq array
            var _old_boxeverq = window._boxeverq;
            // create a new _boxeverq object
            window._boxeverq = new window.__boxeverQueue();
            // execute all of the queued up events - apply()
            // turns the array entries into individual arguments
            window._boxeverq.push.apply(window._boxeverq, _old_boxeverq);
            window._boxever.initWebFlowSDK();
            resolve();
          } catch (e) {
            window.BoxeverJERS.errors.push(e);
            reject(e);
          }
        },
        'json'
      );
    } catch (err) {
      reject(err);
    }
  });
}

// Boxever get Guest Ref
export function getGuestRef() {
  return callFlows({
    friendlyId: "getguestref"
  });
}

// Boxever get Session Count
export function getSessionCount() {
  return callFlows({
    friendlyId: "getsessioncount"
  });
}

// Boxever get personalized events FullStack Interactive Experience with Decision Model
export function getPersonalizedEvents(eventsApiUrl, filteredSportsPayload) {
  return callFlows({
    friendlyId: "getpersonalizedevents",
    params: {
      url: eventsApiUrl,
      payload: filteredSportsPayload
    }
  });
}

// ********************************
// Get non-expanded guest profile
// ********************************
function getGuestProfilePromise(
  guestRef = required()
) {
  return boxeverGet(`/getguestByRef?guestRef=${guestRef}`);
}

export function getGuestProfileResponse(guestRef) {
  if (!isBoxeverConfigured()) {
    return new Promise(function (resolve) { resolve(); });
  }

  if (!guestRef) {
    return getGuestRef()
    .then(response => getGuestProfilePromise(response.guestRef));
  } else {
    return getGuestProfilePromise(guestRef);
  }
}

// ********************************
// isAnonymousGuest
// ********************************
export function isAnonymousGuestInGuestResponse(
  guestResponse = required()
) {
  return !guestResponse ||
    !guestResponse.data ||
    !guestResponse.data.email;
}

export function isAnonymousGuest(guestRef) {
  if (!isBoxeverConfigured()) {
    return new Promise(function (resolve) { resolve(true); });
  }

  return getGuestProfileResponse(guestRef)
  .then(guestResponse => isAnonymousGuestInGuestResponse(guestResponse))
  .catch(e => {
    console.log(e);
  });
}

// ********************************
// getGuestFullName
// ********************************
export function getGuestFullNameInGuestResponse(
  guestResponse = required()
) {
  if (!guestResponse || !guestResponse.data || !guestResponse.data.firstName || !guestResponse.data.lastName) {
    return;
  }

  return `${guestResponse.data.firstName} ${guestResponse.data.lastName}`;
}

export function getGuestFullName(guestRef) {
  if (!isBoxeverConfigured()) {
    return new Promise(function (resolve) { resolve(""); });
  }

  return getGuestProfileResponse(guestRef)
  .then(guestResponse => getGuestFullNameInGuestResponse(guestResponse))
  .catch(e => {
    console.log(e);
  });
}

// ********************************
// Get guest profile with expanded registered events
// ********************************
function getRegisteredEventsPromise(
  guestRef = required()
) {
  return boxeverGet(`/getguestdataextensionexpanded?guestRef=${guestRef}&dataExtensionName=RegisteredEvents`);
}

export function getRegisteredEventsResponse(guestRef) {
  if (!isBoxeverConfigured()) {
    return new Promise(function (resolve) { resolve(); });
  }

  if (!guestRef) {
    return getGuestRef()
    .then(response => getRegisteredEventsPromise(response.guestRef));
  } else {
    return getRegisteredEventsPromise(guestRef);
  }
}

// ********************************
// isRegisteredToEvent
// ********************************
export function isRegisteredToEventInGuestResponse(
  eventId = required(),
  guestResponse = required()
) {
  return guestResponse &&
    guestResponse.data &&
    guestResponse.data.extRegisteredEvents &&
    guestResponse.data.extRegisteredEvents.items &&
    guestResponse.data.extRegisteredEvents.items.filter(
      event => event.eventId === eventId
    ).length > 0;
}

export function isRegisteredToEvent(
  eventId = required(),
  guestRef
) {
  if (!isBoxeverConfigured()) {
    return new Promise(function (resolve) { resolve(false); });
  }

  return getRegisteredEventsResponse(guestRef)
  .then(guestResponse => isRegisteredToEventInGuestResponse(eventId, guestResponse))
  .catch(e => {
    console.log(e);
  });
}

// ********************************
// Get guest profile with expanded favorited events
// ********************************
function getFavoritedEventsPromise(
  guestRef = required()
) {
  return boxeverGet(`/getguestdataextensionexpanded?guestRef=${guestRef}&dataExtensionName=FavoritedEvents`);
}

export function getFavoritedEventsResponse(guestRef) {
  if (!isBoxeverConfigured()) {
    return new Promise(function (resolve) { resolve(); });
  }

  if (!guestRef) {
    return getGuestRef()
    .then(response => getFavoritedEventsPromise(response.guestRef));
  } else {
    return getFavoritedEventsPromise(guestRef);
  }
}

// ********************************
// isEventFavorited
// ********************************
export function isEventFavoritedInGuestResponse(
  eventId = required(),
  guestResponse = required()
) {
  return guestResponse &&
    guestResponse.data &&
    guestResponse.data.extFavoritedEvents &&
    guestResponse.data.extFavoritedEvents.items &&
    guestResponse.data.extFavoritedEvents.items.filter(
      event => event.eventId === eventId
    ).length > 0;
}

export function isEventFavorited(
  eventId = required(),
  guestRef
) {
  if (!isBoxeverConfigured()) {
    return new Promise(function (resolve) { resolve(false); });
  }

  return getFavoritedEventsResponse(guestRef)
  .then(guestResponse => isEventFavoritedInGuestResponse(eventId, guestResponse))
  .catch(e => {
    console.log(e);
  });
}