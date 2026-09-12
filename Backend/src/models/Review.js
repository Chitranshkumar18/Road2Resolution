import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    issue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue",
      required: true,
      index: true,
    },
    issueCustomId: {
      type: String,
      default: "",
    },
    author: {
      type: String,
      required: [true, "Author name is required"],
      default: "Community Resident",
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
      default: 5,
    },
    comment: {
      type: String,
      required: [true, "Comment is required"],
      trim: true,
    },
    tag: {
      type: String,
      default: "⚡ Fast Municipal Action",
    },
    role: {
      type: String,
      default: "Public Community Feedback",
    },
    published: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id ? ret._id.toString() : ret.id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id ? ret._id.toString() : ret.id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const Review = mongoose.model("Review", reviewSchema);
export default Review;
