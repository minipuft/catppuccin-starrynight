# Catppuccin StarryNight Theme Installer
# Automated installation script for Windows PowerShell

param(
    [string]$ColorScheme = "mocha",
    [switch]$SkipExtension,
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

# Get Spicetify paths
$spicetifyConfigPath = "$env:APPDATA\spicetify"
$themesPath = "$spicetifyConfigPath\Themes"
$extensionsPath = "$spicetifyConfigPath\Extensions"
$themeTargetPath = "$themesPath\catppuccin-starrynight"

Write-Host "📁 Spicetify config path: $spicetifyConfigPath" -ForegroundColor Blue

# Create directories if they don't exist
if (!(Test-Path $themesPath)) {
    New-Item -ItemType Directory -Path $themesPath -Force | Out-Null
    Write-Host "📁 Created Themes directory" -ForegroundColor Green
}

if (!(Test-Path $extensionsPath)) {
    New-Item -ItemType Directory -Path $extensionsPath -Force | Out-Null
    Write-Host "📁 Created Extensions directory" -ForegroundColor Green
}

# Check if theme already exists
if (Test-Path $themeTargetPath) {
    if ($Force) {
        Write-Host "🔄 Force flag set, removing existing theme..." -ForegroundColor Yellow
        Remove-Item $themeTargetPath -Recurse -Force
    } else {
        $overwrite = Read-Host "⚠️  Theme already exists. Overwrite? (y/N)"
        if ($overwrite.ToLower() -ne "y") {
            Write-Host "❌ Installation cancelled." -ForegroundColor Red
            exit 1
        }
        Remove-Item $themeTargetPath -Recurse -Force
    }
}

# Copy theme files
Write-Host "📋 Copying theme files..." -ForegroundColor Blue
$sourceThemePath = $PSScriptRoot
Copy-Item $sourceThemePath $themeTargetPath -Recurse -Force

# Verify essential files
$essentialFiles = @("user.css", "color.ini", "theme.js", "manifest.json")
foreach ($file in $essentialFiles) {
    $filePath = "$themeTargetPath\$file"
    if (!(Test-Path $filePath)) {
        Write-Host "❌ Essential file missing: $file" -ForegroundColor Red
        exit 1
    }
}
Write-Host "✅ Theme files copied successfully" -ForegroundColor Green

# Install enhanced extension (optional)
if (!$SkipExtension) {
    $extensionSource = "$sourceThemePath\Extensions\theme-vibrant-enhanced.js"
    $extensionTarget = "$extensionsPath\theme-vibrant-enhanced.js"

    if (Test-Path $extensionSource) {
        Copy-Item $extensionSource $extensionTarget -Force
        Write-Host "✅ Extension installed: theme-vibrant-enhanced.js" -ForegroundColor Green
        $extensionInstalled = $true
    } else {
        Write-Host "⚠️  Enhanced extension file not found, checking for legacy extension..." -ForegroundColor Yellow

        # Fallback to legacy extension if enhanced not found
        $legacyExtensionSource = "$sourceThemePath\Extensions\theme-vibrant.js"
        if (Test-Path $legacyExtensionSource) {
            Copy-Item $legacyExtensionSource "$extensionsPath\theme-vibrant.js" -Force
            Write-Host "✅ Legacy extension installed: theme-vibrant.js" -ForegroundColor Green
            $extensionInstalled = $true
            $legacyExtension = $true
        } else {
            Write-Host "⚠️  No extension files found, skipping..." -ForegroundColor Yellow
            $extensionInstalled = $false
        }
    }
} else {
    Write-Host "⏭️  Skipping extension installation" -ForegroundColor Yellow
    $extensionInstalled = $false
}

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

    # Enable extension if installed
    if ($extensionInstalled) {
        if ($legacyExtension) {
            spicetify config extensions theme-vibrant.js
            Write-Host "🔌 Extension enabled: theme-vibrant.js (legacy)" -ForegroundColor Green
        } else {
            spicetify config extensions theme-vibrant-enhanced.js
            Write-Host "🔌 Extension enabled: theme-vibrant-enhanced.js (modern)" -ForegroundColor Green
        }
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
    if ($extensionInstalled) {
        if ($legacyExtension) {
            Write-Host "   spicetify config extensions theme-vibrant.js" -ForegroundColor Gray
        } else {
            Write-Host "   spicetify config extensions theme-vibrant-enhanced.js" -ForegroundColor Gray
        }
    }
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
Write-Host ""
Write-Host "🌟 Features enabled:" -ForegroundColor Yellow
Write-Host "   • Catppuccin $ColorScheme color scheme" -ForegroundColor Gray
Write-Host "   • Modern --spice- variable system" -ForegroundColor Gray
Write-Host "   • 15 customizable accent colors" -ForegroundColor Gray
if ($extensionInstalled) {
    if ($legacyExtension) {
        Write-Host "   • Dynamic album art gradients (legacy canvas-based)" -ForegroundColor Gray
    } else {
        Write-Host "   • Dynamic album art gradients (native API - CORS-free)" -ForegroundColor Gray
        Write-Host "   • Enhanced color extraction with smart fallbacks" -ForegroundColor Gray
    }
    Write-Host "   • Animated star effects" -ForegroundColor Gray
    Write-Host "   • Performance optimizations" -ForegroundColor Gray
} else {
    Write-Host "   • Static gradients (extension not installed)" -ForegroundColor Gray
}
Write-Host ""
Write-Host "📖 For more info, check the README.md and IMPLEMENTATION_NOTES.md" -ForegroundColor Blue
if ($extensionInstalled -and !$legacyExtension) {
    Write-Host "🎯 Enable debug mode: Set enableDebug: true in theme-vibrant-enhanced.js" -ForegroundColor Blue
}
Write-Host "🐛 Issues? Run: spicetify restore && spicetify backup apply" -ForegroundColor Yellow
Write-Host ""
Write-Host "Enjoy your starry night! 🌙✨" -ForegroundColor Magenta