import Complaint from "../models/Complaint.js";
import Vote from "../models/Vote.js";
import Comment from "../models/Comment.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadTOCloudinary } from "../utils/imageupload/cloudinaryFileHandling.js";

const getVoteCounts = async (complaintId) => {
  const [upvotes, downvotes] = await Promise.all([
    Vote.countDocuments({ complaint_id: complaintId, vote_type: "upvote" }),
    Vote.countDocuments({ complaint_id: complaintId, vote_type: "downvote" }),
  ]);
  return { upvotes, downvotes };
};

export const createComplaint = asyncHandler(async (req, res) => {
  let photoData = null;

  if (req.file) {
    photoData = await uploadTOCloudinary(
      req.file.buffer,
      "complaints",
      {
        transformation: [{ width: 800, height: 600, crop: "limit" }],
      }
    );
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
    status: "received", // explicit
  });

  res.status(201).json({
    message: "Complaint created successfully",
    data: complaint,
  });
});

export const getMyComplaints = asyncHandler(async (req, res) => {
  const complaints = await Complaint.find({
    user_id: req.user._id,
  }).sort({ createdAt: -1 });

  // Enrich complaints with vote/comment counts and current user's vote
  const enriched = await Promise.all(
    complaints.map(async (c) => {
      const voteCounts = await getVoteCounts(c._id);
      const userVote = await Vote.findOne({ complaint_id: c._id, user_id: req.user._id });
      const commentCount = await Comment.countDocuments({ complaint_id: c._id });

      return {
        ...c.toObject(),
        upvotes: voteCounts.upvotes,
        downvotes: voteCounts.downvotes,
        userVote: userVote?.vote_type || null,
        commentCount,
        comments: [], // kept for backwards compatibility; actual comments fetched in detail view
      };
    })
  );

  res.status(200).json(enriched);
});

export const getComplaintDetails = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id).populate(
    "user_id",
    "name email role"
  );

  if (!complaint) {
    return res.status(404).json({ message: "Complaint not found" });
  }

  const voteCounts = await getVoteCounts(complaint._id);
  const userVote = await Vote.findOne({
    complaint_id: complaint._id,
    user_id: req.user._id,
  });
  const comments = await Comment.find({ complaint_id: complaint._id })
    .populate("user_id", "name role")
    .sort({ createdAt: -1 });

  res.status(200).json({
    complaint,
    status: complaint.status,
    votes: {
      ...voteCounts,
      userVote: userVote?.vote_type || null,
    },
    comments,
  });
});

export const voteOnComplaint = asyncHandler(async (req, res) => {
  const { vote_type } = req.body;
  const validVotes = ["upvote", "downvote"];

  if (!validVotes.includes(vote_type)) {
    return res.status(400).json({ message: "Invalid vote_type" });
  }

  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) {
    return res.status(404).json({ message: "Complaint not found" });
  }

  const existingVote = await Vote.findOne({
    complaint_id: complaint._id,
    user_id: req.user._id,
  });

  let action = "created";

  if (existingVote) {
    if (existingVote.vote_type === vote_type) {
      // Toggle off
      await existingVote.remove();
      action = "removed";
    } else {
      existingVote.vote_type = vote_type;
      await existingVote.save();
      action = "updated";
    }
  } else {
    await Vote.create({
      complaint_id: complaint._id,
      user_id: req.user._id,
      vote_type,
    });
  }

  const voteCounts = await getVoteCounts(complaint._id);

  res.status(200).json({
    message: `Vote ${action}`,
    votes: {
      ...voteCounts,
      userVote: action === "removed" ? null : vote_type,
    },
  });
});

export const getComplaintVotes = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) {
    return res.status(404).json({ message: "Complaint not found" });
  }

  const voteCounts = await getVoteCounts(complaint._id);
  const userVote = await Vote.findOne({
    complaint_id: complaint._id,
    user_id: req.user._id,
  });

  res.status(200).json({
    votes: {
      ...voteCounts,
      userVote: userVote?.vote_type || null,
    },
  });
});

export const addCommentToComplaint = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content || !content.trim()) {
    return res.status(400).json({ message: "Comment content is required" });
  }

  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) {
    return res.status(404).json({ message: "Complaint not found" });
  }

  const comment = await Comment.create({
    complaint_id: complaint._id,
    user_id: req.user._id,
    content: content.trim(),
  });

  const populatedComment = await Comment.findById(comment._id).populate(
    "user_id",
    "name role"
  );

  res.status(201).json({ message: "Comment added", data: populatedComment });
});

export const getComplaintComments = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) {
    return res.status(404).json({ message: "Complaint not found" });
  }

  const comments = await Comment.find({ complaint_id: complaint._id })
    .populate("user_id", "name role")
    .sort({ createdAt: -1 });

  res.status(200).json({ comments });
});

export const updateComplaintStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const allowedStatuses = ["received", "in_review", "resolved"];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) {
    return res.status(404).json({ message: "Complaint not found" });
  }

  // Only volunteers/admins can update status
  if (!["volunteer", "admin"].includes(req.user.role)) {
    return res.status(403).json({
      message: "Only volunteers or admins can update complaint status",
    });
  }

  complaint.status = status;
  await complaint.save();

  res.status(200).json({
    message: "Complaint status updated",
    status: complaint.status,
  });
});
