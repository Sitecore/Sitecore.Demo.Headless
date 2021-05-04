import { boxeverGet,boxeverPost,boxeverDelete } from "./GenericService";
import { required } from "../utils";
import { getGuestRef } from "./BoxeverService";

export function setSportsFacets(sportRatings = required()) {
  var guestRef;
  return getGuestRef()
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

export function hasSportsFacets() {
  return getGuestRef()
  .then(response => {
    return boxeverGet(
      "/getguestdataextensionexpanded?guestRef="+ response.guestRef + "&dataExtensionName=SportPreference",
      {}
    );
  })
  .then(sportPreferences => {
    var items = sportPreferences?.data?.extSportPreference?.items;
    return items?.length > 0;
  })
  .catch(e => {
    console.log(e);
  });
}

export function getSportsFacets() {
  return getGuestRef()
  .then(response => {
    return boxeverGet(
      "/getguestdataextensionexpanded?guestRef="+ response.guestRef + "&dataExtensionName=SportPreference",
      {}
    );
  })
  .then(sportPreferences => {
    var allSports ={};
    var items = sportPreferences?.data?.extSportPreference?.items;
    for(var i = 0; i < items.length; i++) {
      var sport = items[i];
      allSports[sport.key] = sport["Skill Level"];
    };
    return allSports;
  })
  .catch(e => {
    console.log(e);
  });
}

export function getDemographicData() {
  return getGuestRef()
  .then(response => {
    return boxeverGet(
      "/getguestdataextensionexpanded?guestRef="+ response.guestRef + "&dataExtensionName=CustomGuestData",
      {}
    );
  })
  .then(sportPreferences => {
    var items = sportPreferences?.data?.extCustomGuestData?.items;
    var demo = items.filter(a => a["key"] === "Demographics");
    return {
      "age": demo[0].Age,
      "gender":demo[0].Gender
    };
  })
  .catch(e => {
    console.log(e);
  });
}


