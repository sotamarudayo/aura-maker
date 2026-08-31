import type { Locale } from "../types";
import { enMessages } from "./en";
import { jaMessages } from "./ja";

export function getMessages(locale: Locale) {
  return locale === "en" ? enMessages : jaMessages;
}

export type { Messages } from "./ja";
