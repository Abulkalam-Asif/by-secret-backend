import { AuthContext } from "../../middleware/authMiddleware";
import {
  requireAdmin,
  requireAdvertiser,
} from "../../middleware/resolverMiddleware";
import { AdsCampaign } from "../../models/AdsCampaign";
import { RouletteCampaign } from "../../models/RouletteCampaign";

export const campaignsCountResolver = {
  Query: {
    // Get ads campaigns count for the advertiser
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
    // Get count for all the ads campaigns in the system
    getAllAdsCampaignsCount: requireAdmin(
      async (_: any, __: any, context: AuthContext) => {
        try {
          const pendingCount = await AdsCampaign.countDocuments({
            status: "PENDING",
          });
          const approvedCount = await AdsCampaign.countDocuments({
            status: "APPROVED",
          });
          const rejectedCount = await AdsCampaign.countDocuments({
            status: "REJECTED",
          });
          return {
            pending: pendingCount,
            approved: approvedCount,
            rejected: rejectedCount,
          };
        } catch (error) {
          console.log("Error getting all ads campaign count", error);
          return null;
        }
      }
    ),
    // Get roulette campaigns count for the advertiser
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
    // Get count for all the roulette campaigns in the system
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
    // Get combined campaigns count for the advertiser
    getCampaignsCount: requireAdvertiser(
      async (_: any, __: any, context: AuthContext) => {
        const advertiser = context.user?._id;
        if (!advertiser) {
          return {
            success: false,
            message: "User not authenticated",
          };
        }
        try {
          const [adsPendingCount, adsApprovedCount, adsRejectedCount] =
            await Promise.all([
              AdsCampaign.countDocuments({ advertiser, status: "PENDING" }),
              AdsCampaign.countDocuments({ advertiser, status: "APPROVED" }),
              AdsCampaign.countDocuments({ advertiser, status: "REJECTED" }),
            ]);

          const [
            roulettePendingCount,
            rouletteApprovedCount,
            rouletteRejectedCount,
          ] = await Promise.all([
            RouletteCampaign.countDocuments({ advertiser, status: "PENDING" }),
            RouletteCampaign.countDocuments({ advertiser, status: "APPROVED" }),
            RouletteCampaign.countDocuments({ advertiser, status: "REJECTED" }),
          ]);

          return {
            pending: adsPendingCount + roulettePendingCount,
            approved: adsApprovedCount + rouletteApprovedCount,
            rejected: adsRejectedCount + rouletteRejectedCount,
          };
        } catch (error) {
          console.log("Error getting combined campaign count", error);
          return null;
        }
      }
    ),

    // Get combined count for all campaigns in the system
    getAllCampaignsCount: requireAdmin(
      async (_: any, __: any, context: AuthContext) => {
        try {
          const [adsPendingCount, adsApprovedCount, adsRejectedCount] =
            await Promise.all([
              AdsCampaign.countDocuments({ status: "PENDING" }),
              AdsCampaign.countDocuments({ status: "APPROVED" }),
              AdsCampaign.countDocuments({ status: "REJECTED" }),
            ]);

          const [
            roulettePendingCount,
            rouletteApprovedCount,
            rouletteRejectedCount,
          ] = await Promise.all([
            RouletteCampaign.countDocuments({ status: "PENDING" }),
            RouletteCampaign.countDocuments({ status: "APPROVED" }),
            RouletteCampaign.countDocuments({ status: "REJECTED" }),
          ]);

          return {
            pending: adsPendingCount + roulettePendingCount,
            approved: adsApprovedCount + rouletteApprovedCount,
            rejected: adsRejectedCount + rouletteRejectedCount,
          };
        } catch (error) {
          console.log("Error getting all combined campaign count", error);
          return null;
        }
      }
    ),
  },
  Mutation: {},
};
