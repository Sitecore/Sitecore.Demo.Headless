import { get } from "./GenericService";
import { required } from "../utils";

export function addToFavorites(eventId) {
  return executeEventAction("favorites/add", eventId);
}

export function removeFromFavorites(eventId) {
  return executeEventAction("favorites/remove", eventId);
}

export function register(eventId) {
  return executeEventAction("registration/add", eventId);
}

export function unregister(eventId) {
  return executeEventAction("registration/remove", eventId);
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

function executeEventAction(eventAction, eventId = required()) {
  // return post(`/events/${eventAction}`, { EventId: eventId });
  return new Promise((resolve, reject) => {
    // TODO: Implement with Boxever in the client by removing the comment above and completing this promise code.
    // Or in the backend by removing this promise, uncommenting, the above code, and modifying the associated controller.
    resolve("data");
  });
}
