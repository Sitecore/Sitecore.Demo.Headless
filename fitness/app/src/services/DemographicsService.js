import { post } from "./GenericService";
import { required } from "../utils";

export function setDemographicsFacet(age = required(), gender = required()) {
  return post("/demographics/facet", {
    AgeGroup: age,
    Gender: gender
  });
}

export function setDemographicsProfile(age = required(), gender = required()) {
  return post("/demographics/profile", {
    AgeGroup: age,
    Gender: gender
  });
}
