import Complaint from "../models/Complaint.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadTOCloudinary } from "../utils/imageupload/cloudinaryFileHandling.js";



export const createComplaint = asyncHandler(async (req, res) => {
  let photoData = null;


  if (req.file) {
    photoData = await uploadTOCloudinary(req.file.buffer, "complaints", {
      transformation: [{ width: 800, height: 600, crop: "limit" }],
    });
  }

  const complaint = await Complaint.create({
    user_id: req.user._id,
    title: req.body.title,
    description: req.body.description,
    location_coords: {
      lat: parseFloat(req.body.latitude),
      lng: parseFloat(req.body.longitude),
    },
    address: req.body.address,
    photo: photoData?.secure_url,
    photoPublicId: photoData?.public_id,
  });

  res.status(201).json({
    message: "Complaint created successfully",
    data: complaint,
  });
});