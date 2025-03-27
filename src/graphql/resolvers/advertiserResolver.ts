import { Advertiser } from "../../models/Advertiser";
import transporter from "../../config/nodemailer";
import * as jose from "jose";
import cloudinary from "../../config/cloudinary";
import bcryptjs from "bcryptjs";

export const advertiserResolver = {
  Query: {},
  Mutation: {
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
          logoUrl = await uploadLogoToCloudinary(logo);
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

const uploadLogoToCloudinary = async (logo: string) => {
  const response = await cloudinary.uploader.upload(logo, {
    folder: "by-secret/advertiser-logos",
  });
  return response.secure_url;
};
