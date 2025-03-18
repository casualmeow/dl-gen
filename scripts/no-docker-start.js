const { execSync, spawn } = require('child_process');
const os = require('os');

const platform = os.platform();

if (platform !== 'win32') {
    execSync('chmod +x ./no-docker-launch/linux-launch.sh');

    const processSh = spawn('./scripts/run.sh', { stdio: 'inherit', shell: true });

    processSh.on('close', (code) => {
        console.log(`🛑 Script finished with code: ${code}`);
    });
} else {
    const processPs = spawn('powershell.exe', ['-ExecutionPolicy', 'Bypass', '-File', './no-docker-launch/windows-launch.ps1'], {
        stdio: 'inherit',
        shell: true,
    });

    processPs.on('close', (code) => {
        console.log(`🛑 Script finished with code: ${code}`);
    });
}
