import { required } from "../utils";

export function setIdentification(
  firstname = required(),
  lastname = required(),
  email = required()
) {
  // TODO: Move this code to a BoxeverService.js file to centralize ID, channel, language, currency, page, and pos.
  // Boxever identification
  var identifyEvent = {
    "browser_id": window.Boxever.getID(),
    "channel": "WEB",
    "language": "EN",
    "currency": "CAD",
    "pos": "fitness-kiosk.com",
    "page": "",
    "type": "IDENTITY",
    "firstname": firstname,
    "lastname": lastname,
    "email": email,
  };
  // TODO: Try to return a promise from this call to have it work the same as before
  window.Boxever.eventCreate(identifyEvent, function (data) { }, 'json');
}