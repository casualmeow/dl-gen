$hash = Read-Host "Enter Admin Hash"

$apiUrl = "http://localhost/api/authorize-admin" # TODO: change localhost to the actual domain

$response = Invoke-WebRequest -Uri $apiUrl -Method POST -Body $hash

$responseText = $response.Content.Trim()

Write-Host "Server response: $responseText"

if ($responseText -eq "Your IP is now authorized for /admin access.") {
    Write-Host "admin authorized"
} else {
    Write-Host "not authorized"
}
