import asyncHandler from "../utils/asyncHandler.js";
import Organization from "../models/Organization.js";
import ApiError from "../utils/ApiError.js";

export const getAllOrganizations = asyncHandler(async (req, res) => {
  const orgs = await Organization.find({ isActive: true }).lean();
  return res.status(200).json(orgs);
});

export const getOrganizationById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const org = await Organization.findOne({
    $or: [{ id }, { _id: mongoose.Types.ObjectId.isValid(id) ? id : null }],
  });

  if (!org) {
    throw new ApiError(404, `Organization with ID '${id}' not found.`);
  }

  return res.status(200).json(org);
});

export const createOrganization = asyncHandler(async (req, res) => {
  const {
    name,
    categoryIds = ["pothole"],
    categoryLabels = ["Road Damage & Pothole"],
    state = "Delhi",
    city = "New Delhi",
    district = "",
    serviceArea = "Metropolitan Area",
    jurisdictionRadiusKm = 35,
    centerCoords = { lat: 28.6139, lng: 77.2090 },
    activeWorkers = 20,
    slaRating = "95%",
    phone = "",
    email = "",
    type = "MUNICIPAL",
    headOfOrg = "Superintending Engineer",
  } = req.body;

  const customId = `org_${state.substring(0, 3).toLowerCase()}_${Date.now()}`;

  const organization = await Organization.create({
    id: req.body.id || customId,
    name,
    categoryIds,
    categoryLabels,
    state,
    city,
    district,
    serviceArea,
    jurisdictionRadiusKm,
    centerCoords,
    activeWorkers,
    slaRating,
    phone,
    email,
    type,
    headOfOrg,
  });

  return res.status(201).json({
    success: true,
    message: "Organization registered successfully.",
    organization,
  });
});

export default {
  getAllOrganizations,
  getOrganizationById,
  createOrganization,
};
