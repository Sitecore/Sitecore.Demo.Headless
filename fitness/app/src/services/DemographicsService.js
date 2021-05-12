import { boxeverPost } from "./GenericService";
import { required } from "../utils";
import { getGuestRef } from "./BoxeverService";

export function sendDemographicsToBoxever(age = required(), gender = required()) {
  return getGuestRef()
  .then(response => {
    return boxeverPost(
      "/createguestdataextension?guestRef="+ response.guestRef + "&dataExtensionName=CustomGuestData",
      {
        "key":"Demographics",
        "Age": age,
        "Gender": gender
      }
    );
  }).catch(e => {
    console.log(e);
  });
}
