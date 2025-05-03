import cloudinary from "../config/cloudinary";

export const deleteImageFromCloudinary = async (
  url: string,
  folder: string
) => {
  const publicId = url.split("/").pop()?.split(".")[0];
  const response = await cloudinary.uploader.destroy(`${folder}/${publicId}`);
  return response.result === "ok";
};
