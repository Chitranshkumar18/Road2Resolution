import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Department name is required"],
      trim: true,
    },
    head: {
      type: String,
      default: "Duty Superintending Engineer",
      trim: true,
    },
    activeIssues: {
      type: Number,
      default: 0,
    },
    resolvedIssues: {
      type: Number,
      default: 0,
    },
    slaRating: {
      type: String,
      default: "95%",
    },
    categories: {
      type: [String],
      default: [],
    },
    email: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret._id = ret._id ? ret._id.toString() : ret.id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        ret._id = ret._id ? ret._id.toString() : ret.id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const Department = mongoose.model("Department", departmentSchema);
export default Department;
