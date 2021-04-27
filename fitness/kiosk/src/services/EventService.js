import { get } from "./GenericService";
import { boxeverPost } from "./GenericService";
import { getGuestRef } from "./BoxeverService";

export const EventDisplayCount = 3;

export function getAll(take, skip, lat, lng, profiles) {
  const payload = { take: take, skip: skip, lat: lat, lng: lng };

  if (profiles && profiles.length > 0) {
    payload.profiles = profiles.join("|");
  }
  return get(`/events`, payload, false);
}

export function setRegisteredEventsFacets(eventName = required(), eventId = required(), sportType = required(), eventDate = required()) {
  var payload = {"key":eventName + " / " + eventId, "Event Name":eventName, "Event Id":eventId, "Event Date":eventDate, "Sport Type":sportType};
  // eslint-disable-next-line no-loop-func
  getGuestRef().then(response => {
    return boxeverPost(
      "/createguestdataextension?guestRef="+ response.guestRef + "&dataExtensionName=RegisteredEvents",
      payload
    );
  }).catch(e => {
    console.log(e);
  });
}