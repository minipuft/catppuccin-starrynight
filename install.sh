#!/bin/bash
# Catppuccin StarryNight Theme Installer
# Automated installation script for Linux/macOS

COLOR_SCHEME=${1:-mocha}
FORCE=${2:-false}

echo "🌙✨ Catppuccin StarryNight Theme Installer"
echo "================================================"

# Check if Spicetify is installed
if ! command -v spicetify &> /dev/null; then
    echo "❌ Spicetify not found. Please install Spicetify CLI first:"
    echo "   https://spicetify.app/docs/getting-started"
    exit 1
fi

SPICETIFY_VERSION=$(spicetify -v)
echo "✅ Spicetify detected: $SPICETIFY_VERSION"

# Determine Spicetify config path
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    SPICETIFY_CONFIG_PATH="$HOME/.config/spicetify"
else
    # Linux
    SPICETIFY_CONFIG_PATH="$HOME/.config/spicetify"
fi

THEMES_PATH="$SPICETIFY_CONFIG_PATH/Themes"
THEME_TARGET_PATH="$THEMES_PATH/catppuccin-starrynight"
SOURCE_THEME_PATH="$(dirname "$0")"

echo "📁 Spicetify config path: $SPICETIFY_CONFIG_PATH"

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
            echo "❌ Installation cancelled."
            exit 1
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
else
    echo "❌ Failed to copy essential files."
    exit 1
fi

echo "📦 Theme includes progressive loading extension for enhanced compatibility"

# Validate color scheme
VALID_SCHEMES=("latte" "frappe" "macchiato" "mocha")
if [[ ! " ${VALID_SCHEMES[@]} " =~ " $COLOR_SCHEME " ]]; then
    echo "⚠️  Invalid color scheme '$COLOR_SCHEME'. Using 'mocha' instead."
    COLOR_SCHEME="mocha"
fi

echo "🎨 Applying theme configuration..."

# Apply Spicetify configuration
echo "📦 Creating backup..."
spicetify backup

# Set theme and color scheme
spicetify config current_theme catppuccin-starrynight
spicetify config color_scheme "$COLOR_SCHEME"

# Configure extension
echo "🔌 Configuring extension..."
EXTENSION_PATH="catppuccin-starrynight/Extensions/catppuccin-starrynight.js"

# Get current extensions
current_extensions=$(spicetify config extensions 2>/dev/null || echo "")

if [[ "$current_extensions" != *"catppuccin-starrynight.js"* ]]; then
    if [ -n "$current_extensions" ]; then
        spicetify config extensions "${current_extensions}|${EXTENSION_PATH}"
    else
        spicetify config extensions "$EXTENSION_PATH"
    fi
    echo "✅ Extension configured: catppuccin-starrynight.js"
else
    echo "✅ Extension already configured"
fi

# Apply changes
echo "🚀 Applying theme..."
if spicetify backup apply; then
    echo "✅ Theme applied successfully"
else
    echo "❌ Error applying theme. Try running manually:"
    echo "   spicetify config current_theme catppuccin-starrynight"
    echo "   spicetify config color_scheme $COLOR_SCHEME"
    echo "   spicetify config extensions $EXTENSION_PATH"
    echo "   spicetify backup apply"
    exit 1
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