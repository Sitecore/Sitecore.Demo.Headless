import { execute } from "./GenericService";
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

function executeEventAction(eventAction, eventId = required()) {
  return execute(`/events/${eventAction}`, { EventId: eventId });
}