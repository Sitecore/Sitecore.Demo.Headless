import { post, get } from "./GenericService";
import { required } from "../utils";

export const EventDisplayCount = 3;

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

export function getAll(filter) {
  const payload = { take: EventDisplayCount };

  if (filter && filter.length > 0) {
    payload.filter = filter.join("|");
  }
  return get(`/events`, payload, false);
}

function executeEventAction(eventAction, eventId = required()) {
  return post(`/events/${eventAction}`, { EventId: eventId });
}
