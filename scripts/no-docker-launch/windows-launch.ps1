$frontendPath = Join-Path $PSScriptRoot "../../frontend"
$backendPath = Join-Path $PSScriptRoot "../../backend"

# Frontend
Write-Host "🚀 Starting Frontend..."
$frontend = Start-Process npm.cmd -ArgumentList "run dev" `
  -WorkingDirectory $frontendPath `
  -NoNewWindow -PassThru

# Backend
Write-Host "🚀 Starting Backend..."
$backend = Start-Process sbt -ArgumentList "run" `
  -WorkingDirectory $backendPath `
  -NoNewWindow -PassThru

# Listener for Ctrl+C
$OnExit = {
    Write-Host "`n🛑 Shutting down Frontend and Backend..."
    try {
        Stop-Process -Id $frontend.Id -Force -ErrorAction SilentlyContinue
        Stop-Process -Id $backend.Id -Force -ErrorAction SilentlyContinue
    } catch {
        Write-Host "⚠️ Error stopping processes: $_"
    }
}

Register-EngineEvent -SourceIdentifier Console_Cancel_Key_Press -Action $OnExit

Wait-Process -Id $frontend.Id, $backend.Id
