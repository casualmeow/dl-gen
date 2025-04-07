const { execSync } = require("child_process");
const os = require("os");

const platform = os.platform();

if (platform === "win32") {
  console.log("🔧 Running PowerShell script on Windows...");
  execSync(`powershell -ExecutionPolicy Bypass -File delete-git/apply-folder-patch.ps1`, { stdio: "inherit" });
} else if (platform === "linux" || platform === "darwin") {
  console.log("🔧 Running Bash script on Linux/macOS...");
  execSync(`bash delete-git/apply-folder-patch.sh`, { stdio: "inherit" });
} else {
  console.error("❌ Unsupported OS:", platform);
}
