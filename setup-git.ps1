# Git Setup and Upload Script
# This script helps initialize Git and upload to remote repository

Write-Host "=== Git Project Upload Helper ===" -ForegroundColor Cyan
Write-Host ""

# Check if Git is installed
$gitInstalled = $false
try {
    $gitVersion = git --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        $gitInstalled = $true
        Write-Host "Git installed: $gitVersion" -ForegroundColor Green
    }
}
catch {
    $gitInstalled = $false
}

if (-not $gitInstalled) {
    Write-Host "Error: Git not detected" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Git first:" -ForegroundColor Yellow
    Write-Host "1. Visit https://git-scm.com/download/win" -ForegroundColor White
    Write-Host "2. Download and install Git for Windows" -ForegroundColor White
    Write-Host "3. Restart terminal after installation and run this script again" -ForegroundColor White
    Write-Host ""
    Write-Host "Or use winget (Windows 10/11):" -ForegroundColor Yellow
    Write-Host "winget install --id Git.Git -e --source winget" -ForegroundColor White
    exit 1
}

$projectRoot = $PSScriptRoot
Set-Location $projectRoot

Write-Host "Project path: $projectRoot" -ForegroundColor Cyan
Write-Host ""

# Check if already a Git repository
if (Test-Path ".git") {
    Write-Host "Existing Git repository detected" -ForegroundColor Yellow
    $isRepo = $true
}
else {
    Write-Host "Initializing Git repository..." -ForegroundColor Green
    git init
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Initialization failed!" -ForegroundColor Red
        exit 1
    }
    Write-Host "Git repository initialized successfully!" -ForegroundColor Green
    $isRepo = $true
}

Write-Host ""

# Check Git config
Write-Host "Checking Git configuration..." -ForegroundColor Cyan
$userName = git config user.name
$userEmail = git config user.email

if ([string]::IsNullOrEmpty($userName) -or [string]::IsNullOrEmpty($userEmail)) {
    Write-Host "Warning: Git user info not configured" -ForegroundColor Yellow
    Write-Host "Please run the following commands (first time setup):" -ForegroundColor Yellow
    Write-Host '  git config --global user.name "Your Name"' -ForegroundColor White
    Write-Host '  git config --global user.email "your.email@example.com"' -ForegroundColor White
    Write-Host ""
    $configure = Read-Host "Configure now? (y/n)"
    if ($configure -eq 'y' -or $configure -eq 'Y') {
        $name = Read-Host "Enter your name"
        $email = Read-Host "Enter your email"
        git config --global user.name $name
        git config --global user.email $email
        Write-Host "Configuration complete!" -ForegroundColor Green
    }
}
else {
    Write-Host "Git user: $userName ($userEmail)" -ForegroundColor Green
}

Write-Host ""

# Add files
Write-Host "Adding files to Git..." -ForegroundColor Cyan
git add .
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to add files!" -ForegroundColor Red
    exit 1
}

# Check status
$status = git status --short
if ([string]::IsNullOrEmpty($status)) {
    Write-Host "No changes to commit" -ForegroundColor Yellow
    Write-Host "All files already committed" -ForegroundColor Yellow
}
else {
    Write-Host "Detected changes:" -ForegroundColor Green
    git status --short
    Write-Host ""
    
    $commitMsg = Read-Host "Enter commit message (press Enter for default: Initial commit)"
    if ([string]::IsNullOrEmpty($commitMsg)) {
        $commitMsg = "Initial commit: love-signal-sim project"
    }
    
    Write-Host "Committing code..." -ForegroundColor Cyan
    git commit -m $commitMsg
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Commit failed!" -ForegroundColor Red
        exit 1
    }
    Write-Host "Commit successful!" -ForegroundColor Green
}

Write-Host ""

# Check remote
$remote = git remote -v
if ([string]::IsNullOrEmpty($remote)) {
    Write-Host "No remote repository detected" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Create a new repository on GitHub (https://github.com) or Gitee (https://gitee.com)" -ForegroundColor White
    Write-Host "2. After creating, run these commands to connect:" -ForegroundColor White
    Write-Host ""
    Write-Host "   GitHub:" -ForegroundColor Yellow
    Write-Host '   git remote add origin https://github.com/username/repo-name.git' -ForegroundColor White
    Write-Host '   git branch -M main' -ForegroundColor White
    Write-Host '   git push -u origin main' -ForegroundColor White
    Write-Host ""
    Write-Host "   Gitee:" -ForegroundColor Yellow
    Write-Host '   git remote add origin https://gitee.com/username/repo-name.git' -ForegroundColor White
    Write-Host '   git branch -M main' -ForegroundColor White
    Write-Host '   git push -u origin main' -ForegroundColor White
    Write-Host ""
    
    $addRemote = Read-Host "Add remote repository now? (y/n)"
    if ($addRemote -eq 'y' -or $addRemote -eq 'Y') {
        $remoteUrl = Read-Host "Enter remote repository URL (e.g., https://github.com/username/repo-name.git)"
        if (-not [string]::IsNullOrEmpty($remoteUrl)) {
            git remote add origin $remoteUrl
            if ($LASTEXITCODE -eq 0) {
                Write-Host "Remote repository added successfully!" -ForegroundColor Green
                
                # Rename branch to main
                $currentBranch = git branch --show-current
                if ($currentBranch -ne "main") {
                    git branch -M main
                }
                
                Write-Host ""
                $push = Read-Host "Push code to remote repository now? (y/n)"
                if ($push -eq 'y' -or $push -eq 'Y') {
                    Write-Host "Pushing code to remote repository..." -ForegroundColor Cyan
                    git push -u origin main
                    if ($LASTEXITCODE -eq 0) {
                        Write-Host "Push successful! Your code has been uploaded to Git!" -ForegroundColor Green
                    }
                    else {
                        Write-Host "Push failed, please check remote URL and permissions" -ForegroundColor Red
                        Write-Host "For GitHub, you may need to use Personal Access Token instead of password" -ForegroundColor Yellow
                    }
                }
            }
            else {
                Write-Host "Failed to add remote repository!" -ForegroundColor Red
            }
        }
    }
}
else {
    Write-Host "Connected remote repository:" -ForegroundColor Green
    git remote -v
    Write-Host ""
    
    $push = Read-Host "Push code to remote repository? (y/n)"
    if ($push -eq 'y' -or $push -eq 'Y') {
        $currentBranch = git branch --show-current
        if ([string]::IsNullOrEmpty($currentBranch)) {
            $currentBranch = "main"
        }
        Write-Host "Pushing code to remote repository..." -ForegroundColor Cyan
        git push -u origin $currentBranch
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Push successful! Your code has been uploaded to Git!" -ForegroundColor Green
        }
        else {
            Write-Host "Push failed, please check remote repository permissions" -ForegroundColor Red
        }
    }
}

Write-Host ""
Write-Host "=== Done ===" -ForegroundColor Cyan
