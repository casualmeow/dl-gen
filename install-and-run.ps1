
Write-Host "[INFO] Checking for Docker installation..."

$docker = Get-Command docker -ErrorAction SilentlyContinue
if (-not $docker) {
    Write-Host "[INFO] Docker not found. Downloading and installing Docker Desktop..."
    $dockerInstaller = "$env:TEMP\DockerDesktopInstaller.exe"
    Invoke-WebRequest -Uri "https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe" -OutFile $dockerInstaller
    Start-Process -FilePath $dockerInstaller -ArgumentList "/install", "/quiet" -Wait
    Remove-Item $dockerInstaller
    Write-Host "[INFO] Docker Desktop installation initiated. Please log out and log in again if this is your first install."
}
else {
    Write-Host "[INFO] Docker is already installed."
}

Write-Host "[INFO] Checking for docker compose..."
$compose = & docker compose version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] 'docker compose' is not available. Please ensure Docker Desktop is running and try again."
    exit 1
}
else {
    Write-Host "[INFO] docker compose is available."
}

Write-Host "[INFO] Running 'docker compose up --build'..."
try {
    & docker compose up --build
} catch {
    Write-Host "[ERROR] Failed to run 'docker compose up --build'."
    exit 1
} 