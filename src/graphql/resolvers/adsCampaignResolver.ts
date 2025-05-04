import { AuthContext } from "../../middleware/authMiddleware";
import {
  requireAdmin,
  requireAdvertiser,
} from "../../middleware/resolverMiddleware";
import { AdsCampaign } from "../../models/AdsCampaign";
import { deleteImageFromCloudinary } from "../../utils/deleteImageFromCloudinary";
import { uploadImageToCloudinary } from "../../utils/uploadImageToCloudinary";
import { createAdsCampaignValidation } from "../../validations/adsCampaignValidations";

export const adsCampaignResolver = {
  Query: {
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
          return campaigns.map((campaign: any) => ({
            id: campaign._id,
            name: campaign.name,
            adImage: campaign.adImage,
            action: campaign.action,
            startDate: campaign.startDate,
            endDate: campaign.endDate,
            budget: campaign.budget,
            status: campaign.status,
            rejectionReason: campaign.rejectionReason,
          }));
        } catch (error) {
          console.log("Error getting ads campaigns", error);
          return null;
        }
      }
    ),
    getAdsCampaignsCount: requireAdvertiser(
      async (_: any, __: any, context: AuthContext) => {
        const advertiser = context.user?._id;
        if (!advertiser) {
          return {
            success: false,
            message: "User not authenticated",
          };
        }
        try {
          const pendingCount = await AdsCampaign.countDocuments({
            advertiser,
            status: "PENDING",
          });
          const approvedCount = await AdsCampaign.countDocuments({
            advertiser,
            status: "APPROVED",
          });
          const rejectedCount = await AdsCampaign.countDocuments({
            advertiser,
            status: "REJECTED",
          });
          return {
            pending: pendingCount,
            approved: approvedCount,
            rejected: rejectedCount,
          };
        } catch (error) {
          console.log("Error getting ads campaign count", error);
          return null;
        }
      }
    ),
    getPendingAdsCampaigns: requireAdmin(
      async (_: any, __: any, context: AuthContext) => {
        try {
          const campaigns = await AdsCampaign.find({
            status: "PENDING",
          }).populate("advertiser", "companyName");
          return campaigns.map((campaign: any) => ({
            id: campaign._id,
            name: campaign.name,
            advertiser: campaign.advertiser.companyName,
            dateRequested: campaign.createdAt,
            days: Math.floor(
              (campaign.endDate.getTime() - campaign.startDate.getTime()) /
                (1000 * 3600 * 24)
            ),
            startDate: campaign.startDate,
            budget: campaign.budget,
            media: campaign.adImage,
            action: campaign.action,
          }));
        } catch (error) {
          console.log("Error getting pending ads campaigns", error);
          return null;
        }
      }
    ),
    // Only admins can get all approved ads campaigns
    getApprovedAdsCampaigns: requireAdmin(
      async (_: any, __: any, context: AuthContext) => {
        try {
          const campaigns = await AdsCampaign.find({
            status: "APPROVED",
          }).populate("advertiser", "companyName");
          return campaigns.map((campaign: any) => ({
            id: campaign._id,
            name: campaign.name,
            advertiser: campaign.advertiser.companyName,
            dateCreated: campaign.createdAt,
            startDate: campaign.startDate,
            endDate: campaign.endDate,
            budget: campaign.budget,
          }));
        } catch (error) {
          console.log("Error getting approved ads campaigns", error);
          return null;
        }
      }
    ),
    // Only admins can get all rejected ads campaigns
    getRejectedAdsCampaigns: requireAdmin(
      async (_: any, __: any, context: AuthContext) => {
        try {
          const campaigns = await AdsCampaign.find({
            status: "REJECTED",
          }).populate("advertiser", "companyName");
          return campaigns.map((campaign: any) => ({
            id: campaign._id,
            name: campaign.name,
            advertiser: campaign.advertiser.companyName,
            dateRequested: campaign.createdAt,
            days: Math.floor(
              (campaign.endDate.getTime() - campaign.startDate.getTime()) /
                (1000 * 3600 * 24)
            ),
            startDate: campaign.startDate,
            budget: campaign.budget,
            media: campaign.adImage,
            action: campaign.action,
          }));
        } catch (error) {
          console.log("Error getting rejected ads campaigns", error);
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
    updateAdsCampaign: requireAdvertiser(
      async (
        _: any,
        { id, name, adImage, action, startDate, endDate, budget }: any,
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
          const campaign = await AdsCampaign.findById(id);
          if (!campaign) {
            return {
              success: false,
              message: "An error occurred while updating the ads campaign",
            };
          }
          // If the adImage is a base64 string, delete the previous image from Cloudinary and upload the new onej
          if (adImage.startsWith("data:image/")) {
            const previousAdImage = campaign.adImage as string;
            const response = await deleteImageFromCloudinary(
              previousAdImage,
              "by-secret/ads-campaigns"
            );
            if (response) {
              const adImageUrl = await uploadImageToCloudinary(
                adImage,
                "by-secret/ads-campaigns"
              );
              campaign.adImage = adImageUrl;
            } else {
              return {
                success: false,
                message: "An error occurred while updating the ads campaign",
              };
            }
          }
          campaign.name = name;
          campaign.action = action;
          campaign.startDate = startDate;
          campaign.endDate = endDate;
          campaign.budget = budget;
          await campaign.save();
          return {
            success: true,
            message: "Successfully updated ads campaign",
            campaign,
          };
        } catch (error) {
          console.log("Error updating ads campaign", error);
          return {
            success: false,
            message: "Failed to update ads campaign",
          };
        }
      }
    ),
    approveAdsCampaign: requireAdmin(
      async (_: any, { id }: { id: string }, context: AuthContext) => {
        try {
          const campaign = await AdsCampaign.findById(id);
          if (!campaign) {
            return {
              success: false,
              message: "An error occurred while approving the ads campaign",
            };
          }
          campaign.status = "APPROVED";
          await campaign.save();
          return {
            success: true,
            message: "Successfully approved ads campaign",
            campaign,
          };
        } catch (error) {
          console.log("Error approving ads campaign", error);
          return {
            success: false,
            message: "Failed to approve ads campaign",
          };
        }
      }
    ),
    rejectAdsCampaign: requireAdmin(
      async (
        _: any,
        { id, rejectionReason }: { id: string; rejectionReason: string },
        context: AuthContext
      ) => {
        try {
          const campaign = await AdsCampaign.findById(id);
          if (!campaign) {
            return {
              success: false,
              message: "An error occurred while rejecting the ads campaign",
            };
          }
          campaign.status = "REJECTED";
          campaign.rejectionReason = rejectionReason;
          await campaign.save();
          return {
            success: true,
            message: "Successfully rejected ads campaign",
            campaign,
          };
        } catch (error) {
          console.log("Error rejecting ads campaign", error);
          return {
            success: false,
            message: "Failed to reject ads campaign",
          };
        }
      }
    ),
  },
};
