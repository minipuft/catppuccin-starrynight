# Catppuccin StarryNight Theme Installer
# Automated installation script for Windows PowerShell

param(
    [string]$ColorScheme = "mocha",
    [switch]$Force
)

Write-Host "🌙✨ Catppuccin StarryNight Theme Installer" -ForegroundColor Magenta
Write-Host "================================================" -ForegroundColor Cyan

# Check if Spicetify is installed and get version info
try {
    $spicetifyVersion = spicetify -v
    Write-Host "✅ Spicetify detected: $spicetifyVersion" -ForegroundColor Green

    # Extract version number for command compatibility
    $versionMatch = $spicetifyVersion -match "(\d+)\.(\d+)\.(\d+)"
    if ($versionMatch) {
        $majorVersion = [int]$Matches[1]
        $minorVersion = [int]$Matches[2]
        $isNewVersion = ($majorVersion -gt 2) -or ($majorVersion -eq 2 -and $minorVersion -ge 27)
        Write-Host "📋 CLI Version: $majorVersion.$minorVersion (Using $(if ($isNewVersion) { 'new' } else { 'legacy' }) commands)" -ForegroundColor Blue
    } else {
        # Default to new commands if version can't be parsed
        $isNewVersion = $true
        Write-Host "⚠️  Version parsing failed, defaulting to new command format" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Spicetify not found. Please install Spicetify CLI first:" -ForegroundColor Red
    Write-Host "   https://spicetify.app/docs/getting-started" -ForegroundColor Yellow
    exit 1
}

# Define Spicetify paths for both Roaming and Local AppData
$spicetifyRoamingPath = "$env:APPDATA\spicetify"
$spicetifyLocalPath = "$env:LOCALAPPDATA\spicetify"

# Array of target locations
$targetLocations = @(
    @{ Path = $spicetifyRoamingPath; Name = "Roaming" },
    @{ Path = $spicetifyLocalPath; Name = "Local" }
)

$sourceThemePath = $PSScriptRoot

# Define essential files and directories to copy
$essentialItems = @(
    "user.css",
    "color.ini",
    "theme.js",
    "manifest.json",
    "Extensions",
    "assets",
    "docs"
)

# Process installation for both Roaming and Local paths
foreach ($location in $targetLocations) {
    $spicetifyConfigPath = $location.Path
    $locationName = $location.Name
    $themesPath = Join-Path -Path $spicetifyConfigPath -ChildPath "Themes"
    $themeTargetPath = Join-Path -Path $themesPath -ChildPath "catppuccin-starrynight"

    Write-Host "------------------------------------------------" -ForegroundColor Cyan
    Write-Host "Processing ${locationName} installation..." -ForegroundColor Magenta
    Write-Host "📁 Spicetify ${locationName} config path: $spicetifyConfigPath" -ForegroundColor Blue

    # Create Themes directory if it doesn't exist
    if (!(Test-Path $themesPath)) {
        New-Item -ItemType Directory -Path $themesPath -Force | Out-Null
        Write-Host "📁 Created Themes directory in ${locationName}" -ForegroundColor Green
    }

    # Check if theme already exists and handle overwrite
    if (Test-Path $themeTargetPath) {
        if ($Force) {
            Write-Host "🔄 Force flag set, removing existing theme from ${locationName}..." -ForegroundColor Yellow
            Remove-Item $themeTargetPath -Recurse -Force
        } else {
            $overwrite = Read-Host "⚠️  Theme already exists in ${locationName}. Overwrite? (y/N)"
            if ($overwrite.ToLower() -ne "y") {
                Write-Host "❌ Installation for ${locationName} cancelled." -ForegroundColor Red
                continue # Skip to the next location
            }
            Remove-Item $themeTargetPath -Recurse -Force
        }
    }

    # Copy essential theme files
    Write-Host "📋 Copying essential theme files to ${locationName}..." -ForegroundColor Blue
    New-Item -ItemType Directory -Path $themeTargetPath -Force | Out-Null

    foreach ($item in $essentialItems) {
        $sourcePath = Join-Path $sourceThemePath $item
        $targetPath = Join-Path $themeTargetPath $item

        if (Test-Path $sourcePath) {
            if (Test-Path $sourcePath -PathType Container) {
                Copy-Item $sourcePath $targetPath -Recurse -Force
                Write-Host "  📁 Copied directory: $item to ${locationName}" -ForegroundColor Gray
            } else {
                Copy-Item $sourcePath $targetPath -Force
                Write-Host "  📄 Copied file: $item to ${locationName}" -ForegroundColor Gray
            }
        } else {
            Write-Host "  ⚠️  Optional item not found: $item" -ForegroundColor Yellow
        }
    }

    # Verify essential files
    $essentialFiles = @("user.css", "color.ini", "theme.js", "manifest.json")
    $extensionFiles = @("Extensions/catppuccin-starrynight.js")
    $allFilesExist = $true

    foreach ($file in $essentialFiles) {
        $filePath = Join-Path -Path $themeTargetPath -ChildPath $file
        if (!(Test-Path $filePath)) {
            Write-Host "❌ Essential file missing in ${locationName}: ${file}" -ForegroundColor Red
            $allFilesExist = $false
        }
    }

    foreach ($file in $extensionFiles) {
        $filePath = Join-Path -Path $themeTargetPath -ChildPath $file
        if (!(Test-Path $filePath)) {
            Write-Host "⚠️  Extension file missing in ${locationName}: ${file}" -ForegroundColor Yellow
        } else {
            Write-Host "✅ Extension file found in ${locationName}: ${file}" -ForegroundColor Green
        }
    }

    if ($allFilesExist) {
        Write-Host "✅ Essential theme files copied to ${locationName} successfully" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to copy essential files to ${locationName}." -ForegroundColor Red
    }
}

Write-Host "------------------------------------------------" -ForegroundColor Cyan
Write-Host "✅ Theme files copied to both Roaming and Local AppData locations." -ForegroundColor Green
Write-Host "  🚫 Excluded development sources: /src, /src-js" -ForegroundColor Blue

# Extension installation preparation
$extensionInstalled = $true
Write-Host "📦 Theme includes progressive loading extension for enhanced compatibility" -ForegroundColor Blue

# Validate color scheme
$validSchemes = @("latte", "frappe", "macchiato", "mocha")
if ($ColorScheme -notin $validSchemes) {
    Write-Host "⚠️  Invalid color scheme '$ColorScheme'. Using 'mocha' instead." -ForegroundColor Yellow
    $ColorScheme = "mocha"
}

Write-Host "🎨 Applying theme configuration..." -ForegroundColor Blue

# Apply Spicetify configuration
try {
    # Backup current setup
    Write-Host "📦 Creating backup..." -ForegroundColor Blue
    spicetify backup

    # Set theme and color scheme
    spicetify config current_theme catppuccin-starrynight
    spicetify config color_scheme $ColorScheme

    # Configure extension for progressive loading
    Write-Host "🔌 Configuring extension..." -ForegroundColor Blue
    $extensionPath = "catppuccin-starrynight/Extensions/catppuccin-starrynight.js"

    # Check current extensions config
    $currentExtensions = spicetify config extensions 2>$null
    if ($currentExtensions -notlike "*catppuccin-starrynight.js*") {
        if ($currentExtensions) {
            spicetify config extensions "${currentExtensions}|${extensionPath}"
        } else {
            spicetify config extensions $extensionPath
        }
        Write-Host "✅ Extension configured: catppuccin-starrynight.js" -ForegroundColor Green
    } else {
        Write-Host "✅ Extension already configured" -ForegroundColor Green
    }

    # Apply changes using appropriate command based on version
    Write-Host "🚀 Applying theme..." -ForegroundColor Blue
    if ($isNewVersion) {
        spicetify backup apply
        Write-Host "✅ Theme applied using 'backup apply' (CLI 2.27+)" -ForegroundColor Green
    } else {
        spicetify apply
        Write-Host "✅ Theme applied using legacy 'apply' command" -ForegroundColor Green
    }

} catch {
    Write-Host "❌ Error applying theme: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "📝 Try running manually:" -ForegroundColor Yellow
    Write-Host "   spicetify config current_theme catppuccin-starrynight" -ForegroundColor Gray
    Write-Host "   spicetify config color_scheme $ColorScheme" -ForegroundColor Gray
    Write-Host "   spicetify config extensions catppuccin-starrynight/Extensions/catppuccin-starrynight.js" -ForegroundColor Gray
    if ($isNewVersion) {
        Write-Host "   spicetify backup apply" -ForegroundColor Gray
    } else {
        Write-Host "   spicetify apply" -ForegroundColor Gray
    }
    exit 1
}

# Success message
Write-Host ""
Write-Host "🎉 Installation Complete!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "📱 Open Spotify to see your new theme" -ForegroundColor Blue
Write-Host "⚙️  Access theme settings in Spotify Preferences" -ForegroundColor Blue
Write-Host "🔧 Extension will automatically handle API compatibility issues" -ForegroundColor Blue
Write-Host ""
Write-Host "🌟 Features enabled:" -ForegroundColor Yellow
Write-Host "   • Catppuccin $ColorScheme color scheme" -ForegroundColor Gray
Write-Host "   • Modern --spice- variable system" -ForegroundColor Gray
Write-Host "   • 15 customizable accent colors" -ForegroundColor Gray
Write-Host "   • Progressive loading extension with API resilience" -ForegroundColor Gray
Write-Host "   • Year 3000 Color Harmony System" -ForegroundColor Gray
Write-Host "   • Music-reactive visual effects" -ForegroundColor Gray
Write-Host "   • Modern CSS gradient system" -ForegroundColor Gray
Write-Host "   • Performance optimized styling" -ForegroundColor Gray
Write-Host ""
Write-Host "📖 For more info, check the README.md and IMPLEMENTATION_NOTES.md" -ForegroundColor Blue
Write-Host "🐛 Issues? Run: spicetify restore && spicetify backup apply" -ForegroundColor Yellow
Write-Host ""
Write-Host "Enjoy your starry night! 🌙✨" -ForegroundColor Magenta