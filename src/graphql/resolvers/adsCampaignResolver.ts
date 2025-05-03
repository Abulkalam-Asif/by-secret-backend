import { AuthContext } from "../../middleware/authMiddleware";
import { requireAdvertiser } from "../../middleware/resolverMiddleware";
import { AdsCampaign } from "../../models/AdsCampaign";
import { uploadImageToCloudinary } from "../../utils/uploadImageToCloudinary";
import { createAdsCampaignValidation } from "../../validations/adsCampaignValidations";

export const adsCampaignResolver = {
  Query: {
    // Only advertisers can get their ads campaigns
    getAdsCampaigns: requireAdvertiser(
      async (_: any, __: any, context: AuthContext) => {
        const advertiser = context.user?._id;
        if (!advertiser) {
          return {
            success: false,
            message: "User not authenticated",
          };
        }
        try {
          const campaigns = await AdsCampaign.find({ advertiser });
          return campaigns;
        } catch (error) {
          console.log("Error getting ads campaigns", error);
          return null;
        }
      }
    ),
  },
  Mutation: {
    // Only advertisers can create ads campaigns
    createAdsCampaign: requireAdvertiser(
      async (
        _: any,
        { name, adImage, action, startDate, endDate, budget }: any,
        context: AuthContext
      ) => {
        const advertiser = context.user?._id;
        if (!advertiser) {
          return {
            success: false,
            message: "User not authenticated",
          };
        }
        const validationResponse = createAdsCampaignValidation(
          name,
          adImage,
          action,
          startDate,
          endDate,
          budget
        );
        if (validationResponse) {
          return {
            success: false,
            message: validationResponse,
          };
        }

        try {
          const adImageUrl = await uploadImageToCloudinary(
            adImage,
            "by-secret/ads-campaigns"
          );
          const newCampaign = new AdsCampaign({
            advertiser,
            name,
            adImage: adImageUrl,
            action,
            startDate,
            endDate,
            budget,
          });
          await newCampaign.save();
          return {
            success: true,
            message: "Successfully created ads campaign",
            campaign: newCampaign,
          };
        } catch (error) {
          console.log("Error creating ads campaign", error);
          return {
            success: false,
            message: "Failed to create ads campaign",
          };
        }
      }
    ),
  },
};
