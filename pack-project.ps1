# Pack project script for transferring to another computer
# Excludes node_modules, dist, etc.

$projectRoot = $PSScriptRoot
$projectName = Split-Path -Leaf $projectRoot
$timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$archiveName = "$projectName-$timestamp.zip"
$archivePath = Join-Path (Split-Path -Parent $projectRoot) $archiveName

Write-Host "Packing project: $projectName" -ForegroundColor Green
Write-Host "Project path: $projectRoot" -ForegroundColor Cyan

# Files and directories to exclude
$excludeItems = @(
    "node_modules",
    "dist",
    "dist-ssr",
    ".git",
    "*.log",
    "*.local",
    ".DS_Store",
    ".vscode",
    ".idea"
)

try {
    # Get all files excluding specified items
    $filesToArchive = Get-ChildItem -Path $projectRoot -Recurse -File | 
        Where-Object {
            $file = $_
            $relativePath = $file.FullName.Substring($projectRoot.Length + 1).Replace('\', '/')
            $shouldExclude = $false
            
            foreach ($exclude in $excludeItems) {
                $excludePattern = $exclude.Replace('\', '/')
                if ($relativePath -like $excludePattern -or 
                    $relativePath -like "*/$excludePattern/*" -or 
                    $relativePath -like "$excludePattern/*") {
                    $shouldExclude = $true
                    break
                }
            }
            
            -not $shouldExclude
        }
    
    # Create archive
    $fileList = $filesToArchive | ForEach-Object { $_.FullName }
    Compress-Archive -Path $fileList -DestinationPath $archivePath -CompressionLevel Optimal -Force
    
    $fileSize = [math]::Round((Get-Item $archivePath).Length / 1MB, 2)
    
    Write-Host ""
    Write-Host "Pack completed!" -ForegroundColor Green
    Write-Host "Archive location: $archivePath" -ForegroundColor Yellow
    Write-Host "File size: $fileSize MB" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Steps on new computer:" -ForegroundColor Green
    Write-Host "1. Extract the archive" -ForegroundColor White
    Write-Host "2. Open terminal in project directory" -ForegroundColor White
    Write-Host "3. Run: npm install" -ForegroundColor White
    Write-Host "4. Run: npm run dev" -ForegroundColor White
}
catch {
    Write-Host ""
    Write-Host "Pack failed: $_" -ForegroundColor Red
    exit 1
}
