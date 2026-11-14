import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema(
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
      required: [true, "Organization name is required"],
      trim: true,
    },
    categoryIds: {
      type: [String],
      default: ["pothole", "other"],
    },
    categoryLabels: {
      type: [String],
      default: ["Road Damage & Pothole"],
    },
    state: {
      type: String,
      required: true,
      default: "Delhi",
      index: true,
    },
    city: {
      type: String,
      required: true,
      default: "New Delhi",
      index: true,
    },
    district: {
      type: String,
      default: "",
    },
    serviceArea: {
      type: String,
      default: "Metropolitan Region",
    },
    jurisdictionRadiusKm: {
      type: Number,
      default: 35,
    },
    centerCoords: {
      lat: {
        type: Number,
        default: 28.6139,
      },
      lng: {
        type: Number,
        default: 77.2090,
      },
    },
    activeWorkers: {
      type: Number,
      default: 25,
    },
    slaRating: {
      type: String,
      default: "94%",
    },
    phone: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      enum: ["MUNICIPAL", "STATE_AGENCY", "PRIVATE_CONTRACTOR", "EMERGENCY_CORPS"],
      default: "MUNICIPAL",
    },
    headOfOrg: {
      type: String,
      default: "Chief Engineer / Director",
    },
    department: {
      type: String,
      default: "Public Works Department (PWD)",
    },
    isActive: {
      type: Boolean,
      default: true,
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

export const Organization = mongoose.model("Organization", organizationSchema);
export default Organization;
