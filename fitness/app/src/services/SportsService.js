import { post } from "./GenericService";
import { required } from "../utils";

export function setSportsFacets(sportRatings = required()) {
  return post("/sports/facet", {
    Ratings: sportRatings
  });
}

export function setSportsProfile(sportRatings = required()) {
  return post("/sports/profile", {
    Ratings: sportRatings
  });
}

