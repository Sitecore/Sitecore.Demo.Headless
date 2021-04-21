import { get } from "./GenericService";

export const EventDisplayCount = 3;

export function getAll(take, skip, lat, lng, profiles) {
  const payload = { take: take, skip: skip, lat: lat, lng: lng };

  if (profiles && profiles.length > 0) {
    payload.profiles = profiles.join("|");
  }
  return get(`/events`, payload, false);

  // TODO: The goal here will be to:
  // 1. Modify our backend /events controller/API/Services to return the filtered (by sport if a filter is selected)  and sorted by geo location list of events.
  // 2. Get this list of events from Sitecore (by passing lat, lng, and profiles I believe)
  // 3. Pass this list of filtered and sorted events to the Boxever FullStack Interactive Experience. (by passing take, skip)
  // 4. Get back from Boxever, the personalized list of events to display.
  // 5. Return that list to the caller.

  // Boxever GetPersonalizedEvents FullStack Interactive Experience with Decision Model
  // var request = {
  //   "browserId": window.Boxever.getID(),
  //   "channel": "WEB",
  //   "language": "EN",
  //   "currencyCode": "CAD",
  //   "pointOfSale": "fitness-kiosk.com",
  //   "clientKey": window._boxever_settings.client_key,
  //   "friendlyId": "getpersonalizedevents",
  //   "params": { "events": [{ "id": "{D4F99C5C-3CEF-41DC-8A01-3DDB08708549}", "url": "/events/canada/manitoba/dauphin/dauphin-2k-run", "fields": { "description": { "value": "This is the race event of the year for Dauphin. Challenge yourself to a 2K Run and join others with the same goals." }, "longDescription": { "value": "Long Description. This is the race event of the year for Dauphin. Challenge yourself to a 2K Run and join others with the same goals." }, "Duration": { "value": "2km" }, "participants": { "value": "200" }, "date": { "value": "2021-12-30T05:00:00Z" }, "image": { "value": { "src": "https://app.lighthouse.localhost/-/media/Project/lighthousefitness/assets/events/running/running09-800x410.jpg?h=410&iar=0&w=800&hash=BD5D05BB7AE9A9007B1651DE3EE675E2", "alt": "running09-800x410", "width": "800", "height": "410" } }, "pageTitle": { "value": "Dauphin 2K Run" }, "latitude": { "value": "51.1500" }, "longitude": { "value": "-100.0500" }, "name": { "value": "Dauphin 2K Run" } } }] }
  // };
  // window.Boxever.callFlows(request, function (response) { console.log(response); }, 'json');
}