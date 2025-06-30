#!/bin/bash
# Catppuccin StarryNight Theme Installer
# Hybrid installation script for Linux, macOS, and WSL

COLOR_SCHEME=${1:-mocha}
FORCE=${2:-false}

echo "🌙✨ Catppuccin StarryNight Theme Installer (Hybrid)"
echo "================================================"

# Check if Spicetify is installed
if ! command -v spicetify &> /dev/null && ! command -v spicetify.exe &> /dev/null; then
    echo "❌ Spicetify not found. Please install Spicetify CLI first:"
    echo "   https://spicetify.app/docs/getting-started"
    exit 1
fi

SPICETIFY_CMD="spicetify"
if command -v spicetify.exe &> /dev/null; then
    SPICETIFY_CMD="spicetify.exe"
fi

SPICETIFY_VERSION=$($SPICETIFY_CMD -v)
echo "✅ Spicetify detected: $SPICETIFY_VERSION"

# --- Smart Path Detection ---
TARGET_LOCATIONS=()

# Check if running in WSL and get Windows paths
if [[ -n "$WSL_DISTRO_NAME" ]]; then
    echo "🐧 WSL environment detected. Attempting to find Windows Spicetify paths."

    # Get Roaming AppData path
    WIN_APPDATA_PATH_RAW=$(cmd.exe /c "echo %APPDATA%" 2>/dev/null | tr -d '\r')
    if [[ -n "$WIN_APPDATA_PATH_RAW" ]]; then
        WSL_APPDATA_PATH=$(wslpath "$WIN_APPDATA_PATH_RAW")
        TARGET_LOCATIONS+=("$WSL_APPDATA_PATH/spicetify")
        echo "  ✔️ Found Roaming path: $WSL_APPDATA_PATH/spicetify"
    else
        echo "  ⚠️ Could not determine Roaming AppData path."
    fi

    # Get Local AppData path
    WIN_LOCALAPPDATA_PATH_RAW=$(cmd.exe /c "echo %LOCALAPPDATA%" 2>/dev/null | tr -d '\r')
    if [[ -n "$WIN_LOCALAPPDATA_PATH_RAW" ]]; then
        WSL_LOCALAPPDATA_PATH=$(wslpath "$WIN_LOCALAPPDATA_PATH_RAW")
        TARGET_LOCATIONS+=("$WSL_LOCALAPPDATA_PATH/spicetify")
        echo "  ✔️ Found Local path: $WSL_LOCALAPPDATA_PATH/spicetify"
    else
         echo "  ⚠️ Could not determine Local AppData path."
    fi
else
    # Fallback for native Linux/macOS using spicetify -c
    echo "🐧 Native Linux/macOS detected. Using 'spicetify -c' for path."
    SPICETIFY_CONFIG_FILE_PATH=$($SPICETIFY_CMD -c)
    if [ -z "$SPICETIFY_CONFIG_FILE_PATH" ]; then
        echo "❌ Could not determine Spicetify config path."
        echo "   Try running '$SPICETIFY_CMD -c' to diagnose."
        exit 1
    fi
    SPICETIFY_CONFIG_PATH=$(dirname "$SPICETIFY_CONFIG_FILE_PATH")
    TARGET_LOCATIONS+=("$SPICETIFY_CONFIG_PATH")
fi

echo ""
echo "🔍 Review of detected Spicetify target paths:"
for path in "${TARGET_LOCATIONS[@]}"; do
    if [ -d "$path" ]; then
        echo "   • $path (exists)"
    else
        echo "   • $path (does NOT exist yet)"
    fi
done

if [ ${#TARGET_LOCATIONS[@]} -eq 0 ]; then
    echo "❌ No valid Spicetify installation paths found. Aborting."
    exit 1
fi

# Extract version number for command compatibility
VERSION_STRING=$(echo "$SPICETIFY_VERSION" | sed 's/spicetify v//')
MAJOR_VERSION=$(echo "$VERSION_STRING" | cut -d. -f1)
MINOR_VERSION=$(echo "$VERSION_STRING" | cut -d. -f2)

IS_NEW_VERSION=false
if [ "$MAJOR_VERSION" -gt 2 ] || { [ "$MAJOR_VERSION" -eq 2 ] && [ "$MINOR_VERSION" -ge 27 ]; }; then
    IS_NEW_VERSION=true
fi
echo "📋 CLI Version: $MAJOR_VERSION.$MINOR_VERSION (Using $(if [ "$IS_NEW_VERSION" = true ]; then echo 'new'; else echo 'legacy'; fi) commands)"

SOURCE_THEME_PATH="$(dirname "$0")"

# --- Loop through target locations to copy files ---
for SPICETIFY_CONFIG_PATH in "${TARGET_LOCATIONS[@]}"; do
    echo ""
    echo "------------------------------------------------"
    echo "➡️  Processing installation for: $SPICETIFY_CONFIG_PATH"

    THEMES_PATH="$SPICETIFY_CONFIG_PATH/Themes"
    THEME_TARGET_PATH="$THEMES_PATH/catppuccin-starrynight"

    # Create Themes directory if it doesn't exist
    if [ ! -d "$THEMES_PATH" ]; then
        mkdir -p "$THEMES_PATH"
        echo "📁 Created Themes directory"
    fi

    # Check if theme already exists
    if [ -d "$THEME_TARGET_PATH" ]; then
        if [ "$FORCE" = "true" ]; then
            echo "🔄 Force flag set, removing existing theme..."
            rm -rf "$THEME_TARGET_PATH"
        else
            echo "⚠️  Theme already exists. Overwrite? (y/N)"
            read -r overwrite
            if [ "$overwrite" != "y" ] && [ "$overwrite" != "Y" ]; then
                echo "❌ Installation for this path cancelled."
                continue # Skip to next location
            fi
            rm -rf "$THEME_TARGET_PATH"
        fi
    fi

    # Essential files and directories to copy
    ESSENTIAL_ITEMS=(
        "user.css"
        "color.ini"
        "theme.js"
        "manifest.json"
        "Extensions"
        "assets"
        "docs"
    )

    echo "📋 Copying theme files..."
    mkdir -p "$THEME_TARGET_PATH"

    # Copy essential files
    for item in "${ESSENTIAL_ITEMS[@]}"; do
        source_path="$SOURCE_THEME_PATH/$item"
        target_path="$THEME_TARGET_PATH/$item"

        if [ -e "$source_path" ]; then
            cp -r "$source_path" "$target_path"
            if [ -d "$source_path" ]; then
                echo "  📁 Copied directory: $item"
            else
                echo "  📄 Copied file: $item"
            fi
        else
            echo "  ⚠️  Optional item not found: $item"
        fi
    done

    # Verify essential files
    ESSENTIAL_FILES=("user.css" "color.ini" "theme.js" "manifest.json")
    EXTENSION_FILES=("Extensions/catppuccin-starrynight.js")
    all_files_exist=true

    for file in "${ESSENTIAL_FILES[@]}"; do
        if [ ! -f "$THEME_TARGET_PATH/$file" ]; then
            echo "❌ Essential file missing: $file"
            all_files_exist=false
        fi
    done

    for file in "${EXTENSION_FILES[@]}"; do
        if [ ! -f "$THEME_TARGET_PATH/$file" ]; then
            echo "⚠️  Extension file missing: $file"
        else
            echo "✅ Extension file found: $file"
        fi
    done

    if [ "$all_files_exist" = true ]; then
        echo "✅ Essential theme files copied successfully"
        # Verbose listing of copied files to ensure correctness
        if command -v tree &> /dev/null; then
            echo "📂 Directory tree for $THEME_TARGET_PATH:"
            tree -L 2 "$THEME_TARGET_PATH"
        else
            echo "📂 Listing contents of $THEME_TARGET_PATH (depth 2):"
            find "$THEME_TARGET_PATH" -maxdepth 2 -mindepth 1 -print | sed 's|^|   • |'
        fi
    else
        echo "❌ Failed to copy essential files for this path."
    fi

    echo "   Source theme path: $SOURCE_THEME_PATH"
    echo "   Destination theme path: $THEME_TARGET_PATH"
done

echo ""
echo "------------------------------------------------"
echo "✅ Theme files copied to all target locations."

# --- Configuration part (runs only once) ---

echo "📦 Theme includes progressive loading extension for enhanced compatibility"

# Validate color scheme
VALID_SCHEMES=("latte" "frappe" "macchiato" "mocha")
if [[ ! " ${VALID_SCHEMES[@]} " =~ " $COLOR_SCHEME " ]]; then
    echo "⚠️  Invalid color scheme '$COLOR_SCHEME'. Using 'mocha' instead."
    COLOR_SCHEME="mocha"
fi

echo "🎨 Applying theme configuration..."

# The 'spicetify backup apply' command will handle backup if needed.
# The explicit 'spicetify backup' is removed to avoid state issues.

# Set theme and color scheme
$SPICETIFY_CMD config current_theme catppuccin-starrynight
$SPICETIFY_CMD config color_scheme "$COLOR_SCHEME"

# Configure extension
echo "🔌 Configuring extension..."
EXTENSION_PATH="catppuccin-starrynight/Extensions/catppuccin-starrynight.js"

# Get current extensions
current_extensions=$($SPICETIFY_CMD config extensions 2>/dev/null || echo "")

if [[ "$current_extensions" != *"catppuccin-starrynight.js"* ]]; then
    if [ -n "$current_extensions" ]; then
        $SPICETIFY_CMD config extensions "${current_extensions}|${EXTENSION_PATH}"
    else
        $SPICETIFY_CMD config extensions "$EXTENSION_PATH"
    fi
    echo "✅ Extension configured: catppuccin-starrynight.js"
else
    echo "✅ Extension already configured"
fi

# Apply changes
echo "🚀 Applying theme..."
if [ "$IS_NEW_VERSION" = true ]; then
    if $SPICETIFY_CMD backup apply; then
        echo "✅ Theme applied successfully using 'backup apply' (CLI 2.27+)"
    else
        echo "❌ Error applying theme. Try running manually:"
        echo "   $SPICETIFY_CMD config current_theme catppuccin-starrynight"
        echo "   $SPICETIFY_CMD config color_scheme $COLOR_SCHEME"
        echo "   $SPICETIFY_CMD config extensions $EXTENSION_PATH"
        echo "   $SPICETIFY_CMD backup apply"
        exit 1
    fi
else
    if $SPICETIFY_CMD apply; then
        echo "✅ Theme applied successfully using legacy 'apply' command"
    else
        echo "❌ Error applying theme. Try running manually:"
        echo "   $SPICETIFY_CMD config current_theme catppuccin-starrynight"
        echo "   $SPICETIFY_CMD config color_scheme $COLOR_SCHEME"
        echo "   $SPICETIFY_CMD config extensions $EXTENSION_PATH"
        echo "   $SPICETIFY_CMD apply"
        exit 1
    fi
fi

# Success message
echo ""
echo "🎉 Installation Complete!"
echo "================================================"
echo "📱 Open Spotify to see your new theme"
echo "⚙️  Access theme settings in Spotify Preferences"
echo ""
echo "🌟 Features enabled:"
echo "   • Catppuccin $COLOR_SCHEME color scheme"
echo "   • Modern --spice- variable system"
echo "   • 15 customizable accent colors"
echo "   • Progressive loading extension with API resilience"
echo "   • Year 3000 Color Harmony System"
echo "   • Music-reactive visual effects"
echo "   • Modern CSS gradient system"
echo "   • Performance optimized styling"
echo ""
echo "📖 For more info, check the README.md and IMPLEMENTATION_NOTES.md"
echo "🐛 Issues? Run: spicetify restore && spicetify backup apply"
echo ""
echo "Enjoy your starry night! 🌙✨"