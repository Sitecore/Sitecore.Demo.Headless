import { forgetCurrentGuest } from "./BoxeverService";

export const personalizePromptLocalStorageKey = "personalizeprompt-should-open";

export function flush() {
  localStorage.removeItem(personalizePromptLocalStorageKey)
  return forgetCurrentGuest();
}
