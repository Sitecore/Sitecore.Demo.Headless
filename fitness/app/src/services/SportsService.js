import { boxeverPost } from "./GenericService";
import { required } from "../utils";
import { getGuestRef } from "./BoxeverService";

export function setSportsFacets(sportRatings = required()) {
  getGuestRef().then(response => {
    sportRatings.key="SportRating";
    console.log(sportRatings);
    return boxeverPost(
      "/createguestdataextension?guestRef="+ response.guestRef + "&dataExtensionName=SportRating",
      sportRatings
    );
  }).catch(e => {
    console.log(e);
  });
}


