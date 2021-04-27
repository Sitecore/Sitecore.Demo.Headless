import { boxeverPost } from "./GenericService";
import { required } from "../utils";
import { getGuestRef } from "./BoxeverService";

export function setSportsFacets(sportRatings = required()) {
  for(var k in sportRatings) {
    var payload = {"key":k, "Skill Level":sportRatings[k]};
    // eslint-disable-next-line no-loop-func
    getGuestRef().then(response => {
      return boxeverPost(
        "/createguestdataextension?guestRef="+ response.guestRef + "&dataExtensionName=SportPreference",
        payload
      );
    }).catch(e => {
      console.log(e);
    });
 }
}

