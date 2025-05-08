import { AuthContext } from "../../middleware/authMiddleware";
import {
  requireAdmin,
  requireAdvertiser,
} from "../../middleware/resolverMiddleware";
import { RouletteCampaign } from "../../models/RouletteCampaign";
import { createRouletteCampaignValidation } from "../../validations/rouletteCampaignValidations";

export const rouletteCampaignResolver = {
  Query: {
    getRouletteCampaigns: requireAdvertiser(
      async (_: any, __: any, context: AuthContext) => {
        const advertiser = context.user?._id;
        if (!advertiser) {
          return {
            success: false,
            message: "User not authenticated",
          };
        }
        try {
          const campaigns = await RouletteCampaign.find({ advertiser });
          return campaigns.map((campaign: any) => ({
            id: campaign._id,
            name: campaign.name,
            startDate: campaign.startDate,
            endDate: campaign.endDate,
            mainPrize: campaign.mainPrize,
            mainPrizeAmount: campaign.mainPrizeAmount,
            secPrize1: campaign.secPrize1,
            amount1: campaign.amount1,
            secPrize2: campaign.secPrize2,
            amount2: campaign.amount2,
            secPrize3: campaign.secPrize3,
            amount3: campaign.amount3,
            budget: campaign.budget,
            status: campaign.status,
            rejectionReason: campaign.rejectionReason,
          }));
        } catch (error) {
          console.log("Error getting roulette campaigns", error);
          return null;
        }
      }
    ),
    getRouletteCampaignsCount: requireAdvertiser(
      async (_: any, __: any, context: AuthContext) => {
        const advertiser = context.user?._id;
        if (!advertiser) {
          return {
            success: false,
            message: "User not authenticated",
          };
        }
        try {
          const pendingCount = await RouletteCampaign.countDocuments({
            advertiser,
            status: "PENDING",
          });
          const approvedCount = await RouletteCampaign.countDocuments({
            advertiser,
            status: "APPROVED",
          });
          const rejectedCount = await RouletteCampaign.countDocuments({
            advertiser,
            status: "REJECTED",
          });
          return {
            pending: pendingCount,
            approved: approvedCount,
            rejected: rejectedCount,
          };
        } catch (error) {
          console.log("Error getting roulette campaign count", error);
          return null;
        }
      }
    ),
    getAllRouletteCampaignsCount: requireAdmin(
      async (_: any, __: any, context: AuthContext) => {
        try {
          const pendingCount = await RouletteCampaign.countDocuments({
            status: "PENDING",
          });
          const approvedCount = await RouletteCampaign.countDocuments({
            status: "APPROVED",
          });
          const rejectedCount = await RouletteCampaign.countDocuments({
            status: "REJECTED",
          });
          return {
            pending: pendingCount,
            approved: approvedCount,
            rejected: rejectedCount,
          };
        } catch (error) {
          console.log("Error getting all roulette campaign count", error);
          return null;
        }
      }
    ),
    getPendingRouletteCampaigns: requireAdmin(
      async (_: any, __: any, context: AuthContext) => {
        try {
          const campaigns = await RouletteCampaign.find({
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
            mainPrize: campaign.mainPrize,
            mainPrizeAmount: campaign.mainPrizeAmount,
            secPrize1: campaign.secPrize1,
            amount1: campaign.amount1,
            secPrize2: campaign.secPrize2,
            amount2: campaign.amount2,
            secPrize3: campaign.secPrize3,
            amount3: campaign.amount3,
            budget: campaign.budget,
          }));
        } catch (error) {
          console.log("Error getting pending roulette campaigns", error);
          return null;
        }
      }
    ),
    getApprovedRouletteCampaigns: requireAdmin(
      async (_: any, __: any, context: AuthContext) => {
        try {
          const campaigns = await RouletteCampaign.find({
            status: "APPROVED",
          }).populate("advertiser", "companyName");
          return campaigns.map((campaign: any) => ({
            id: campaign._id,
            name: campaign.name,
            advertiser: campaign.advertiser.companyName,
            dateCreated: campaign.createdAt,
            startDate: campaign.startDate,
            endDate: campaign.endDate,
            mainPrize: campaign.mainPrize,
            mainPrizeAmount: campaign.mainPrizeAmount,
            secPrize1: campaign.secPrize1,
            amount1: campaign.amount1,
            secPrize2: campaign.secPrize2,
            amount2: campaign.amount2,
            secPrize3: campaign.secPrize3,
            amount3: campaign.amount3,
            budget: campaign.budget,
          }));
        } catch (error) {
          console.log("Error getting approved roulette campaigns", error);
          return null;
        }
      }
    ),
    getRejectedRouletteCampaigns: requireAdmin(
      async (_: any, __: any, context: AuthContext) => {
        try {
          const campaigns = await RouletteCampaign.find({
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
            mainPrize: campaign.mainPrize,
            mainPrizeAmount: campaign.mainPrizeAmount,
            secPrize1: campaign.secPrize1,
            amount1: campaign.amount1,
            secPrize2: campaign.secPrize2,
            amount2: campaign.amount2,
            secPrize3: campaign.secPrize3,
            amount3: campaign.amount3,
            budget: campaign.budget,
            rejectionReason: campaign.rejectionReason,
          }));
        } catch (error) {
          console.log("Error getting rejected roulette campaigns", error);
          return null;
        }
      }
    ),
  },
  Mutation: {
    createRouletteCampaign: requireAdvertiser(
      async (
        _: any,
        {
          name,
          startDate,
          endDate,
          mainPrize,
          mainPrizeAmount,
          secPrize1,
          amount1,
          secPrize2,
          amount2,
          secPrize3,
          amount3,
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
        const validationResponse = createRouletteCampaignValidation(
          name,
          startDate,
          endDate,
          mainPrize,
          mainPrizeAmount,
          budget
        );
        if (validationResponse) {
          return {
            success: false,
            message: validationResponse,
          };
        }

        try {
          const newCampaign = new RouletteCampaign({
            advertiser,
            name,
            startDate,
            endDate,
            mainPrize,
            mainPrizeAmount,
            secPrize1,
            amount1,
            secPrize2,
            amount2,
            secPrize3,
            amount3,
            budget,
          });
          await newCampaign.save();
          return {
            success: true,
            message: "Successfully created roulette campaign",
            campaign: newCampaign,
          };
        } catch (error) {
          console.log("Error creating roulette campaign", error);
          return {
            success: false,
            message: "Failed to create roulette campaign",
          };
        }
      }
    ),
    updateRouletteCampaign: requireAdvertiser(
      async (
        _: any,
        {
          id,
          name,
          startDate,
          endDate,
          mainPrize,
          mainPrizeAmount,
          secPrize1,
          amount1,
          secPrize2,
          amount2,
          secPrize3,
          amount3,
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
        const validationResponse = createRouletteCampaignValidation(
          name,
          startDate,
          endDate,
          mainPrize,
          mainPrizeAmount,
          budget
        );
        if (validationResponse) {
          return {
            success: false,
            message: validationResponse,
          };
        }
        try {
          const campaign = await RouletteCampaign.findById(id);
          if (!campaign) {
            return {
              success: false,
              message: "An error occurred while updating the roulette campaign",
            };
          }
          campaign.name = name;
          campaign.startDate = startDate;
          campaign.endDate = endDate;
          campaign.mainPrize = mainPrize;
          campaign.mainPrizeAmount = mainPrizeAmount;
          campaign.secPrize1 = secPrize1;
          campaign.amount1 = amount1;
          campaign.secPrize2 = secPrize2;
          campaign.amount2 = amount2;
          campaign.secPrize3 = secPrize3;
          campaign.amount3 = amount3;
          campaign.budget = budget;
          await campaign.save();
          return {
            success: true,
            message: "Successfully updated roulette campaign",
            campaign,
          };
        } catch (error) {
          console.log("Error updating roulette campaign", error);
          return {
            success: false,
            message: "Failed to update roulette campaign",
          };
        }
      }
    ),
    approveRouletteCampaign: requireAdmin(
      async (_: any, { id }: { id: string }, context: AuthContext) => {
        try {
          const campaign = await RouletteCampaign.findById(id);
          if (!campaign) {
            return {
              success: false,
              message:
                "An error occurred while approving the roulette campaign",
            };
          }
          campaign.status = "APPROVED";
          await campaign.save();
          return {
            success: true,
            message: "Successfully approved roulette campaign",
            campaign,
          };
        } catch (error) {
          console.log("Error approving roulette campaign", error);
          return {
            success: false,
            message: "Failed to approve roulette campaign",
          };
        }
      }
    ),
    rejectRouletteCampaign: requireAdmin(
      async (
        _: any,
        { id, rejectionReason }: { id: string; rejectionReason: string },
        context: AuthContext
      ) => {
        try {
          const campaign = await RouletteCampaign.findById(id);
          if (!campaign) {
            return {
              success: false,
              message:
                "An error occurred while rejecting the roulette campaign",
            };
          }
          campaign.status = "REJECTED";
          campaign.rejectionReason = rejectionReason;
          await campaign.save();
          return {
            success: true,
            message: "Successfully rejected roulette campaign",
            campaign,
          };
        } catch (error) {
          console.log("Error rejecting roulette campaign", error);
          return {
            success: false,
            message: "Failed to reject roulette campaign",
          };
        }
      }
    ),
  },
};
