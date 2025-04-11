import { EMAIL_REGEX, PASSWORD_REGEX } from "../constants";

export const loginAdvertiserValidation = (email: string, password: string) => {
  if (!email) {
    return "Email is required";
  } else if (!password) {
    return "Password is required";
  } else if (EMAIL_REGEX.test(email) === false) {
    return "Invalid email or password";
  } else if (PASSWORD_REGEX.test(password) === false) {
    return "Invalid email or password";
  }
  return "";
};
