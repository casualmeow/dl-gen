#this could be reusable if you want to delete a git branch from a repo 
#could be usable if backend has master breanch and you want to delete it


param (
    [string]$sourceFolder = "backendv3",
    [string]$targetFolder = "backendv3",
    [string]$repoRoot = (Get-Location),
    [switch]$removeNestedGit
)

$sourcePath = Resolve-Path -Path (Join-Path $repoRoot $sourceFolder)
$patchPath = "$env:TEMP\$sourceFolder.patch"

if ($removeNestedGit) {
    $nestedGit = Join-Path $sourcePath ".git"
    if (Test-Path $nestedGit) {
        Remove-Item -Recurse -Force $nestedGit
        Write-Host "⚠️ Removed nested .git from $sourceFolder to make it part of the main repo"
    }
}

Push-Location $sourcePath
git diff > $patchPath
Pop-Location

Push-Location $repoRoot
git apply --directory=$targetFolder $patchPath
Pop-Location

Write-Host "`n✅ Patch from '$sourceFolder' applied into '$targetFolder' inside repo '$repoRoot'"
