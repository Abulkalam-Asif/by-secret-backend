import { AdminGeneralSettings } from "../../models/AdminGeneralSettings";
import cloudinary from "../../config/cloudinary";
import { requireAdmin } from "../../middleware/resolverMiddleware";

export const generalSettingsResolver = {
  Query: {
    getAdminGeneralSettings: requireAdmin(async () => {
      return await AdminGeneralSettings.findOne();
    }),
  },
  Mutation: {
    updateAdminGeneralSettings: requireAdmin(
      async (
        _: any,
        {
          companyName,
          logo,
          phone,
          email,
          address,
          city,
          state,
          country,
          zipCode,
          stripePublishableKey,
          stripeSecretKey,
          googleMapsApiKey,
          oneLoginPublishableKey,
          oneLoginPrivateKey,
          smtpHost,
          smtpPort,
          smtpUsername,
          smtpPassword,
          smtpFromEmail,
          smtpFromName,
          termsAndConditions,
          privacyPolicy,
        }: any
      ) => {
        try {
          let logoUrl = "";
          const existingSettings = await AdminGeneralSettings.findOne();

          if (logo && logo.startsWith("data:image")) {
            if (
              existingSettings?.logo &&
              typeof existingSettings.logo === "string"
            ) {
              // Extract the public ID of the existing logo and delete it from Cloudinary
              const publicId = existingSettings.logo
                .split("/")
                .pop()
                ?.split(".")[0];
              if (publicId) {
                await cloudinary.uploader.destroy(
                  `by-secret/admin-logos/${publicId}`
                );
              }
            }
            const response = await cloudinary.uploader.upload(logo, {
              folder: "by-secret/admin-logos",
            });
            logoUrl = response.secure_url;
          } else if (
            existingSettings?.logo &&
            typeof existingSettings.logo === "string"
          ) {
            logoUrl = existingSettings.logo; // Retain the existing logo if no new logo is provided
          }

          const settings = await AdminGeneralSettings.findOneAndUpdate(
            {},
            {
              companyName,
              logo: logoUrl,
              phone,
              email,
              address,
              city,
              state,
              country,
              zipCode,
              stripePublishableKey,
              stripeSecretKey,
              googleMapsApiKey,
              oneLoginPublishableKey,
              oneLoginPrivateKey,
              smtpHost,
              smtpPort,
              smtpUsername,
              smtpPassword,
              smtpFromEmail,
              smtpFromName,
              termsAndConditions,
              privacyPolicy,
            },
            {
              new: true,
              upsert: true,
            }
          );

          return {
            success: true,
            message: "Successfully updated admin general settings",
            settings,
          };
        } catch (error) {
          console.error("Error updating admin general settings:", error);
          return {
            success: false,
            message: "Failed to update admin general settings",
            settings: null,
          };
        }
      }
    ),
  },
};
