import { cloudinary } from "./cloudinary.js";

export const uploadTOCloudinary = async (fileBuffer, folder, options = {}) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder, ...options }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      })
      .end(fileBuffer);
  });
};


export const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return null;

  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
};

export const updateCloudinaryImage = async (oldPublicId, newFileBuffer, folder, options = {}) => {
  if (oldPublicId) {
    try {
      await deleteFromCloudinary(oldPublicId);
    } catch (err) {
      console.error("Error deleting old image:", err);
    }
  }
  const result = await uploadTOCloudinary(newFileBuffer, folder, options);
  return result;
};



