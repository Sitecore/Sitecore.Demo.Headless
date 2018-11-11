import { execute } from "./GenericService";

export function flush() {
  return execute("/session/flush");
}