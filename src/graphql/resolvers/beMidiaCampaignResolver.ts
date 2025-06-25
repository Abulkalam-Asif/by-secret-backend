import { BeMidiaCampaign } from "../../models/BeMidiaCampaign";
import { Invoice } from "../../models/Invoice";
import { AuthContext } from "../../middleware/authMiddleware";
import {
  requireAdmin,
  requireAdvertiser,
} from "../../middleware/resolverMiddleware";
import { createBeMidiaCampaignValidation } from "../../validations/beMidiaCampaignValidations";
import { uploadImageToCloudinary } from "../../utils/uploadImageToCloudinary";

export const beMidiaCampaignResolver = {
  Query: {
    getBeMidiaCampaigns: requireAdvertiser(
      async (_: any, __: any, context: AuthContext) => {
        const advertiser = context.user?._id;
        if (!advertiser) {
          return {
            success: false,
            message: "User not authenticated",
          };
        }
        try {
          const campaigns = await BeMidiaCampaign.find({ advertiser });
          return campaigns.map((campaign: any) => ({
            id: campaign._id,
            name: campaign.name,
            adImage: campaign.adImage,
            action: campaign.action,
            startDate: campaign.startDate,
            startHour: campaign.startHour,
            endDate: campaign.endDate,
            endHour: campaign.endHour,
            budget: campaign.budget,
            status: campaign.status,
            rejectionReason: campaign.rejectionReason,
          }));
        } catch (error) {
          console.log("Error getting BeMidia campaigns", error);
          return null;
        }
      }
    ),
    getPendingBeMidiaCampaigns: requireAdmin(
      async (_: any, __: any, context: AuthContext) => {
        try {
          const campaigns = await BeMidiaCampaign.find({
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
            startHour: campaign.startHour,
            endDate: campaign.endDate,
            endHour: campaign.endHour,
            budget: campaign.budget,
            media: campaign.adImage,
            action: campaign.action,
          }));
        } catch (error) {
          console.log("Error getting pending BeMidia campaigns", error);
          return null;
        }
      }
    ),
    getApprovedBeMidiaCampaigns: requireAdmin(
      async (_: any, __: any, context: AuthContext) => {
        try {
          const campaigns = await BeMidiaCampaign.find({
            status: "APPROVED",
          }).populate("advertiser", "companyName");
          return campaigns.map((campaign: any) => ({
            id: campaign._id,
            name: campaign.name,
            advertiser: campaign.advertiser.companyName,
            dateCreated: campaign.createdAt,
            startDate: campaign.startDate,
            startHour: campaign.startHour,
            endDate: campaign.endDate,
            endHour: campaign.endHour,
            budget: campaign.budget,
          }));
        } catch (error) {
          console.log("Error getting approved BeMidia campaigns", error);
          return null;
        }
      }
    ),
    getRejectedBeMidiaCampaigns: requireAdmin(
      async (_: any, __: any, context: AuthContext) => {
        try {
          const campaigns = await BeMidiaCampaign.find({
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
            startHour: campaign.startHour,
            endDate: campaign.endDate,
            endHour: campaign.endHour,
            budget: campaign.budget,
            media: campaign.adImage,
            action: campaign.action,
            rejectionReason: campaign.rejectionReason,
          }));
        } catch (error) {
          console.log("Error getting rejected BeMidia campaigns", error);
          return null;
        }
      }
    ),
  },
  Mutation: {
    createBeMidiaCampaign: requireAdvertiser(
      async (
        _: any,
        {
          name,
          adImage,
          action,
          startDate,
          startHour,
          endDate,
          endHour,
          budget,
        }: any,
        context: AuthContext
      ) => {
        const advertiser = context.user?._id;
        if (!advertiser) {
          return {
            success: false,
            message: "User not authenticated",
          };
        }

        const validationResponse = createBeMidiaCampaignValidation(
          name,
          adImage,
          action,
          startDate,
          startHour,
          endDate,
          endHour,
          budget
        );
        if (validationResponse) {
          return {
            success: false,
            message: validationResponse,
          };
        }

        try {
          // Upload image to Cloudinary
          let imageUrl = "";
          if (adImage) {
            imageUrl = await uploadImageToCloudinary(
              adImage,
              "by-secret/bemidia-campaigns"
            );
          }

          const newCampaign = new BeMidiaCampaign({
            advertiser,
            name,
            adImage: imageUrl,
            action,
            startDate: new Date(startDate),
            startHour,
            endDate: new Date(endDate),
            endHour,
            budget: Number(budget),
          });

          await newCampaign.save();

          return {
            success: true,
            message: "BeMidia campaign created successfully",
          };
        } catch (error) {
          console.log("Error creating BeMidia campaign", error);
          return {
            success: false,
            message: "Error creating BeMidia campaign",
          };
        }
      }
    ),
    updateBeMidiaCampaign: requireAdvertiser(
      async (
        _: any,
        {
          id,
          name,
          adImage,
          action,
          startDate,
          startHour,
          endDate,
          endHour,
          budget,
        }: any,
        context: AuthContext
      ) => {
        const advertiser = context.user?._id;
        if (!advertiser) {
          return {
            success: false,
            message: "User not authenticated",
          };
        }

        try {
          const campaign = await BeMidiaCampaign.findOne({
            _id: id,
            advertiser,
          });
          if (!campaign) {
            return {
              success: false,
              message: "Campaign not found",
            };
          }

          // Only allow editing if status is PENDING
          if (campaign.status !== "PENDING") {
            return {
              success: false,
              message: "Only pending campaigns can be edited",
            };
          }

          const validationResponse = createBeMidiaCampaignValidation(
            name || campaign.name,
            adImage || campaign.adImage,
            action || campaign.action,
            startDate ||
              (campaign.startDate as Date).toISOString().split("T")[0],
            startHour || campaign.startHour,
            endDate || (campaign.endDate as Date).toISOString().split("T")[0],
            endHour || campaign.endHour,
            budget || (campaign.budget as number).toString()
          );
          if (validationResponse) {
            return {
              success: false,
              message: validationResponse,
            };
          }

          // Update fields
          if (name) campaign.name = name;
          if (action) campaign.action = action;
          if (startDate) campaign.startDate = new Date(startDate);
          if (startHour) campaign.startHour = startHour;
          if (endDate) campaign.endDate = new Date(endDate);
          if (endHour) campaign.endHour = endHour;
          if (budget) campaign.budget = Number(budget);

          // Handle image update
          if (adImage && adImage !== campaign.adImage) {
            const imageUrl = await uploadImageToCloudinary(
              adImage,
              "by-secret/bemidia-campaigns"
            );
            campaign.adImage = imageUrl;
          }

          await campaign.save();

          return {
            success: true,
            message: "BeMidia campaign updated successfully",
          };
        } catch (error) {
          console.log("Error updating BeMidia campaign", error);
          return {
            success: false,
            message: "Error updating BeMidia campaign",
          };
        }
      }
    ),
    approveBeMidiaCampaign: requireAdmin(
      async (_: any, { id }: { id: string }, context: AuthContext) => {
        try {
          const campaign = await BeMidiaCampaign.findById(id);
          if (!campaign) {
            return {
              success: false,
              message: "An error occurred while approving the BeMidia campaign",
            };
          }

          // Generate an invoice for the campaign
          const invoice = new Invoice({
            advertiser: campaign.advertiser,
            campaign: campaign._id,
            campaignType: "BeMidiaCampaign",
            date: new Date(),
            amount: campaign.budget,
          });

          await invoice.save();

          // Update the campaign status to APPROVED
          campaign.status = "APPROVED";
          await campaign.save();
          return {
            success: true,
            message: "BeMidia campaign approved successfully",
            campaign,
          };
        } catch (error) {
          console.log("Error approving BeMidia campaign", error);
          return {
            success: false,
            message: "Error approving BeMidia campaign",
          };
        }
      }
    ),
    rejectBeMidiaCampaign: requireAdmin(
      async (
        _: any,
        { id, rejectionReason }: { id: string; rejectionReason: string },
        context: AuthContext
      ) => {
        try {
          const campaign = await BeMidiaCampaign.findByIdAndUpdate(
            id,
            {
              status: "REJECTED",
              rejectionReason: rejectionReason,
            },
            { new: true }
          );
          if (!campaign) {
            return {
              success: false,
              message: "Campaign not found",
            };
          }
          return {
            success: true,
            message: "BeMidia campaign rejected successfully",
          };
        } catch (error) {
          console.log("Error rejecting BeMidia campaign", error);
          return {
            success: false,
            message: "Error rejecting BeMidia campaign",
          };
        }
      }
    ),
  },
};
