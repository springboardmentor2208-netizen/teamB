import { v2 as cloudinary } from "cloudinary";

const connectCloudinary = () => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
    console.log("Cloudinary connected");
  } catch (err) {
    console.error("Cloudinary connection error:", err);
  }
};

export { cloudinary };  //instance object for uploads
export default connectCloudinary; //for server.js