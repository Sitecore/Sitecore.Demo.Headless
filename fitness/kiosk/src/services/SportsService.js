import { clearCache } from "./GenericService";
import { required } from "../utils";

export function setSportsFacets(sportRatings = required()) {
  // return post("/sports/facet", {
  //   Ratings: sportRatings
  // });
  return new Promise((resolve, reject) => {
    // TODO: Implement with Boxever in the client by removing the comment above and completing this promise code.
    // Or in the backend by removing this promise, uncommenting, the above code, and modifying the associated controller.
    resolve("data");
  });
}

export function setSportsProfile(sportRatings = required()) {
  // return post("/sports/profile", {
  //   Ratings: sportRatings
  // }).then(() => clearCache());
  return new Promise((resolve, reject) => {
    // TODO: Implement with Boxever in the client by removing the comment above and completing this promise code.
    // Or in the backend by removing this promise, uncommenting, the above code, and modifying the associated controller.
    resolve("data");
  }).then(() => clearCache());
}

