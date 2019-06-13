import { get } from "./GenericService";

export const EventDisplayCount = 3;

export function getAll(take, skip, lat, lng, profiles) {
  const payload = { take: take, skip: skip, lat: lat, lng: lng };

  if (profiles && profiles.length > 0) {
    payload.profiles = profiles.join("|");
  }
  return get(`/events`, payload, false);
}