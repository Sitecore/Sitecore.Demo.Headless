import { required } from "../utils";

export function setIdentification(
  firstname = required(),
  lastname = required(),
  email = required()
) {
  // return post("/identification/facet", {
  //   Email: email,
  //   FirstName: firstname,
  //   LastName: lastname
  // });
  return new Promise((resolve, reject) => {
    // TODO: Implement with Boxever in the client by removing the comment above and completing this promise code.
    // Or in the backend by removing this promise, uncommenting, the above code, and modifying the associated controller.
    resolve("data");
  });
}