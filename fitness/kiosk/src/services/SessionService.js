import { post } from "./GenericService";

export function flush() {
  // TODO: Is flushing the ASP.Net session still needed with Boxever?
  return post("/session/flush");
}