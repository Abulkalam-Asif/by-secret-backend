import { signJwt } from "../../utils/signJwt";
import { verifyJwt } from "../../utils/verifyJwt";
import { Admin } from "../../models/Admin";
import { Response } from "express";

export const adminAuthResolver = {
  Query: {},
  Mutation: {
    loginAdmin: async (
      _: any,
      { username, password }: { username: string; password: string },
      context: any
    ) => {
      const { res }: { res: Response } = context;
      try {
        // Check if admin exists
        const admin = await Admin.findOne({ username });
        if (!admin) {
          return {
            success: false,
            message: "Invalid username or password",
            token: null,
          };
        }

        // Check if password is correct
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
          return {
            success: false,
            message: "Invalid username or password",
            token: null,
          };
        }

        // Sign JWT
        const token = await signJwt(admin.id);

        // Return token
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader(
          "Access-Control-Allow-Origin",
          process.env.FRONTEND_URL as string
        );
        res.cookie("authToken", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 3600000,
        });

        return {
          success: true,
          message: "Successfully logged in",
        };
      } catch (error) {
        console.log("Error logging in", error);
        return {
          success: false,
          message: "Invalid username or password",
          token: null,
        };
      }
    },

    createAdmin: async (
      _: any,
      {
        username,
        password,
        fullName,
        isActive,
      }: {
        username: string;
        password: string;
        fullName: string;
        isActive: boolean;
      }
    ) => {
      try {
        // Checking if admin already exists
        const existingAdmin = await Admin.findOne({ username });
        if (existingAdmin) {
          return {
            success: false,
            message: "An admin with this username already exists",
          };
        }

        // Creating new admin
        const admin = new Admin({
          username,
          password,
          fullName,
          isActive,
        });
        await admin.save();

        return {
          success: true,
          message: "Admin created successfully",
        };
      } catch (error) {
        console.log("Error creating admin", error);
        return {
          success: false,
          message: "An error occurred while creating admin",
        };
      }
    },
    verifyToken: async (_: any, { token }: { token: string }) => {
      try {
        await verifyJwt(token);
        return true;
      } catch (error) {
        return false;
      }
    },
  },
};
