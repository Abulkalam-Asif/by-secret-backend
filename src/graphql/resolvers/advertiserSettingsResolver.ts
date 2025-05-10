import { Advertiser } from "../../models/Advertiser";
import { requireAdvertiser } from "../../middleware/resolverMiddleware";
import bcryptjs from "bcryptjs";
import { PASSWORD_REGEX } from "../../constants";
import { uploadImageToCloudinary } from "../../utils/uploadImageToCloudinary";
import { deleteImageFromCloudinary } from "../../utils/deleteImageFromCloudinary";

export const advertiserSettingsResolver = {
  Query: {
    getAdvertiserSettings: requireAdvertiser(
      async (_: any, __: any, context: any) => {
        try {
          const advertiser = await Advertiser.findOne({
            email: context.user.email,
          });
          if (!advertiser) {
            throw new Error("Advertiser not found");
          }

          return {
            companyName: advertiser.companyName,
            fullContactName: advertiser.fullContactName,
            phone: advertiser.phone,
            address: advertiser.address,
            logo: advertiser.logo,
          };
        } catch (error) {
          console.error("Error getting advertiser settings:", error);
          throw new Error("Failed to get advertiser settings");
        }
      }
    ),
  },
  Mutation: {
    updateAdvertiserSettings: requireAdvertiser(
      async (
        _: any,
        { companyName, fullContactName, phone, address, logo }: any,
        context: any
      ) => {
        try {
          let logoUrl = "";
          const advertiser = await Advertiser.findOne({
            email: context.user.email,
          });

          if (!advertiser) {
            return {
              success: false,
              message: "Advertiser not found",
            };
          }

          if (logo && logo.startsWith("data:image")) {
            // Delete existing logo if it exists
            if (advertiser.logo) {
              await deleteImageFromCloudinary(
                advertiser.logo,
                "by-secret/advertiser-logos"
              );
            }
            // Upload new logo
            logoUrl = await uploadImageToCloudinary(
              logo,
              "by-secret/advertiser-logos"
            );
          } else if (advertiser.logo) {
            logoUrl = advertiser.logo; // Retain the existing logo if no new logo is provided
          }

          await Advertiser.findOneAndUpdate(
            { email: context.user.email },
            {
              companyName,
              fullContactName,
              phone,
              address,
              logo: logoUrl,
            }
          );

          return {
            success: true,
            message: "Successfully updated advertiser settings",
          };
        } catch (error) {
          console.error("Error updating advertiser settings:", error);
          return {
            success: false,
            message: "Failed to update advertiser settings",
          };
        }
      }
    ),

    changeAdvertiserPassword: requireAdvertiser(
      async (_: any, { currentPassword, newPassword }: any, context: any) => {
        try {
          const advertiser = await Advertiser.findOne({
            email: context.user.email,
          });

          if (!advertiser) {
            return {
              success: false,
              message: "Advertiser not found",
            };
          }

          // Validate current password
          const isMatch = await advertiser.comparePassword(currentPassword);
          if (!isMatch) {
            return {
              success: false,
              message: "Current password is incorrect",
            };
          }

          // Validate new password format
          if (!PASSWORD_REGEX.test(newPassword)) {
            return {
              success: false,
              message: "New password does not meet the requirements",
            };
          }

          // Hash and update new password
          const hashedPassword = await bcryptjs.hash(newPassword, 10);
          await Advertiser.findOneAndUpdate(
            { email: context.user.email },
            { password: hashedPassword }
          );

          return {
            success: true,
            message: "Password successfully changed",
          };
        } catch (error) {
          console.error("Error changing advertiser password:", error);
          return {
            success: false,
            message: "Failed to change password",
          };
        }
      }
    ),
  },
};
