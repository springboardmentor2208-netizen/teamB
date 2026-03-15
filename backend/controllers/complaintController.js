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

const normalizeVoteType = (voteType) => {
  if (!voteType) return null;
  const v = voteType.toString().toLowerCase();
  if (v === "up" || v === "upvote") return "upvote";
  if (v === "down" || v === "downvote") return "downvote";
  return null;
};

const toShortVote = (voteType) => {
  if (voteType === "upvote") return "up";
  if (voteType === "downvote") return "down";
  return null;
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
    status: "received",
  });

  res.status(201).json({
    message: "Complaint created successfully",
    data: complaint,
  });
});

export const getAllComplaints = asyncHandler(async (req, res) => {
  const complaints = await Complaint.find()
    .populate("user_id", "name email role")
    .sort({ createdAt: -1 });

  const enriched = await Promise.all(
    complaints.map(async (c) => {
      const voteCounts = await getVoteCounts(c._id);
      const commentCount = await Comment.countDocuments({ complaint_id: c._id });

      return {
        ...c.toObject(),
        upvotes: voteCounts.upvotes,
        downvotes: voteCounts.downvotes,
        commentCount,
      };
    })
  );

  res.status(200).json(enriched);
});

export const getMyComplaints = asyncHandler(async (req, res) => {
  const complaints = await Complaint.find({
    user_id: req.user._id,
  }).sort({ createdAt: -1 });

  const enriched = await Promise.all(
    complaints.map(async (c) => {
      const voteCounts = await getVoteCounts(c._id);
      const userVote = await Vote.findOne({ complaint_id: c._id, user_id: req.user._id });
      const commentCount = await Comment.countDocuments({ complaint_id: c._id });

      return {
        ...c.toObject(),
        upvotes: voteCounts.upvotes,
        downvotes: voteCounts.downvotes,
        userVote: toShortVote(userVote?.vote_type),
        commentCount,
        comments: [],
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
      userVote: toShortVote(userVote?.vote_type),
    },
    comments,
  });
});

export const voteOnComplaint = asyncHandler(async (req, res) => {
  const rawVoteType = req.body.vote_type;
  const vote_type = normalizeVoteType(rawVoteType);

  if (!vote_type) {
    return res.status(400).json({ message: "Invalid vote_type" });
  }

  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) {
    return res.status(404).json({ message: "Complaint not found" });
  }

  const userVotes = await Vote.find({
    complaint_id: complaint._id,
    user_id: req.user._id,
  }).sort({ createdAt: -1 });

  const existingVote = userVotes[0] ?? null;
  if (userVotes.length > 1) {
    const duplicates = userVotes.slice(1).map((v) => v._id);
    await Vote.deleteMany({ _id: { $in: duplicates } });
  }

  let action = "created";

  if (existingVote) {
    if (existingVote.vote_type === vote_type) {
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
      userVote: action === "removed" ? null : toShortVote(vote_type),
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
      userVote: toShortVote(userVote?.vote_type),
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
  const allowedStatuses = ["received", "in_review", "in_progress", "resolved", "closed"];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) {
    return res.status(404).json({ message: "Complaint not found" });
  }

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