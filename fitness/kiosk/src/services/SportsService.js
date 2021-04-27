import { boxeverPost,boxeverDelete } from "./GenericService";
import { required } from "../utils";
import { getGuestRef } from "./BoxeverService";

export function setSportsFacets(sportRatings = required()) {
  var guestRef;
  getGuestRef()
  .then(response => {
    guestRef =response.guestRef;
    return boxeverDelete(
      "/deleteallkeysforguestdataextension?guestRef="+ guestRef + "&dataExtensionName=SportPreference",
      {}
    );
  })
  .then(() => {
    var createSportPreferencePromises = [];
    for(var k in sportRatings) {
      var payload = {"key":k, "Skill Level":sportRatings[k]};
      createSportPreferencePromises.push(boxeverPost(
        "/createguestdataextension?guestRef="+ guestRef + "&dataExtensionName=SportPreference",
        payload
      ));
    }
    return Promise.all(createSportPreferencePromises);
  })
  .catch(e => {
    console.log(e);
  });
}

