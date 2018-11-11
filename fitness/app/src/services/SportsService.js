import { execute } from "./GenericService";
import { required } from "../utils";

export function setSportsFacets(sportRatings = required()) {
  return execute("/sports/facet", {
    Ratings: sportRatings
  });
}

export function setSportsProfile(sportRatings = required()) {
  return execute("/sports/profile", {
    Ratings: sportRatings
  });
}

