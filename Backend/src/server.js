import http from "http";
import app from "./app.js";
import connectDB from "./config/db.js";
import { ENV } from "./config/env.js";
import { initSocket } from "./sockets/socket.js";
import seedAdmin from "./seed/seedAdmin.js";
import seedDepartments from "./seed/seedDepartments.js";
import seedOrganizations from "./seed/seedOrganizations.js";

const PORT = ENV.PORT || 5000;

const startServer = async () => {
  try {
    // 1. Connect to Database
    await connectDB();

    // 2. Initialize Seed Data (Admin, Departments, Organizations)
    await seedAdmin();
    await seedDepartments();
    await seedOrganizations();

    // 3. Create HTTP Server and bind Socket.io
    const server = http.createServer(app);
    initSocket(server);

    // 4. Start Listening
    server.listen(PORT, () => {
      console.log(`🚀 Road2Solution Backend running on http://localhost:${PORT}`);
      console.log(`📡 Base API URL: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();