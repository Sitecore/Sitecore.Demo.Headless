import { post } from "./GenericService";

export function flush() {
  return post("/session/flush");
}