export const createBeMidiaCampaignValidation = (
  name: string,
  adImage: string,
  action: string,
  startDate: string,
  startHour: string,
  endDate: string,
  endHour: string,
  budget: string
) => {
  if (!name) {
    return "Campaign name is required";
  }
  if (!adImage) {
    return "Ad image is required";
  }
  if (!action) {
    return "Action URL is required";
  }
  if (!startDate) {
    return "Start date is required";
  }
  if (!startHour) {
    return "Start hour is required";
  }
  if (!endDate) {
    return "End date is required";
  }
  if (!endHour) {
    return "End hour is required";
  }
  if (!budget) {
    return "Budget is required";
  }
  if (Number(budget) <= 0) {
    return "Budget must be a positive number";
  }
  
  // Validate hour format (HH:MM)
  const hourRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!hourRegex.test(startHour)) {
    return "Start hour must be in HH:MM format";
  }
  if (!hourRegex.test(endHour)) {
    return "End hour must be in HH:MM format";
  }
  
  // Validate URL format for action
  try {
    new URL(action);
  } catch {
    return "Action must be a valid URL";
  }
  
  // Validate date range
  const startDateTime = new Date(`${startDate}T${startHour}:00`);
  const endDateTime = new Date(`${endDate}T${endHour}:00`);
  
  if (startDateTime >= endDateTime) {
    return "Start date and time must be before end date and time";
  }
  
  return null;
};
