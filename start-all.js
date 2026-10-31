const { spawn } = require("child_process");
const path = require("path");

console.log("====================================================");
console.log("      🚀 Starting Food Bridge Fullstack App        ");
console.log("====================================================");
console.log(" Backend: http://localhost:8000");
console.log(" Frontend: http://localhost:3000");
console.log("----------------------------------------------------");
console.log(" Demo Accounts available:");
console.log("  • Donor:     donor@foodbridge.org   / donor123");
console.log("  • NGO:       ngo@foodbridge.org     / ngo123");
console.log("  • Volunteer: hero@foodbridge.org    / hero123");
console.log("====================================================");

// 1. Start backend server
const backendProcess = spawn("node", ["backend/server.js"], {
  cwd: __dirname,
  stdio: "inherit",
  shell: true,
});

backendProcess.on("error", (err) => {
  console.error("[Backend Error]", err);
});

// 2. Start frontend react development server
const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";
const frontendProcess = spawn(npmCmd, ["run", "start:client"], {
  cwd: __dirname,
  stdio: "inherit",
  shell: true,
  env: {
    ...process.env,
    PORT: "3000",
    BROWSER: "none", // Prevent auto-opening browser window if running in headless
  },
});

frontendProcess.on("error", (err) => {
  console.error("[Frontend Error]", err);
});

const cleanup = () => {
  console.log("\nShutting down servers...");
  try {
    backendProcess.kill();
  } catch (e) {}
  try {
    frontendProcess.kill();
  } catch (e) {}
  process.exit(0);
};

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
