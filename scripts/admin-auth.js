const { execSync, spawn } = require('child_process');
const os = require('os');

const platform = os.platform();

if (platform === 'win32') {
    execSync('powershell.exe -ExecutionPolicy Bypass -File admin-auth/windows-auth.ps1');
} else {
    execSync('bash admin-auth/linux-auth.sh');
}


