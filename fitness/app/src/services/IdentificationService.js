import { required } from "../utils";
import { identifyVisitor } from "./BoxeverService";

export function setIdentification(
  firstname = required(),
  lastname = required(),
  email = required()
) {
  return identifyVisitor(firstname, lastname, email);
}