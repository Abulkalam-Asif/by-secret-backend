import { Advertiser } from "../../models/Advertiser";
import getTransporter from "../../config/nodemailer";
import { getSMTPSettings } from "../../utils/getSMTPSettings";
import * as jose from "jose";
import cloudinary from "../../config/cloudinary";
import bcryptjs from "bcryptjs";
import { signJwt } from "../../utils/signJwt";
import { loginAdvertiserValidation } from "../../validations/advertiserAuthValidations";
import { AuthContext } from "../../middleware/authMiddleware";
import { Response } from "express";
import { Request } from "express";
import { verifyJwt } from "../../utils/verifyJwt";
import { requireAdmin } from "../../middleware/resolverMiddleware";
import { uploadImageToCloudinary } from "../../utils/uploadImageToCloudinary";

export const advertiserAuthResolver = {
  Query: {
    authorizeAdvertiser: async (_: any, __: any, context: AuthContext) => {
      const { req }: { req: Request } = context;
      const authToken = req.cookies.authToken;
      if (!authToken) {
        return {
          email: null,
        };
      }

      try {
        const decoded = await verifyJwt(authToken);
        if (!decoded) {
          return {
            email: null,
          };
        }

        // Check if the advertiser exists
        const advertiser = await Advertiser.findOne({
          email: decoded.email,
        });
        if (!advertiser) {
          return {
            email: null,
          };
        }

        return {
          email: advertiser.email,
        };
      } catch (error) {
        console.log("Error authorizing token", error);
        return {
          email: null,
        };
      }
    },
    getAdvertisersCount: requireAdmin(async (_: any, __: any) => {
      try {
        const advertisersCount = await Advertiser.countDocuments({});
        if (advertisersCount === null) {
          return 0;
        }
        return advertisersCount;
      } catch (error) {
        console.log("Error getting advertisers count", error);
        return 0;
      }
    }),
    getAdvertisers: requireAdmin(async (_: any, __: any) => {
      try {
        const advertisers = await Advertiser.find({});
        if (!advertisers) {
          return [];
        }
        return advertisers.map((advertiser) => ({
          id: advertiser._id,
          companyName: advertiser.companyName,
          fullContactName: advertiser.fullContactName,
          email: advertiser.email,
          phone: advertiser.phone,
          address: advertiser.address,
          logo: advertiser.logo,
        }));
      } catch (error) {
        console.log("Error getting advertisers", error);
        return [];
      }
    }),
  },
  Mutation: {
    loginAdvertiser: async (
      _: any,
      { email, password }: any,
      context: AuthContext
    ) => {
      const loginError = loginAdvertiserValidation(email, password);
      if (loginError) {
        return {
          success: false,
          message: loginError,
        };
      }

      const { res }: { res: Response } = context;

      try {
        // Check if the advertiser exists
        const advertiser = await Advertiser.findOne({ email });
        if (!advertiser) {
          return {
            success: false,
            message: "Invalid email or password",
          };
        }

        // If the advertiser password is not set, it means that the advertiser is not verified
        if (!advertiser.password) {
          return {
            success: false,
            message:
              "Advertiser not verified. Please check your email for verification link",
          };
        }

        const isMatch = await advertiser.comparePassword(password);
        if (!isMatch) {
          return {
            success: false,
            message: "Invalid email or password",
          };
        }

        // Sign JWT token
        const authToken = await signJwt(email);

        // Get the frontend URL for CORS settings
        const frontendUrl = process.env.FRONTEND_URL as string;

        // Check if we're using HTTPS in production
        const isSecure = frontendUrl.startsWith("https://");

        // Extract domain for cookie settings
        let domain;
        try {
          // Extract domain from frontend URL if it's not localhost
          const urlObj = new URL(frontendUrl);
          domain =
            urlObj.hostname !== "localhost" ? urlObj.hostname : undefined;
        } catch (e) {
          console.log("Error parsing frontend URL", e);
        }

        // Return authToken
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Allow-Origin", frontendUrl);
        res.cookie("authToken", authToken, {
          httpOnly: true,
          secure: isSecure, // Set to true if using HTTPS
          sameSite: "lax",
          maxAge: 3600000,
          domain: domain,
          path: "/",
        });
        return {
          success: true,
          message: "Login successful",
        };
      } catch (error) {
        console.log("Error logging in advertiser", error);
        return {
          success: false,
          message: "An error occurred while logging in",
        };
      }
    },
    logoutAdvertiser: async (_: any, __: any, context: AuthContext) => {
      const { res }: { res: Response } = context;
      try {
        // Get the frontend URL for CORS settings
        const frontendUrl = process.env.FRONTEND_URL as string;

        // Extract domain for cookie settings
        let domain;
        try {
          // Extract domain from frontend URL if it's not localhost
          const urlObj = new URL(frontendUrl);
          domain =
            urlObj.hostname !== "localhost" ? urlObj.hostname : undefined;
        } catch (e) {
          console.log("Error parsing frontend URL", e);
        }

        // Clear the auth cookie
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Allow-Origin", frontendUrl);
        res.clearCookie("authToken", {
          httpOnly: true,
          secure: frontendUrl.startsWith("https://"),
          sameSite: "lax",
          path: "/",
          domain: domain,
        });

        return {
          success: true,
          message: "Logout successful",
        };
      } catch (error) {
        console.log("Error logging out advertiser", error);
        return {
          success: false,
          message: "An error occurred while logging out",
        };
      }
    },
    submitAdvertiserStep1: async (
      _: any,
      { companyName, fullContactName, email }: any
    ) => {
      try {
        // Validate input parameters
        if (!companyName || !fullContactName || !email) {
          return {
            success: false,
            message: "Company name, full contact name, and email are required",
          };
        }

        // Check if advertiser exists
        const advertiser = await Advertiser.findOne({ email });
        if (advertiser) {
          // If advertiser exists but has not completed step 3
          if (!advertiser.password) {
            try {
              advertiser.companyName = companyName;
              advertiser.fullContactName = fullContactName;
              await advertiser.save();

              console.log(
                "Existing advertiser updated. Sending confirmation email"
              );
              await sendConfirmationEmail(email);
              console.log("Email sent successfully");

              return {
                success: true,
                message:
                  "Registration details updated. Please check your email for verification link.",
              };
            } catch (emailError) {
              console.error("Error sending confirmation email:", emailError);
              return {
                success: false,
                message:
                  "Registration updated but failed to send verification email. Please contact support.",
              };
            }
          }
          // If advertiser exists and has completed step 3
          return {
            success: false,
            message:
              "An account with this email already exists. Please login instead.",
          };
        }

        // Create new advertiser
        try {
          await Advertiser.create({
            companyName,
            fullContactName,
            email,
          });
          console.log("New advertiser created. Sending confirmation email");
        } catch (createError) {
          console.error("Error creating advertiser:", createError);
          return {
            success: false,
            message: "Failed to create advertiser account. Please try again.",
          };
        }

        // Send confirmation email
        try {
          await sendConfirmationEmail(email);
          console.log("Confirmation email sent successfully");

          return {
            success: true,
            message:
              "Registration successful! Please check your email for verification link.",
          };
        } catch (emailError) {
          console.error("Error sending confirmation email:", emailError);

          // Clean up created advertiser if email failed
          try {
            await Advertiser.deleteOne({ email, password: { $exists: false } });
            console.log("Cleaned up advertiser record due to email failure");
          } catch (cleanupError) {
            console.error("Error cleaning up advertiser record:", cleanupError);
          }

          return {
            success: false,
            message:
              "Account created but failed to send verification email. Please contact support or try again.",
          };
        }
      } catch (error) {
        console.error("Error in submitAdvertiserStep1:", error);

        // Provide more specific error messages based on error type
        if (error instanceof Error) {
          if (error.message.includes("email")) {
            return {
              success: false,
              message: "Invalid email format. Please check and try again.",
            };
          }
          if (
            error.message.includes("duplicate") ||
            error.message.includes("unique")
          ) {
            return {
              success: false,
              message: "An account with this email already exists.",
            };
          }
        }

        return {
          success: false,
          message:
            "An unexpected error occurred during registration. Please try again.",
        };
      }
    },
    submitAdvertiserStep3: async (
      _: any,
      { password, phone, address, logo, token }: any
    ) => {
      let payload;
      try {
        payload = await verifyToken(token);
      } catch (error) {
        console.log("Error verifying token", error);
        return {
          success: false,
          message:
            "Invalid token. Please reclick the email for verification link",
        };
      }
      try {
        const { email } = payload;

        // Check if advertiser exists
        const advertiser = await Advertiser.findOne({ email });
        if (!advertiser) {
          return {
            success: false,
            message:
              "Invalid token. Please reclick the email for verification link",
          };
        }
        if (advertiser && advertiser.password) {
          return {
            success: false,
            message: "Advertiser already registered",
          };
        }

        // Upload logo to cloudinary if it exists
        let logoUrl = "";
        if (logo) {
          logoUrl = await uploadImageToCloudinary(
            logo,
            "by-secret/advertiser-logos"
          );
        }

        const hashedPassword = await bcryptjs.hash(password, 10);

        // Update advertiser
        await Advertiser.findOneAndUpdate(
          {
            email,
          },
          {
            password: hashedPassword,
            phone,
            address,
            logo: logoUrl,
          }
        );

        return { success: true, message: "Step 3 completed" };
      } catch (error) {
        console.log("Error submitting advertiser step 3", error);
        return { success: false, message: "Error registering advertiser" };
      }
    },
  },
};

const sendConfirmationEmail = async (email: string) => {
  try {
    const secret = process.env.JWT_SECRET;
    const frontendUrl = process.env.FRONTEND_URL;

    if (!secret) {
      throw new Error("JWT secret is not defined");
    }

    if (!frontendUrl) {
      throw new Error("Frontend URL is not defined");
    } // Get email sender information and create transporter
    const [smtpSettings, transporter] = await Promise.all([
      getSMTPSettings(),
      getTransporter(),
    ]);
    if (!smtpSettings) {
      throw new Error("Error in SMTP settings");
    }
    if (!transporter) {
      throw new Error("Error creating email transporter");
    }

    // Create JWT token
    const token = new jose.SignJWT({
      email,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1h");

    const signedToken = await token.sign(new TextEncoder().encode(secret));

    const link = `${frontendUrl}/advertiser-register?step=3&token=${signedToken}`;

    console.log("Sending confirmation email to:", email); // Send email with improved HTML template
    await transporter.sendMail({
      from: `${smtpSettings.fromName} <${smtpSettings.fromEmail}>`,
      to: email,
      subject: "Advertiser Registration - Email Verification",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; text-align: center;">Welcome to Epic Platforms Media!</h2>
          <p style="color: #666; font-size: 16px;">Thank you for registering as an advertiser. Please click the button below to complete your registration:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${link}" style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Complete Registration</a>
          </div>
          
          <p style="color: #666; font-size: 14px;">If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p style="color: #007bff; word-break: break-all; font-size: 14px;">${link}</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px;">
              <strong>Important:</strong> This link will expire in 1 hour for security reasons.<br>
              If you didn't request this registration, please ignore this email.
            </p>
          </div>
        </div>
      `,
      text: `Welcome to BySecret Platform! Click on the link to complete your registration: ${link}. This link will expire in 1 hour. If you didn't request this registration, please ignore this email.`,
    });

    console.log("Confirmation email sent successfully to:", email);
  } catch (error) {
    console.error("Error sending confirmation email:", error);

    // Re-throw with more specific error message
    if (error instanceof Error) {
      throw new Error(`Failed to send confirmation email: ${error.message}`);
    } else {
      throw new Error(
        "Failed to send confirmation email due to an unknown error"
      );
    }
  }
};

const verifyToken = async (token: string) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT secret is not defined");

  const { payload } = await jose.jwtVerify(
    token,
    new TextEncoder().encode(secret),
    {
      algorithms: ["HS256"],
    }
  );

  return payload;
};
