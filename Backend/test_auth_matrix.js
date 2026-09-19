import http from "http";
import mongoose from "mongoose";
import app, { isAllowedOrigin } from "./src/app.js";
import User from "./src/models/User.js";
import Department from "./src/models/Department.js";
import Organization from "./src/models/Organization.js";
import Issue from "./src/models/Issue.js";
import Repair from "./src/models/Repair.js";
import Review from "./src/models/Review.js";
import analyticsService from "./src/services/analytics.service.js";
import issueService from "./src/services/issue.service.js";
import authService from "./src/services/auth.service.js";
import repairVerificationService from "./src/services/repairVerification.service.js";
import { generateToken } from "./src/utils/generateToken.js";
import { ENV } from "./src/config/env.js";

// Mock User database
const mockUsers = {
  adminUser: {
    _id: new mongoose.Types.ObjectId("65f1a1b2c3d4e5f6a7b8c9d0"),
    id: "65f1a1b2c3d4e5f6a7b8c9d0",
    name: "Admin User",
    email: "admin@civicvision.gov.in",
    role: "admin",
    isActive: true,
    phone: "+91 98765 43210",
  },
  workerUser: {
    _id: new mongoose.Types.ObjectId("65f1a1b2c3d4e5f6a7b8c9d1"),
    id: "65f1a1b2c3d4e5f6a7b8c9d1",
    name: "Worker User",
    email: "worker@civicvision.gov.in",
    role: "worker",
    isActive: true,
    contractorUnit: "Delhi PWD Unit 1",
    organizationName: "Delhi PWD",
    organization: new mongoose.Types.ObjectId("65f1a1b2c3d4e5f6a7b8c9e1"),
    zone: "North Zone, Delhi NCR",
    skills: ["Asphalt Paving", "Crack Sealing"],
    civicPoints: 0,
    reputationScore: 100,
  },
  citizenUser: {
    _id: new mongoose.Types.ObjectId("65f1a1b2c3d4e5f6a7b8c9d2"),
    id: "65f1a1b2c3d4e5f6a7b8c9d2",
    name: "Citizen User",
    email: "citizen@gmail.com",
    role: "citizen",
    isActive: true,
    civicPoints: 50,
    reputationScore: 50,
    phone: "+91 98123 45678",
    zone: "North Zone, Delhi NCR",
  },
  suspendedUser: {
    _id: new mongoose.Types.ObjectId("65f1a1b2c3d4e5f6a7b8c9d3"),
    id: "65f1a1b2c3d4e5f6a7b8c9d3",
    name: "Suspended User",
    email: "suspended@gmail.com",
    role: "citizen",
    isActive: false,
  },
};

// Stub User queries
User.findById = function (id) {
  const idStr = String(id);
  const found = Object.values(mockUsers).find((u) => String(u._id) === idStr || u.id === idStr);
  return {
    select: () => Promise.resolve(found ? { ...found } : null),
  };
};

User.findOne = function (query) {
  if (query.email) {
    const cleanEmail = query.email.toLowerCase();
    const found = Object.values(mockUsers).find((u) => u.email.toLowerCase() === cleanEmail);
    return {
      select: () => Promise.resolve(found ? { ...found, comparePassword: async () => true } : null),
      then: (resolve) => resolve(found ? { ...found } : null),
    };
  }
  return Promise.resolve(null);
};

User.findByIdAndUpdate = function (id, update, options) {
  const idStr = String(id);
  const found = Object.values(mockUsers).find((u) => String(u._id) === idStr || u.id === idStr);
  if (!found) return { select: () => Promise.resolve(null) };

  const updated = { ...found };
  if (update.$set) {
    Object.assign(updated, update.$set);
  }
  if (update.$inc) {
    for (const [key, val] of Object.entries(update.$inc)) {
      updated[key] = (updated[key] || 0) + val;
    }
  }
  return {
    select: () => Promise.resolve(updated),
    then: (resolve) => resolve(updated),
  };
};

User.create = async (data) => {
  const newId = new mongoose.Types.ObjectId();
  const created = {
    _id: newId,
    id: String(newId),
    ...data,
  };
  return created;
};

// Stub Department & Organization
Department.find = () => ({ lean: () => Promise.resolve([{ id: "pwd", name: "Public Works Dept" }]) });
Organization.find = () => ({ lean: () => Promise.resolve([{ id: "org-1", name: "Delhi PWD" }]) });
Organization.findOne = () => Promise.resolve({ id: "org-1", name: "Delhi PWD" });
Organization.create = async (data) => data;
const createChainableQuery = (data = []) => {
  const query = {
    sort: () => query,
    populate: () => query,
    select: () => query,
    lean: () => Promise.resolve(data),
    then: (resolve) => resolve(data),
  };
  return query;
};

Review.find = () => createChainableQuery([]);
Review.create = async (data) => data;
Issue.find = () => createChainableQuery([]);

// Stub analytical & issue service methods for base routing tests
analyticsService.getDashboardStats = async () => ({ totalIssues: 10, resolvedCount: 8 });
analyticsService.getRiskPredictionData = async () => ({ highRiskZones: [] });
analyticsService.getIssueTrends = async () => [];
analyticsService.getSeverityBreakdown = async () => [];
analyticsService.getCategoryBreakdown = async () => [];
analyticsService.getDepartmentWorkload = async () => [];

const originalFindIssue = issueService.findIssueByIdOrCustomId;
issueService.findIssueByIdOrCustomId = async (id) => {
  if (id === "ISS-RESOLVED") {
    return {
      _id: new mongoose.Types.ObjectId("65f1a1b2c3d4e5f6a7b8c9d5"),
      id: "ISS-RESOLVED",
      customId: "ISS-RESOLVED",
      status: "RESOLVED",
      assignedOrgName: "Delhi PWD",
      assignedOrgId: "org-1",
      timeline: [],
      save: async () => {},
    };
  }
  if (id === "ISS-OTHER-ORG") {
    return {
      _id: new mongoose.Types.ObjectId("65f1a1b2c3d4e5f6a7b8c9d6"),
      id: "ISS-OTHER-ORG",
      customId: "ISS-OTHER-ORG",
      status: "ASSIGNED",
      assignedOrgName: "Mumbai Municipal Corporation",
      assignedOrgId: "org-mumbai",
      responsibleName: "Mumbai Engineer",
      timeline: [],
      save: async () => {},
    };
  }
  return {
    _id: new mongoose.Types.ObjectId("65f1a1b2c3d4e5f6a7b8c9d4"),
    id,
    customId: id,
    status: "VERIFIED",
    assignedOrgName: "Delhi PWD",
    assignedOrgId: "org-1",
    location: { lat: 28.6139, lng: 77.2090, zone: "North Zone, Delhi NCR" },
    timeline: [],
    save: async () => {},
  };
};

issueService.getIssueById = async (id) => ({ id, title: "Test Issue", status: "VERIFIED" });
issueService.updateIssueStatus = async (id, status) => ({ id, status });
issueService.assignIssueToOrganization = async (id, orgId) => ({ id, assignedOrgId: orgId });
issueService.acceptWorkAsOrganization = async (id) => ({ id, status: "IN_PROGRESS" });
issueService.acceptWorkAsVolunteer = async (id) => ({ id, status: "IN_PROGRESS" });
issueService.startWorkerTask = async (id) => ({ id, status: "IN_PROGRESS" });
issueService.deleteIssue = async (id) => ({ success: true, message: `Issue ${id} deleted successfully.` });
issueService.upvoteIssue = async (id, userKey) => ({ id, upvotes: 1 });
issueService.addPublicReview = async (id, data, user) => ({ id, reviews: [data] });

repairVerificationService.processWorkerRepairSubmission = async (issue, data, user) => ({
  repair: { id: "rep-1", status: "PENDING", worker: user?._id },
  issue,
});
repairVerificationService.certifyAdminRepair = async (issue) => issue;

const adminToken = generateToken(mockUsers.adminUser._id, "admin");
const workerToken = generateToken(mockUsers.workerUser._id, "worker");
const citizenToken = generateToken(mockUsers.citizenUser._id, "citizen");
const suspendedToken = generateToken(mockUsers.suspendedUser._id, "citizen");

const server = http.createServer(app);

async function request(method, path, token = null, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "127.0.0.1",
      port: 5099,
      path,
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };
    if (token) {
      options.headers["Authorization"] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, body: data ? JSON.parse(data) : {} });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, rawBody: data });
        }
      });
    });

    req.on("error", reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

async function runTests() {
  await new Promise((res) => server.listen(5099, "127.0.0.1", res));
  console.log("\n🚀 Starting Comprehensive Security Hardening & Authorization Test Suite...\n");

  // ==========================================
  // 1. PUBLIC REGISTRATION HARDENING
  // ==========================================
  console.log("--- 1. PUBLIC REGISTRATION HARDENING ---");

  // Citizen registration -> Allowed (201)
  const regCitizen = await request("POST", "/api/auth/register", null, {
    name: "New Citizen",
    email: "newcitizen@example.com",
    password: "password123",
    role: "citizen",
  });
  assert(regCitizen.status === 201, `Public Citizen registration allowed -> 201 (got ${regCitizen.status})`);
  assert(regCitizen.body?.user?.role === "citizen", `Registered citizen user role is 'citizen'`);

  // Default without role -> Allowed as Citizen (201)
  const regDefault = await request("POST", "/api/auth/register", null, {
    name: "Default Citizen",
    email: "defaultcitizen@example.com",
    password: "password123",
  });
  assert(regDefault.status === 201, `Registration omitting role defaults to citizen -> 201 (got ${regDefault.status})`);
  assert(regDefault.body?.user?.role === "citizen", `Registered user role is 'citizen' (got ${regDefault.body?.user?.role})`);

  // Public Individual Worker registration -> Allowed (201)
  const regWorkerInd = await request("POST", "/api/auth/register", null, {
    name: "Individual Worker",
    email: "indworker@example.com",
    password: "password123",
    role: "worker",
    workerType: "individual",
    zone: "North Zone, Delhi NCR",
  });
  assert(regWorkerInd.status === 201, `Public Individual Worker registration allowed -> 201 (got ${regWorkerInd.status})`);
  assert(regWorkerInd.body?.user?.role === "worker", `Registered worker role is 'worker'`);
  assert(regWorkerInd.body?.user?.workerType === "individual", `Registered worker workerType is 'individual'`);

  // Public Organization Worker registration -> Allowed (201)
  const regWorkerOrg = await request("POST", "/api/auth/register", null, {
    name: "Contractor Rep",
    email: "contractor@example.com",
    password: "password123",
    role: "worker",
    workerType: "organization",
    organizationName: "Apex Road Infrastructure",
    zone: "Central Zone, Delhi NCR",
  });
  assert(regWorkerOrg.status === 201, `Public Organization Worker registration allowed -> 201 (got ${regWorkerOrg.status})`);
  assert(regWorkerOrg.body?.user?.role === "worker", `Registered contractor role is 'worker'`);
  assert(regWorkerOrg.body?.user?.workerType === "organization", `Registered contractor workerType is 'organization'`);
  assert(regWorkerOrg.body?.user?.organizationName === "Apex Road Infrastructure", `Registered contractor has organizationName`);

  // Public Organization Worker registration without org name -> Rejected (400)
  const regWorkerOrgInvalid = await request("POST", "/api/auth/register", null, {
    name: "Invalid Contractor",
    email: "invalidcontractor@example.com",
    password: "password123",
    role: "worker",
    workerType: "organization",
    organizationName: "",
  });
  assert(regWorkerOrgInvalid.status === 400, `Organization registration without org name rejected -> 400 (got ${regWorkerOrgInvalid.status})`);

  // Public Admin registration -> Rejected (400)
  const regAdmin = await request("POST", "/api/auth/register", null, {
    name: "Malicious Admin",
    email: "badadmin@example.com",
    password: "password123",
    role: "admin",
  });
  assert(regAdmin.status === 400, `Public Admin registration rejected -> 400 (got ${regAdmin.status})`);

  // Unknown/arbitrary privileged role -> Rejected (400)
  const regSuper = await request("POST", "/api/auth/register", null, {
    name: "Super User",
    email: "superuser@example.com",
    password: "password123",
    role: "superadmin",
  });
  assert(regSuper.status === 400, `Arbitrary privileged role rejected -> 400 (got ${regSuper.status})`);

  // ==========================================
  // 2. PROFILE MASS ASSIGNMENT PROTECTION
  // ==========================================
  console.log("\n--- 2. PROFILE MASS ASSIGNMENT PROTECTION ---");

  // Citizen attempting mass assignment of privileged fields
  const massAssignCitizen = await request("PUT", "/api/auth/profile", citizenToken, {
    name: "Updated Citizen Name",
    phone: "+91 99999 11111",
    role: "admin",
    isActive: false,
    civicPoints: 999999,
    reputationScore: 999999,
    organization: "65f1a1b2c3d4e5f6a7b8c9e1",
    organizationName: "Fake Org",
    contractorUnit: "Secret Unit",
  });
  assert(massAssignCitizen.status === 200, `Citizen profile update returns 200 (got ${massAssignCitizen.status})`);
  assert(massAssignCitizen.body?.user?.name === "Updated Citizen Name", `Legitimate field 'name' updated (got ${massAssignCitizen.body?.user?.name})`);
  assert(massAssignCitizen.body?.user?.role === "citizen", `Role cannot be elevated via profile update (got ${massAssignCitizen.body?.user?.role})`);
  assert(massAssignCitizen.body?.user?.civicPoints === 50, `civicPoints cannot be manipulated (got ${massAssignCitizen.body?.user?.civicPoints})`);
  assert(massAssignCitizen.body?.user?.reputationScore === 50, `reputationScore cannot be manipulated (got ${massAssignCitizen.body?.user?.reputationScore})`);

  // ==========================================
  // 3. WORKER REPAIR IDOR & ASSIGNMENT VERIFICATION
  // ==========================================
  console.log("\n--- 3. WORKER REPAIR IDOR & ASSIGNMENT VERIFICATION ---");

  // Worker submitting repair on issue assigned to another contractor -> 403 Forbidden
  const repairOtherOrg = await request("POST", "/api/issues/ISS-OTHER-ORG/worker-repair", workerToken, {
    repairImageUrl: "data:image/jpeg;base64,sampleimagedata123",
    capturedAt: new Date().toISOString(),
  });
  assert(repairOtherOrg.status === 403, `Worker repair on other org issue rejected -> 403 (got ${repairOtherOrg.status})`);

  // Worker submitting repair on already resolved issue -> 400 Bad Request
  const repairResolved = await request("POST", "/api/issues/ISS-RESOLVED/worker-repair", workerToken, {
    repairImageUrl: "data:image/jpeg;base64,sampleimagedata123",
    capturedAt: new Date().toISOString(),
  });
  assert(repairResolved.status === 400, `Worker repair on resolved issue rejected -> 400 (got ${repairResolved.status})`);

  // Valid worker repair on authorized issue -> 200
  const repairValid = await request("POST", "/api/issues/ISS-001/worker-repair", workerToken, {
    repairImageUrl: "data:image/jpeg;base64,sampleimagedata123",
    capturedAt: new Date().toISOString(),
  });
  assert(repairValid.status === 200, `Worker repair on authorized issue succeeds -> 200 (got ${repairValid.status})`);

  // ==========================================
  // 4. ADMIN WORKER PROVISIONING
  // ==========================================
  console.log("\n--- 4. ADMIN WORKER PROVISIONING ---");

  // Admin provisioning a worker -> Allowed (201)
  const provAdmin = await request("POST", "/api/admin/workers", adminToken, {
    name: "Field Technician 1",
    email: "fieldtech1@civicvision.gov.in",
    password: "securepassword123",
    contractorUnit: "Delhi PWD Unit 2",
    zone: "North Zone, Delhi NCR",
  });
  assert(provAdmin.status === 201, `Admin can provision worker accounts -> 201 (got ${provAdmin.status})`);
  assert(provAdmin.body?.worker?.role === "worker", `Provisioned account has role 'worker' (got ${provAdmin.body?.worker?.role})`);

  // Citizen attempting to call worker provisioning -> 403 Forbidden
  const provCitizen = await request("POST", "/api/admin/workers", citizenToken, {
    name: "Unauthorized Worker",
    email: "unauth@civicvision.gov.in",
    password: "securepassword123",
  });
  assert(provCitizen.status === 403, `Citizen cannot call worker provisioning -> 403 (got ${provCitizen.status})`);

  // Anonymous worker provisioning -> 401
  const provAnon = await request("POST", "/api/admin/workers", null, {
    name: "Anon Worker",
    email: "anon@civicvision.gov.in",
    password: "securepassword123",
  });
  assert(provAnon.status === 401, `Anonymous worker provisioning rejected -> 401 (got ${provAnon.status})`);

  // ==========================================
  // 5. CORS ORIGIN ALLOWLIST ENFORCEMENT
  // ==========================================
  console.log("\n--- 5. CORS SECURITY ---");
  assert(isAllowedOrigin(ENV.CLIENT_URL) === true, `Trusted CLIENT_URL is allowed in CORS`);
  assert(isAllowedOrigin("http://localhost:5173") === true, `Local development origin is allowed in CORS`);
  assert(isAllowedOrigin("http://evil-attacker.com") === false, `Untrusted origin is rejected in CORS`);

  // ==========================================
  // 6. AI ENDPOINTS RATE LIMITING & SECURITY
  // ==========================================
  console.log("\n--- 6. AI ENDPOINTS VALIDATION & SECURITY ---");

  // AI analyze missing image -> 400
  const aiAnalyzeEmpty = await request("POST", "/api/ai/analyze", citizenToken, {});
  assert(aiAnalyzeEmpty.status === 400, `POST /api/ai/analyze without image returns 400 (got ${aiAnalyzeEmpty.status})`);

  // AI check duplicates with invalid lat/lng -> 400
  const aiDupInvalid = await request("POST", "/api/ai/check-duplicates", null, { lat: 999, lng: 999 });
  assert(aiDupInvalid.status === 400, `POST /api/ai/check-duplicates with invalid coords returns 400 (got ${aiDupInvalid.status})`);

  // AI verify repair without authentication -> 401
  const aiVerifyAnon = await request("POST", "/api/ai/verify-repair", null, { beforeUrl: "url1", afterUrl: "url2" });
  assert(aiVerifyAnon.status === 401, `POST /api/ai/verify-repair without auth returns 401 (got ${aiVerifyAnon.status})`);

  // AI verify repair with auth -> 200
  const aiVerifyAuth = await request("POST", "/api/ai/verify-repair", adminToken, { beforeUrl: "url1", afterUrl: "url2" });
  assert(aiVerifyAuth.status === 200, `POST /api/ai/verify-repair with auth returns 200 (got ${aiVerifyAuth.status})`);

  // ==========================================
  // 7. ROUTE AUTHORIZATION MATRIX (ALL ROUTES)
  // ==========================================
  console.log("\n--- 7. ADMIN ROUTES (/api/admin and /admin) ---");
  const adminEndpoints = [
    { method: "GET", path: "/api/admin/stats" },
    { method: "GET", path: "/admin/stats" },
    { method: "GET", path: "/api/admin/departments" },
    { method: "GET", path: "/admin/departments" },
    { method: "POST", path: "/api/admin/assign", body: { issueId: "123", departmentId: "pwd" } },
    { method: "POST", path: "/admin/assign", body: { issueId: "123", departmentId: "pwd" } },
    { method: "GET", path: "/api/admin/risk-predictions" },
    { method: "GET", path: "/admin/risk-predictions" },
  ];

  for (const ep of adminEndpoints) {
    const resAnon = await request(ep.method, ep.path, null, ep.body);
    assert(resAnon.status === 401, `${ep.method} ${ep.path} -> Anonymous returns 401 (got ${resAnon.status})`);

    const resCitizen = await request(ep.method, ep.path, citizenToken, ep.body);
    assert(resCitizen.status === 403, `${ep.method} ${ep.path} -> Citizen returns 403 (got ${resCitizen.status})`);

    const resWorker = await request(ep.method, ep.path, workerToken, ep.body);
    assert(resWorker.status === 403, `${ep.method} ${ep.path} -> Worker returns 403 (got ${resWorker.status})`);

    const resAdmin = await request(ep.method, ep.path, adminToken, ep.body);
    assert(resAdmin.status === 200, `${ep.method} ${ep.path} -> Admin returns 200 (got ${resAdmin.status})`);
  }

  // ANALYTICS ROUTES
  console.log("\n--- 8. ANALYTICS ROUTES ---");
  const analyticsEndpoints = [
    { method: "GET", path: "/api/analytics/trends" },
    { method: "GET", path: "/analytics/trends" },
    { method: "GET", path: "/api/analytics/severity-breakdown" },
    { method: "GET", path: "/analytics/severity-breakdown" },
    { method: "GET", path: "/api/analytics/category-breakdown" },
    { method: "GET", path: "/analytics/category-breakdown" },
    { method: "GET", path: "/api/analytics/department-workload" },
    { method: "GET", path: "/analytics/department-workload" },
  ];

  for (const ep of analyticsEndpoints) {
    const resAnon = await request(ep.method, ep.path);
    assert(resAnon.status === 401, `${ep.method} ${ep.path} -> Anonymous returns 401 (got ${resAnon.status})`);

    const resCitizen = await request(ep.method, ep.path, citizenToken);
    assert(resCitizen.status === 403, `${ep.method} ${ep.path} -> Citizen returns 403 (got ${resCitizen.status})`);

    const resWorker = await request(ep.method, ep.path, workerToken);
    assert(resWorker.status === 403, `${ep.method} ${ep.path} -> Worker returns 403 (got ${resWorker.status})`);

    const resAdmin = await request(ep.method, ep.path, adminToken);
    assert(resAdmin.status === 200, `${ep.method} ${ep.path} -> Admin returns 200 (got ${resAdmin.status})`);
  }

  // WORKER ROUTES
  console.log("\n--- 9. WORKER ROUTES ---");
  const workerEndpoints = [
    { method: "GET", path: "/api/worker/assigned-issues" },
    { method: "GET", path: "/worker/assigned-issues" },
    { method: "GET", path: "/api/worker/profile" },
    { method: "GET", path: "/worker/profile" },
    { method: "POST", path: "/api/worker/repair", body: { issueId: "ISS-001", repairImageUrl: "http://example.com/img.jpg", capturedAt: new Date().toISOString() } },
    { method: "POST", path: "/worker/repair", body: { issueId: "ISS-001", repairImageUrl: "http://example.com/img.jpg", capturedAt: new Date().toISOString() } },
  ];

  for (const ep of workerEndpoints) {
    const resAnon = await request(ep.method, ep.path, null, ep.body);
    assert(resAnon.status === 401, `${ep.method} ${ep.path} -> Anonymous returns 401 (got ${resAnon.status})`);

    const resCitizen = await request(ep.method, ep.path, citizenToken, ep.body);
    assert(resCitizen.status === 403, `${ep.method} ${ep.path} -> Citizen returns 403 (got ${resCitizen.status})`);

    const resWorker = await request(ep.method, ep.path, workerToken, ep.body);
    assert(resWorker.status === 200, `${ep.method} ${ep.path} -> Worker returns 200 (got ${resWorker.status})`);

    const resAdmin = await request(ep.method, ep.path, adminToken, ep.body);
    assert(resAdmin.status === 200, `${ep.method} ${ep.path} -> Admin returns 200 (got ${resAdmin.status})`);
  }

  // PRIVILEGED ISSUE MUTATIONS
  console.log("\n--- 10. PRIVILEGED ISSUE MUTATIONS ---");
  const adminIssueEndpoints = [
    { method: "DELETE", path: "/api/issues/ISS-001" },
    { method: "PATCH", path: "/api/issues/ISS-001/status", body: { status: "ASSIGNED" } },
    { method: "POST", path: "/api/issues/ISS-001/assign-organization", body: { organizationId: "org_pwd" } },
    { method: "POST", path: "/api/issues/ISS-001/verify-repair", body: { repairImageUrl: "http://example.com/img.jpg" } },
  ];

  for (const ep of adminIssueEndpoints) {
    const resAnon = await request(ep.method, ep.path, null, ep.body);
    assert(resAnon.status === 401, `${ep.method} ${ep.path} -> Anonymous returns 401 (got ${resAnon.status})`);

    const resCitizen = await request(ep.method, ep.path, citizenToken, ep.body);
    assert(resCitizen.status === 403, `${ep.method} ${ep.path} -> Citizen returns 403 (got ${resCitizen.status})`);

    const resWorker = await request(ep.method, ep.path, workerToken, ep.body);
    assert(resWorker.status === 403, `${ep.method} ${ep.path} -> Worker returns 403 (got ${resWorker.status})`);

    const resAdmin = await request(ep.method, ep.path, adminToken, ep.body);
    assert(resAdmin.status === 200, `${ep.method} ${ep.path} -> Admin returns 200 (got ${resAdmin.status})`);
  }

  // WORKER TASK OPERATIONS
  console.log("\n--- 11. WORKER TASK OPERATIONS ---");
  const workerIssueEndpoints = [
    { method: "POST", path: "/api/issues/ISS-001/accept-org", body: { workerInfo: { name: "Worker" } } },
    { method: "POST", path: "/api/issues/ISS-001/start-work", body: { workerInfo: { name: "Worker" } } },
  ];

  for (const ep of workerIssueEndpoints) {
    const resAnon = await request(ep.method, ep.path, null, ep.body);
    assert(resAnon.status === 401, `${ep.method} ${ep.path} -> Anonymous returns 401 (got ${resAnon.status})`);

    const resCitizen = await request(ep.method, ep.path, citizenToken, ep.body);
    assert(resCitizen.status === 403, `${ep.method} ${ep.path} -> Citizen returns 403 (got ${resCitizen.status})`);

    const resWorker = await request(ep.method, ep.path, workerToken, ep.body);
    assert(resWorker.status === 200, `${ep.method} ${ep.path} -> Worker returns 200 (got ${resWorker.status})`);

    const resAdmin = await request(ep.method, ep.path, adminToken, ep.body);
    assert(resAdmin.status === 200, `${ep.method} ${ep.path} -> Admin returns 200 (got ${resAdmin.status})`);
  }

  // VOLUNTEER ACCEPTANCE
  console.log("\n--- 12. VOLUNTEER ACCEPTANCE ---");
  const volAnon = await request("POST", "/api/issues/ISS-001/accept-volunteer", null, { volunteerInfo: { name: "Volunteer" } });
  assert(volAnon.status === 401, `POST /api/issues/ISS-001/accept-volunteer -> Anonymous returns 401 (got ${volAnon.status})`);

  const volCitizen = await request("POST", "/api/issues/ISS-001/accept-volunteer", citizenToken, { volunteerInfo: { name: "Citizen Volunteer" } });
  assert(volCitizen.status === 200, `POST /api/issues/ISS-001/accept-volunteer -> Citizen returns 200 (got ${volCitizen.status})`);

  const volWorker = await request("POST", "/api/issues/ISS-001/accept-volunteer", workerToken, { volunteerInfo: { name: "Worker Volunteer" } });
  assert(volWorker.status === 200, `POST /api/issues/ISS-001/accept-volunteer -> Worker returns 200 (got ${volWorker.status})`);

  // ORGANIZATION ROUTES
  console.log("\n--- 13. ORGANIZATION ROUTES ---");
  const orgAnonGet = await request("GET", "/api/organizations");
  assert(orgAnonGet.status === 200, `GET /api/organizations -> Anonymous can view 200 (got ${orgAnonGet.status})`);

  const orgAnonPost = await request("POST", "/api/organizations", null, { name: "Test Org", state: "Delhi", city: "New Delhi" });
  assert(orgAnonPost.status === 401, `POST /api/organizations -> Anonymous returns 401 (got ${orgAnonPost.status})`);

  const orgCitizenPost = await request("POST", "/api/organizations", citizenToken, { name: "Test Org", state: "Delhi", city: "New Delhi" });
  assert(orgCitizenPost.status === 403, `POST /api/organizations -> Citizen returns 403 (got ${orgCitizenPost.status})`);

  const orgWorkerPost = await request("POST", "/api/organizations", workerToken, { name: "Test Org", state: "Delhi", city: "New Delhi" });
  assert(orgWorkerPost.status === 403, `POST /api/organizations -> Worker returns 403 (got ${orgWorkerPost.status})`);

  const orgAdminPost = await request("POST", "/api/organizations", adminToken, { name: "Test Org", state: "Delhi", city: "New Delhi" });
  assert(orgAdminPost.status === 201, `POST /api/organizations -> Admin returns 201 Created (got ${orgAdminPost.status})`);

  // REPORT ROUTES
  console.log("\n--- 14. REPORT ROUTES ---");
  const repExportAnon = await request("GET", "/api/reports/export");
  assert(repExportAnon.status === 401, `GET /api/reports/export -> Anonymous returns 401 (got ${repExportAnon.status})`);

  const repExportCitizen = await request("GET", "/api/reports/export", citizenToken);
  assert(repExportCitizen.status === 403, `GET /api/reports/export -> Citizen returns 403 (got ${repExportCitizen.status})`);

  const repExportWorker = await request("GET", "/api/reports/export", workerToken);
  assert(repExportWorker.status === 403, `GET /api/reports/export -> Worker returns 403 (got ${repExportWorker.status})`);

  const repExportAdmin = await request("GET", "/api/reports/export", adminToken);
  assert(repExportAdmin.status === 200, `GET /api/reports/export -> Admin returns 200 (got ${repExportAdmin.status})`);

  // SUSPENDED ACCOUNT CHECK
  console.log("\n--- 15. SUSPENDED ACCOUNT CHECK ---");
  const suspRes = await request("GET", "/api/worker/profile", suspendedToken);
  assert(suspRes.status === 403, `Suspended user returns 403 (got ${suspRes.status})`);

  // PUBLIC / GUEST ENDPOINTS
  console.log("\n--- 16. PUBLIC / GUEST ENDPOINTS ---");
  const healthRes = await request("GET", "/api/health");
  assert(healthRes.status === 200, `GET /api/health -> Public 200 OK (got ${healthRes.status})`);

  const issuesListRes = await request("GET", "/api/issues");
  assert(issuesListRes.status === 200, `GET /api/issues -> Public issues listing 200 (got ${issuesListRes.status})`);

  const reviewsRes = await request("GET", "/api/reviews");
  assert(reviewsRes.status === 200, `GET /api/reviews -> Public reviews 200 (got ${reviewsRes.status})`);

  const upvoteAnon = await request("POST", "/api/issues/ISS-001/upvote");
  assert(upvoteAnon.status === 200, `POST /api/issues/ISS-001/upvote -> Anonymous upvote 200 (got ${upvoteAnon.status})`);

  const upvoteCitizen = await request("POST", "/api/issues/ISS-001/upvote", citizenToken);
  assert(upvoteCitizen.status === 200, `POST /api/issues/ISS-001/upvote -> Citizen upvote 200 (got ${upvoteCitizen.status})`);

  console.log(`\n========================================`);
  console.log(`Summary: ${passed} passed, ${failed} failed.`);
  console.log(`========================================\n`);

  server.close();
  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  server.close();
  process.exit(1);
});
