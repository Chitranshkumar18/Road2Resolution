import asyncHandler from "../utils/asyncHandler.js";
import Review from "../models/Review.js";
import issueService from "../services/issue.service.js";
import ApiError from "../utils/ApiError.js";

export const getReviews = asyncHandler(async (req, res) => {
  const query = { published: true };
  if (req.query.issueId) {
    const issue = await issueService.findIssueByIdOrCustomId(req.query.issueId);
    if (issue) {
      query.issue = issue._id;
    }
  }

  const reviews = await Review.find(query).sort({ createdAt: -1 }).lean();
  return res.status(200).json(reviews);
});

export const createReview = asyncHandler(async (req, res) => {
  const { issueId, rating, comment, author, tag, role } = req.body;
  if (!issueId) {
    throw new ApiError(400, "Issue ID is required.");
  }

  const updatedIssue = await issueService.addPublicReview(
    issueId,
    {
      author,
      rating,
      comment,
      tag,
      role,
    },
    req.user
  );

  return res.status(201).json({
    success: true,
    message: "Review added successfully.",
    issue: updatedIssue,
  });
});

export default {
  getReviews,
  createReview,
};

