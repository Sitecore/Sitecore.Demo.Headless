import { execute } from "./GenericService";
import { required } from "../utils";

export function setDemographicsFacet(age = required(), gender = required()) {
  return execute("/demographics/facet", {
    AgeGroup: age,
    Gender: gender
  });
}

export function setDemographicsProfile(age = required(), gender = required()) {
  return execute("/demographics/profile", {
    AgeGroup: age,
    Gender: gender
  });
}
