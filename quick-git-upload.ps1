# Quick Git Upload Script
# Run this after configuring your Git user info

Write-Host "=== Quick Git Upload ===" -ForegroundColor Cyan
Write-Host ""

# Check Git user config
$userName = git config user.name
$userEmail = git config user.email

if ([string]::IsNullOrEmpty($userName) -or [string]::IsNullOrEmpty($userEmail)) {
    Write-Host "Git user info not configured yet!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please run these commands first:" -ForegroundColor Yellow
    Write-Host '  git config --global user.name "Your Name"' -ForegroundColor White
    Write-Host '  git config --global user.email "your.email@example.com"' -ForegroundColor White
    Write-Host ""
    Write-Host "Then run this script again." -ForegroundColor Yellow
    exit 1
}

Write-Host "Git user: $userName ($userEmail)" -ForegroundColor Green
Write-Host ""

# Add and commit
Write-Host "Adding files..." -ForegroundColor Cyan
git add .

$status = git status --short
if (-not [string]::IsNullOrEmpty($status)) {
    Write-Host "Committing..." -ForegroundColor Cyan
    git commit -m "Initial commit: love-signal-sim project"
    Write-Host "Commit successful!" -ForegroundColor Green
}
else {
    Write-Host "No changes to commit." -ForegroundColor Yellow
}

Write-Host ""

# Check remote
$remote = git remote -v
if ([string]::IsNullOrEmpty($remote)) {
    Write-Host "No remote repository configured." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To upload to GitHub/Gitee:" -ForegroundColor Cyan
    Write-Host "1. Create a repository on GitHub (https://github.com) or Gitee (https://gitee.com)" -ForegroundColor White
    Write-Host "2. Run these commands:" -ForegroundColor White
    Write-Host ""
    Write-Host "   git remote add origin <repository-url>" -ForegroundColor Yellow
    Write-Host "   git branch -M main" -ForegroundColor Yellow
    Write-Host "   git push -u origin main" -ForegroundColor Yellow
}
else {
    Write-Host "Remote repository:" -ForegroundColor Green
    git remote -v
    Write-Host ""
    $push = Read-Host "Push to remote now? (y/n)"
    if ($push -eq 'y' -or $push -eq 'Y') {
        $branch = git branch --show-current
        if ([string]::IsNullOrEmpty($branch)) {
            $branch = "main"
            git branch -M main
        }
        git push -u origin $branch
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Push successful!" -ForegroundColor Green
        }
    }
}

Write-Host ""
Write-Host "Done!" -ForegroundColor Cyan
