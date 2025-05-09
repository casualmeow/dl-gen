<# deploy.ps1 — PowerShell-скрипт для монорепо деплоя на fly.io #>

param(
  [Parameter(Mandatory=$true)]
  [ValidateSet("backendv2","backendv3","backend","frontend")]
  [string]$Service,

  [string[]]$FlyArgs
)

switch ($Service) {
  "backendv2" {
    $App = "dl-gen-backendv2"
    $Dockerfile = "backendv2/Dockerfile"
    $Port = 8000
  }
  "backendv3" {
    $App = "dl-gen-backendv3"
    $Dockerfile = "backendv3/Dockerfile"
    $Port = 8001
  }
  "backend" {
    $App = "dl-gen-backend"
    $Dockerfile = "backend/Dockerfile"
    $Port = 8080
  }
  "frontend" {
    $App = "dl-gen-frontend"
    $Dockerfile = "frontend/Dockerfile"
    $Port = 80
  }
}

Write-Host "Deploying $Service -> app=$App, dockerfile=$Dockerfile"

flyctl deploy `
  --app $App `
  --primary-region iad `
  --dockerfile $Dockerfile `
  --env PORT=$Port `
  $FlyArgs
