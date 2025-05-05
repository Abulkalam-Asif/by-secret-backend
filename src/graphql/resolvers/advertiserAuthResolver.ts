import { Advertiser } from "../../models/Advertiser";
import transporter from "../../config/nodemailer";
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
        // Check if advertiser exists
        const advertiser = await Advertiser.findOne({ email });
        if (advertiser) {
          // If advertiser exists but has not completed step 3
          if (!advertiser.password) {
            advertiser.companyName = companyName;
            advertiser.fullContactName = fullContactName;
            await advertiser.save();
            await sendConfirmationEmail(email);
            return {
              success: true,
              message: "Step 1 completed",
            };
          }
          // If advertiser exists and has completed step 3
          return {
            success: false,
            message: "Advertiser with this email already exists",
          };
        }

        // Create advertiser
        await Advertiser.create({
          companyName,
          fullContactName,
          email,
        });

        console.log("Advertiser created. Sending confirmation email");
        // Send confirmation email
        await sendConfirmationEmail(email);
        console.log("Email sent");

        return { success: true, message: "Step 1 completed" };
      } catch (error) {
        console.log("Error submitting advertiser step 1", error);
        return { success: false, message: "Error registering advertiser" };
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
  const secret = process.env.JWT_SECRET;
  const frontendUrl = process.env.FRONTEND_URL;
  if (!secret) throw new Error("JWT secret is not defined");
  const token = new jose.SignJWT({
    email,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h");

  const signedToken = await token.sign(new TextEncoder().encode(secret));

  const link = `${frontendUrl}/advertiser-register?step=3&token=${signedToken}`;
  console.log("For email: ", signedToken, link, process.env.NODEMAILER_USER);
  await transporter.sendMail({
    from: process.env.NODEMAILER_USER,
    to: email,
    subject: "Advertiser Registration",
    text: `Click on the link to confirm your email: ${link}`,
  });
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
