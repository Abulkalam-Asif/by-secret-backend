import { User } from "../../models/User";
import bcryptjs from "bcryptjs";

export const userResolver = {
  Query: {},
  Mutation: {
    createUser: async (
      _: any,
      {
        fullName,
        email,
        password,
        isActive,
      }: {
        fullName: string;
        email: string;
        password: string;
        isActive: boolean;
      }
    ) => {
      try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (user) {
          return {
            success: false,
            message: "User already exists",
          };
        }

        const hashedPassword = await bcryptjs.hash(password, 10);

        // Create new user
        const newUser = new User({
          fullName,
          email,
          password: hashedPassword,
          isActive,
        });
        await newUser.save();

        return {
          success: true,
          message: "User created successfully",
        };
      } catch (error) {
        console.log("Error creating user", error);
        return {
          success: false,
          message: "Error creating user",
        };
      }
    },
  },
};
