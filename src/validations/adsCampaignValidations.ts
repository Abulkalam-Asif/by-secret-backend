import { EMAIL_REGEX, PASSWORD_REGEX } from "../constants";

export const createAdsCampaignValidation = (
  name: string,
  adImage: string,
  action: string,
  startDate: string,
  endDate: string,
  budget: string
) => {
  if (!name) {
    return "Name is required";
  }
  if (!adImage) {
    return "Ad image is required";
  }
  if (!action) {
    return "Action is required";
  }
  if (!startDate) {
    return "Start date is required";
  }
  if (!endDate) {
    return "End date is required";
  }
  if (!budget) {
    return "Budget is required";
  }
  if (Number(budget) < 0) {
    return "Budget must be a positive number";
  }
  if (new Date(startDate) >= new Date(endDate)) {
    return "Start date must be before end date";
  }
  return null;
};
