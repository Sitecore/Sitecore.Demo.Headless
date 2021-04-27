import { get,boxeverPost,boxeverDelete } from "./GenericService";
import { getGuestRef } from "./BoxeverService";

export function addToFavorites(eventId, eventName) {
  getGuestRef().then(response => {
    return boxeverPost(
      "/createguestdataextension?guestRef="+ response.guestRef + "&dataExtensionName=FavoriteEvents",
      {
        "key":eventName + " / " + eventId,
        "eventId":eventId
      }
    );
  }).catch(e => {
    console.log(e);
  });
}

export function removeFromFavorites(eventId, eventName) {
  getGuestRef().then(response => {
    return boxeverDelete(
      "/deletekeyforguestdataextension?guestRef="+ response.guestRef + "&dataExtensionName=FavoriteEvents",
      {
        "key":eventName + " / " + eventId
      }
    );
  }).catch(e => {
    console.log(e);
  });
}

export function register(eventId, eventName) {
  getGuestRef().then(response => {
    return boxeverPost(
      "/createguestdataextension?guestRef="+ response.guestRef + "&dataExtensionName=RegisteredEvents",
      {
        "key":eventName + " / " + eventId,
        "eventId":eventId
      }
    );
  }).catch(e => {
    console.log(e);
  });
}


export function unregister(eventId, eventName) {
  getGuestRef().then(response => {
    return boxeverDelete(
      "/deletekeyforguestdataextension?guestRef="+ response.guestRef + "&dataExtensionName=RegisteredEvents",
      {
        "key":eventName + " / " + eventId
      }
    );
  }).catch(e => {
    console.log(e);
  });
}

export function getAll(take, skip, lat, lng, profiles, personalize) {
  const payload = { take, skip, lat, lng, personalize };
  if (profiles && profiles.length > 0) {
    payload.profiles = profiles.join("|");
  }
  return get(`/events`, payload, false);
}

export function getRegisteredEvents() {
  // return get(`/events/getregistrations`, { take: 1000 }, false);
  return new Promise((resolve, reject) => {
    // TODO: Implement with Boxever in the client by removing the comment above and completing this promise code.
    // Or in the backend by removing this promise, uncommenting, the above code, and modifying the associated controller.
    resolve([]);
  });
}

export function getFavoritedEvents() {
  // return get(`/events/getfavorites`, { take: 1000 }, false);
  return new Promise((resolve, reject) => {
    // TODO: Implement with Boxever in the client by removing the comment above and completing this promise code.
    // Or in the backend by removing this promise, uncommenting, the above code, and modifying the associated controller.
    resolve([]);
  });
}

//TODO: Use this if we can
/*function executeEventAction(eventActionType, eventAction, eventId , eventName, extensionName) {
  getGuestRef().then(response => {
    return boxeverCallout(eventActionType,
      "/" + eventAction + "?guestRef="+ response.guestRef + "&dataExtensionName="+extensionName,
      {
        "key":eventName + " / " + eventId,
        "eventId":eventId
      }
    );
  }).catch(e => {
    console.log(e);
  });
}*/
