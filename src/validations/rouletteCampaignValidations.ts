export const createRouletteCampaignValidation = (
  name: string,
  startDate: string,
  endDate: string,
  mainPrize: string,
  mainPrizeAmount: string,
  budget: string
) => {
  if (!name) {
    return "Name is required";
  }
  if (!startDate) {
    return "Start date is required";
  }
  if (!endDate) {
    return "End date is required";
  }
  if (!mainPrize) {
    return "Main prize is required";
  }
  if (!mainPrizeAmount) {
    return "Main prize amount is required";
  }
  if (!budget) {
    return "Budget is required";
  }
  if (Number(mainPrizeAmount) < 0) {
    return "Main prize amount must be a positive number";
  }
  if (Number(budget) < 0) {
    return "Budget must be a positive number";
  }
  if (new Date(startDate) >= new Date(endDate)) {
    return "Start date must be before end date";
  }
  return null;
}; 