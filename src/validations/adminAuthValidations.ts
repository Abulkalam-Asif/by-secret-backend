import { EMAIL_REGEX, PASSWORD_REGEX } from "../constants";

export const loginAdminValidation = (email: string, password: string) => {
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

export const createAdminValidation = (
  fullName: string,
  email: string,
  password: string
) => {
  if (!fullName) {
    return "Full name is required";
  } else if (!email) {
    return "Email is required";
  } else if (!password) {
    return "Password is required";
  } else if (EMAIL_REGEX.test(email) === false) {
    return "Invalid email";
  } else if (PASSWORD_REGEX.test(password) === false) {
    return "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character";
  }
  return "";
};
