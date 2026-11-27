import { TextInputProps } from "@expo/ui";

export type AppInputType =
  | "text"
  | "email"
  | "password"
  | "password-new"
  | "tel"
  | "numeric"
  | "decimal"
  | "search"
  | "url";

export const inputTypeMapping: Record<AppInputType, Partial<TextInputProps>> = {
  text: {
    inputMode: "text",
    keyboardType: "default",
  },
  email: {
    inputMode: "email",
    keyboardType: "email-address",
    autoCapitalize: "none",
    autoComplete: "email",
    // textContentType: "emailAddress",
  },
  password: {
    inputMode: "text",
    keyboardType: "default",
    secureTextEntry: true,
    autoCapitalize: "none",
    autoComplete: "password",
    // textContentType: "password",
  },
  "password-new": {
    inputMode: "text",
    keyboardType: "default",
    secureTextEntry: true,
    autoCapitalize: "none",
    autoComplete: "new-password", // Android
    // textContentType: "newPassword", // iOS drops strong password prompt here
  },
  tel: {
    inputMode: "tel",
    keyboardType: "phone-pad",
    autoComplete: "tel",
    // textContentType: "telephoneNumber",
  },
  numeric: {
    inputMode: "numeric",
    keyboardType: "number-pad",
  },
  decimal: {
    inputMode: "decimal",
    keyboardType: "decimal-pad",
  },
  search: {
    inputMode: "search",
    keyboardType: "web-search",
    returnKeyType: "search",
  },
  url: {
    inputMode: "url",
    keyboardType: "url",
    autoCapitalize: "none",
  },
};
