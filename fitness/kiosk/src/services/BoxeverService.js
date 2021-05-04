import { boxeverGet } from "./GenericService";
import { required } from "../utils";

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
      "channel": "KIOSK",
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

function delayUntilBrowserIdIsAvailable(functionToDelay) {
  if (window.Boxever.getID() === "anonymous") {
    const timeToWaitInMilliseconds = 100;
    console.log(`Boxever browserId is not yet available. Waiting ${timeToWaitInMilliseconds}ms before retrying.`);
    window.setTimeout(delayUntilBrowserIdIsAvailable, timeToWaitInMilliseconds, functionToDelay);
  } else {
    functionToDelay();
  }
}

function sendEventCreate(eventConfig) {
  if (window === undefined) {
    return new Promise(function (resolve) { resolve(); });
  }

  // Set the page now as the location might have already changed when createEventPayload will be executed.
  const eventWithCurrentPage = getConfigWithCurrentPage(eventConfig);

  return new Promise(function (resolve, reject) {
    try {
      window._boxeverq.push(function() {
        delayUntilBrowserIdIsAvailable(function() {
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
  if (window === undefined) {
    return new Promise(function (resolve) { resolve(); });
  }

  // Set the page now as the location might have already changed when createFlowPayload will be executed.
  const eventWithCurrentPage = getConfigWithCurrentPage(flowConfig);

  return new Promise(function (resolve, reject) {
    try {
      window._boxeverq.push(function() {
        delayUntilBrowserIdIsAvailable(function() {
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
  sportType = required()
) {
  return setAppSettings()
  .then(() => sendEventCreate({
    type: "COMPLETE_REGISTRATION",
    event_id: eventId,
    event_name: eventName,
    event_date: eventDate,
    event_urlPath: eventUrlPath,
    event_sportType: sportType
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
  if (window === undefined) {
    return new Promise(function (resolve) { resolve(); });
  }

  return new Promise(function (resolve, reject) {
    try {
      window._boxeverq.push(function() {
        window.Boxever.browserCreate(
          {},
          function (response) {
            if (!response) {
              reject("No response provided.");
            }
            // Set the browser guest ref
            window.Boxever.browser_id = response.ref;
            resolve();
          },
          'json'
        );
      });
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
  return getGuestProfileResponse(guestRef)
  .then(guestResponse => isAnonymousGuestInGuestResponse(guestResponse));
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
  return getGuestProfileResponse(guestRef)
  .then(guestResponse => getGuestFullNameInGuestResponse(guestResponse));
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
  return getRegisteredEventsResponse(guestRef)
  .then(guestResponse => isRegisteredToEventInGuestResponse(eventId, guestResponse));
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
  return getFavoritedEventsResponse(guestRef)
  .then(guestResponse => isEventFavoritedInGuestResponse(eventId, guestResponse));
}
