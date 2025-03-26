import { signJwt } from "../../utils/signJwt";
import { verifyJwt } from "../../utils/verifyJwt";
import { Admin } from "../../models/Admin";

export const adminAuthResolver = {
  Query: {},
  Mutation: {
    loginAdmin: async (
      _: any,
      { username, password }: { username: string; password: string },
      context: any
    ) => {
      const { res } = context;
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
        res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
        res.cookie("authToken", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 3600000,
        });

        return {
          success: true,
          message: "Successfully logged in",
          token,
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

// tempCreateAdmin: async (
//   _: any,
//   { username, password }: { username: string; password: string }
// ) => {
//   try {
//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create the admin
//     const admin = new Admin({
//       username,
//       password: hashedPassword,
//     });

//     // Save the admin
//     await admin.save();

//     return admin;
//   } catch (error) {
//     throw new Error("Error creating admin");
//   }
// },
