import mongoose from "mongoose";
import { ISSUE_STATUSES, SEVERITY_LEVELS } from "../utils/constants.js";
import { generateIssueId } from "../utils/helpers.js";

const timelineEntrySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      default: "",
    },
    note: {
      type: String,
      default: "",
    },
    officer: {
      type: String,
      default: "Civic System",
    },
    changedBy: {
      type: String,
      default: "",
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const reviewSubSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: () => `rev_${Date.now()}`,
    },
    author: {
      type: String,
      required: true,
      default: "Community Resident",
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      default: 5,
    },
    comment: {
      type: String,
      required: true,
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
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const issueSchema = new mongoose.Schema(
  {
    customId: {
      type: String,
      unique: true,
      index: true,
      default: () => generateIssueId(),
    },
    title: {
      type: String,
      required: [true, "Issue title is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      default: "pothole",
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(ISSUE_STATUSES),
      default: ISSUE_STATUSES.VERIFIED,
      index: true,
    },
    severity: {
      type: String,
      enum: Object.values(SEVERITY_LEVELS),
      default: SEVERITY_LEVELS.HIGH,
      index: true,
    },
    priorityScore: {
      type: Number,
      default: 75,
      min: 0,
      max: 100,
      index: true,
    },
    aiConfidence: {
      type: Number,
      default: 94.0,
    },
    aiDetection: {
      detectedObjects: {
        type: [String],
        default: ["Civic Infrastructure Anomaly"],
      },
      safetyHazardIndex: {
        type: Number,
        default: 7.0,
      },
      trafficImpactFactor: {
        type: String,
        default: "Moderate",
      },
      suggestedAction: {
        type: String,
        default: "Forwarded to municipal inspection queue.",
      },
    },
    imageUrl: {
      type: String,
      required: [true, "Evidence image is required"],
    },
    location: {
      address: {
        type: String,
        required: [true, "Address is required"],
        default: "Outer Ring Road, New Delhi",
      },
      lat: {
        type: Number,
        required: [true, "Latitude is required"],
        default: 28.6139,
      },
      lng: {
        type: Number,
        required: [true, "Longitude is required"],
        default: 77.2090,
      },
      state: {
        type: String,
        default: "Delhi",
        index: true,
      },
      city: {
        type: String,
        default: "New Delhi",
        index: true,
      },
      district: {
        type: String,
        default: "",
      },
      pincode: {
        type: String,
        default: "",
      },
      landmark: {
        type: String,
        default: "",
      },
      road: {
        type: String,
        default: "",
      },
      area: {
        type: String,
        default: "",
      },
      zone: {
        type: String,
        default: "Municipal Zone",
      },
    },
    reporter: {
      id: { type: String, default: "" },
      _id: { type: String, default: "" },
      name: { type: String, default: "Citizen Reporter" },
      email: { type: String, default: "" },
      avatar: { type: String, default: "" },
      reputation: { type: Number, default: 0 },
    },
    userId: {
      type: String,
      default: "",
      index: true,
    },
    department: {
      type: String,
      default: "Public Works Department (PWD)",
      index: true,
    },
    assignedOfficer: {
      type: String,
      default: "Duty Engineer",
    },
    assignedOrgId: {
      type: String,
      default: "",
      index: true,
    },
    assignedOrgName: {
      type: String,
      default: "",
    },
    responsibleType: {
      type: String,
      enum: ["ORGANIZATION", "PUBLIC_INDIVIDUAL", "DEPARTMENT", "OPEN", "UNASSIGNED"],
      default: "UNASSIGNED",
    },
    responsibleName: {
      type: String,
      default: "",
    },
    responsibleOrgName: {
      type: String,
      default: "",
    },
    workerSubmission: {
      worker: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
      workerId: { type: String, default: "" },
      repairImageUrl: { type: String, default: "" },
      afterImageUrl: { type: String, default: "" },
      notes: { type: String, default: "" },
      materialsUsed: { type: String, default: "" },
      submittedBy: { type: String, default: "ORGANIZATION" },
      isVolunteer: { type: Boolean, default: false },
      organizationName: { type: String, default: "" },
      workerName: { type: String, default: "" },
      workerEmail: { type: String, default: "" },
      contractorUnit: { type: String, default: "" },
      capturedAt: { type: Date, default: null },
      photoValiditySeconds: { type: Number, default: 60 },
      submittedAt: { type: Date, default: null },
      gpsVerification: {
        verified: { type: Boolean, default: true },
        distanceMeters: { type: Number, default: 0 },
        workerLat: { type: Number, default: null },
        workerLng: { type: Number, default: null },
        siteLat: { type: Number, default: null },
        siteLng: { type: Number, default: null },
        accuracy: { type: Number, default: 4.0 },
        autoVerified: { type: Boolean, default: true },
        timestamp: { type: Date, default: null },
      },
    },
    repairAudit: {
      verified: { type: Boolean, default: false },
      verifiedAt: { type: Date, default: null },
      verifiedBy: { type: String, default: "" },
      notes: { type: String, default: "" },
      confidenceScore: { type: Number, default: 97.4 },
      qualityRating: { type: String, default: "Optimal Grade A" },
      hazardEliminated: { type: Boolean, default: true },
      completedByEntity: {
        type: { type: String, default: "ORGANIZATION" },
        name: { type: String, default: "" },
        organizationName: { type: String, default: "" },
      },
    },
    repairVerificationUrl: {
      type: String,
      default: "",
    },
    afterImageUrl: {
      type: String,
      default: "",
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    upvotedBy: {
      type: [String],
      default: [],
    },
    reviews: {
      type: [reviewSubSchema],
      default: [],
    },
    timeline: {
      type: [timelineEntrySchema],
      default: [],
    },
    repairs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Repair",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret.customId || (ret._id ? ret._id.toString() : ret.id);
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret.customId || (ret._id ? ret._id.toString() : ret.id);
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Pre-save to add initial timeline event if new
issueSchema.pre("save", function () {
  if (this.isNew && (!this.timeline || this.timeline.length === 0)) {
    this.timeline.push({
      status: this.status || ISSUE_STATUSES.VERIFIED,
      message: "Civic complaint logged and verified by AI vision scan.",
      note: "Dispatched to municipal control desk.",
      officer: "AI Vision System",
      timestamp: new Date(),
    });
  }
});

export const Issue = mongoose.model("Issue", issueSchema);
export default Issue;
