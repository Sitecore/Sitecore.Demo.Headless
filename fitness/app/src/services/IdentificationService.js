import { execute } from "./GenericService";
import { required } from "../utils";

export function setIdentification(
  firstname = required(),
  lastname = required(),
  email = required()
) {
  return execute("/identification/facet", {
    Email: email,
    FirstName: firstname,
    LastName: lastname
  });
}