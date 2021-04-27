import { boxeverPost } from "./GenericService";
import { required } from "../utils";
import { getGuestRef } from "./BoxeverService";

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

