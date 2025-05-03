import cloudinary from "../config/cloudinary";

export const uploadImageToCloudinary = async (logo: string, folder: string) => {
  const response = await cloudinary.uploader.upload(logo, {
    folder: folder,
  });
  return response.secure_url;
};
