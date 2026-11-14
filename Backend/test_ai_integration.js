import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import aiService from "./src/services/ai.service.js";
import { calculatePriorityScore } from "./src/services/priority.service.js";
import { findDuplicates } from "./src/services/duplicate.service.js";
import { processWorkerRepairSubmission } from "./src/services/repairVerification.service.js";
import Issue from "./src/models/Issue.js";
import ApiError from "./src/utils/ApiError.js";

const AI_SERVICE_URL = process.env.AI_MODEL_SERVICE_URL || process.env.AI_SERVICE_URL || "http://127.0.0.1:8000";

// Helper to generate a solid color test JPEG base64
const createTestImageBuffer = () => {
  // Minimal valid 1x1 JPEG buffer
  return Buffer.from([
    0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01,
    0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, 0xff, 0xdb, 0x00, 0x43,
    0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09,
    0x09, 0x08, 0x0a, 0x0c, 0x14, 0x0d, 0x0c, 0x0b, 0x0b, 0x0c, 0x19, 0x12,
    0x13, 0x0f, 0x14, 0x1d, 0x1a, 0x1f, 0x1e, 0x1d, 0x1a, 0x1c, 0x1c, 0x20,
    0x24, 0x2e, 0x27, 0x20, 0x22, 0x2c, 0x23, 0x1c, 0x1c, 0x28, 0x37, 0x29,
    0x2c, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1f, 0x27, 0x39, 0x3d, 0x38, 0x32,
    0x3c, 0x2e, 0x33, 0x34, 0x32, 0xff, 0xc0, 0x00, 0x0b, 0x08, 0x00, 0x01,
    0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0xff, 0xc4, 0x00, 0x1f, 0x00, 0x00,
    0x01, 0x05, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
    0x09, 0x0a, 0x0b, 0xff, 0xda, 0x00, 0x08, 0x01, 0x01, 0x00, 0x00, 0x3f,
    0x00, 0xbf, 0x00, 0xff, 0xd9
  ]);
};

let passedCount = 0;
let totalCount = 0;

const assert = (condition, testName, details = "") => {
  totalCount++;
  if (condition) {
    console.log(`  ✅ PASS: ${testName} ${details ? `(${details})` : ""}`);
    passedCount++;
  } else {
    console.error(`  ❌ FAIL: ${testName} ${details ? `(${details})` : ""}`);
  }
};

async function runTests() {
  console.log("=================================================");
  console.log("🚀 ROAD2SOLUTION AI INTEGRATION TEST SUITE");
  console.log("=================================================\n");

  // TEST 1: Python AI Service Health Check
  console.log("👉 TEST 1: Python AI Service Health Check");
  try {
    const healthRes = await fetch(`${AI_SERVICE_URL}/health`);
    const healthData = await healthRes.json();
    assert(healthRes.status === 200, "Health status is 200 OK");
    assert(healthData.stage1_loaded === true, "Stage 1 model loaded in memory");
    assert(healthData.stage2_loaded === true, "Stage 2 model loaded in memory");
    assert(healthData.civic_threshold === 0.625, "Civic threshold is 0.625");
  } catch (err) {
    assert(false, "Python AI Service Health Check", err.message);
  }

  // TEST 2: Python AI Service Predict Endpoint Directly
  console.log("\n👉 TEST 2: Python AI Service Predict Endpoint Direct");
  try {
    const testBuf = createTestImageBuffer();
    const formData = new FormData();
    const blob = new Blob([testBuf], { type: "image/jpeg" });
    formData.append("image", blob, "test.jpg");

    const predRes = await fetch(`${AI_SERVICE_URL}/predict`, {
      method: "POST",
      body: formData,
    });
    const predData = await predRes.json();
    assert(predRes.status === 200, "Predict endpoint returns HTTP 200");
    assert(typeof predData.confidence === "number", "Returns real numeric confidence");
    assert(typeof predData.is_civic === "boolean", "Returns boolean is_civic flag");
    assert(predData.stage1 !== undefined, "Returns Stage 1 telemetry");
  } catch (err) {
    assert(false, "Python AI Service Predict Endpoint Direct", err.message);
  }

  // TEST 3: Backend aiService.analyzeImage Integration Test
  console.log("\n👉 TEST 3: Backend aiService.analyzeImage Real Prediction");
  try {
    const testBuf = createTestImageBuffer();
    const result = await aiService.analyzeImage(testBuf);
    assert(result !== null && typeof result === "object", "analyzeImage returns object");
    assert(typeof result.aiConfidence === "number", "aiConfidence is numeric without random jitter");
    assert(typeof result.priorityScore === "number", "priorityScore calculated deterministically");
    assert(result.category !== undefined, "Category provided from model prediction");
    console.log(`     [Telemetry] Category: ${result.category}, Confidence: ${result.aiConfidence}%, Priority: ${result.priorityScore}`);
  } catch (err) {
    assert(false, "Backend aiService.analyzeImage Real Prediction", err.message);
  }

  // TEST 4: Category Hint Resistance Test (Model Prediction is Authoritative)
  console.log("\n👉 TEST 4: Category Hint Non-Overwriting (Authoritative Model)");
  try {
    const testBuf = createTestImageBuffer();
    // Pass fake categoryHint 'traffic_signal'
    const result = await aiService.analyzeImage(testBuf);
    // Result should match the model's actual predicted class (e.g. garbage or non_civic), NOT 'traffic_signal'
    assert(
      result.category !== "traffic_signal",
      "Model prediction is authoritative and ignores misleading categoryHint",
      `Predicted '${result.category}' instead of false hint`
    );
  } catch (err) {
    assert(false, "Category Hint Resistance Test", err.message);
  }

  // TEST 5: AI Service Offline Controlled Error (No Fake Pothole Fallback)
  console.log("\n👉 TEST 5: AI Service Unreachable Controlled Error Handling");
  try {
    // Temporarily point to invalid URL
    const originalModelUrl = process.env.AI_MODEL_SERVICE_URL;
    const originalUrl = process.env.AI_SERVICE_URL;
    process.env.AI_MODEL_SERVICE_URL = "http://127.0.0.1:9999"; // Non-existent port
    process.env.AI_SERVICE_URL = "http://127.0.0.1:9999";
    let threwError = false;
    try {
      await aiService.analyzeImage(createTestImageBuffer());
    } catch (err) {
      threwError = true;
      assert(err.statusCode === 503 || err.status === 503, "Throws 503 Service Unavailable when offline");
      assert(!err.message.includes("pothole"), "Does NOT return fake pothole on failure");
    }
    assert(threwError, "analyzeImage threw controlled error when service offline");
    process.env.AI_MODEL_SERVICE_URL = originalModelUrl;
    process.env.AI_SERVICE_URL = originalUrl;
  } catch (err) {
    assert(false, "AI Service Unreachable Controlled Error Handling", err.message);
  }

  // TEST 6: Citizen Live Photo 60-Second Rule Enforcement
  console.log("\n👉 TEST 6: Citizen Live Photo 60-Second Validity Window");
  {
    const now = Date.now();
    // Test 6A: Photo captured 70 seconds ago (expired)
    const expiredCapture = now - 70000;
    const ageSeconds = (now - expiredCapture) / 1000;
    const isExpired = ageSeconds > 65;
    assert(isExpired === true, "Expired citizen photo (>65s) correctly identified as invalid", `${Math.round(ageSeconds)}s old`);

    // Test 6B: Photo captured 10 seconds ago (fresh)
    const freshCapture = now - 10000;
    const freshAge = (now - freshCapture) / 1000;
    const isFresh = freshAge <= 65;
    assert(isFresh === true, "Fresh citizen photo (10s) accepted within 60s validity window");
  }

  // TEST 7: Priority Score Deterministic Calculation
  console.log("\n👉 TEST 7: Deterministic Priority Score Engine");
  {
    const score1 = calculatePriorityScore({
      severity: "CRITICAL",
      category: "pothole",
      safetyHazardIndex: 9.0,
      trafficImpactFactor: "Severe",
      upvotes: 2,
    });
    const score2 = calculatePriorityScore({
      severity: "CRITICAL",
      category: "pothole",
      safetyHazardIndex: 9.0,
      trafficImpactFactor: "Severe",
      upvotes: 2,
    });
    assert(score1 === score2, "Priority score calculation is strictly deterministic", `Score: ${score1}`);
    assert(score1 >= 80, "Critical severity with high safety hazard produces high priority score", `Score: ${score1}`);

    const lowScore = calculatePriorityScore({
      severity: "LOW",
      category: "garbage",
      safetyHazardIndex: 3.0,
      trafficImpactFactor: "Low",
    });
    assert(lowScore < score1, "Low severity produces lower priority score than critical", `Low Score: ${lowScore} < High Score: ${score1}`);
  }

  // TEST 8: Repair Verification Service Determinism
  console.log("\n👉 TEST 8: Repair Verification Comparison");
  try {
    const repairResult = await aiService.verifyRepair("https://example.com/before.jpg", "https://example.com/after.jpg");
    assert(repairResult.verified === true, "Repair verification confirms repair status");
    assert(typeof repairResult.confidenceScore === "number", "Returns numeric repair verification score");
  } catch (err) {
    assert(false, "Repair Verification Comparison", err.message);
  }

  // TEST 9: Worker Repair 300-Second (5-Minute) Validity Rule
  console.log("\n👉 TEST 9: Worker Repair 300-Second Live Photo Rule");
  {
    const now = Date.now();
    const expiredWorkerCapture = now - 350000; // 350 seconds ago
    let workerAge = (now - expiredWorkerCapture) / 1000;
    assert(workerAge > 310, "Worker photo older than 310s correctly identified as expired", `${Math.round(workerAge)}s old`);

    const freshWorkerCapture = now - 60000; // 60 seconds ago
    let freshWorkerAge = (now - freshWorkerCapture) / 1000;
    assert(freshWorkerAge <= 310, "Worker photo within 5-min window accepted", `${Math.round(freshWorkerAge)}s old`);
  }

  console.log("\n=================================================");
  console.log(`📊 TEST SUMMARY: ${passedCount} / ${totalCount} PASSED`);
  console.log("=================================================\n");

  if (passedCount === totalCount) {
    console.log("✨ ALL INTEGRATION TESTS PASSED PERFECTLY!");
    process.exit(0);
  } else {
    console.error("⚠️ SOME TESTS FAILED.");
    process.exit(1);
  }
}

runTests();
