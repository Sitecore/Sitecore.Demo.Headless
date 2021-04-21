import { forgetCurrentGuest } from "./BoxeverService";

export function flush() {
  return forgetCurrentGuest();
}