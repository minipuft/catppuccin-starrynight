# 🌌 Catppuccin StarryNight: Year 3000 Visual System

<div align="center">
  <img src="assets/logo.png" alt="Catppuccin StarryNight Logo" width="180"/>
</div>

Catppuccin StarryNight is a music-reactive, performance-aware theme for Spotify (via Spicetify). It blends dynamic color extraction, beat-synchronized visuals, and a modular animation system to create a more immersive and responsive Spotify experience. This README is meant to help you get started, customize, and understand how the theme works—think of it as a friendly guide, not a sales pitch.

---

## Features

- **Dynamic Color Pipeline**: UI colors adapt in real-time to album art and Catppuccin flavor.
- **BeatSync Visuals**: UI elements pulse, bloom, and animate in sync with the music's BPM and energy.
- **Performance Core**: Single animation loop and CSS variable batching for smooth 60 FPS visuals.
- **Graceful Degradation**: Supports reduced-motion, low-end hardware, and fallback modes.
- **Modular Visual Systems**: Includes 3D card effects, glassmorphism, nebula glows, and more.
- **Settings UI**: Change theme options directly in Spotify's preferences.
- **Advanced Drag-and-Drop**: Enhanced drag ghosts, quick-add radial menu, and sidebar morphing.
- **Accessibility**: Honors system motion/contrast preferences and provides keyboard navigation.

For a deeper dive, see the [Documentation Hub](docs/README.md) and [Visual Systems Architecture](docs/VISUAL_SYSTEMS_ARCHITECTURE.md).

---

## Screenshots

<div align="center">
  <table>
    <tr>
      <td align="center" width="25%">
        <img src="assets/home.png" alt="Home Page Interface" width="220"/>
        <br/><sub>🏠 Home Interface</sub>
      </td>
      <td align="center" width="25%">
        <img src="assets/album.png" alt="Album/Playlist View" width="220"/>
        <br/><sub>💿 Album View</sub>
      </td>
      <td align="center" width="25%">
        <img src="assets/likedSongs.png" alt="Liked Songs Collection" width="220"/>
        <br/><sub>💖 Liked Songs</sub>
      </td>
      <td align="center" width="25%">
        <img src="assets/search.png" alt="Search Interface" width="220"/>
        <br/><sub>🔍 Search View</sub>
      </td>
    </tr>
  </table>
</div>

_The theme adapts to your music and color preferences in real time._

---

## Table of Contents

- [🌌 Catppuccin StarryNight: Year 3000 Visual System](#-catppuccin-starrynight-year-3000-visual-system)
  - [Features](#features)
  - [Screenshots](#screenshots)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
    - [Prerequisites](#prerequisites)
    - [Method 1: PowerShell Script (Recommended)](#method-1-powershell-script-recommended)
    - [Method 2: Manual Setup](#method-2-manual-setup)
  - [Customization](#customization)
  - [Troubleshooting](#troubleshooting)
  - [Credits](#credits)
  - [License](#license)

---

## Installation

### Prerequisites

- [Spicetify CLI](https://spicetify.app/docs/getting-started) installed

### Method 1: PowerShell Script (Recommended)

```powershell
iwr -useb "https://raw.githubusercontent.com/minipuft/catppuccin-starrynight/main/install.ps1" | iex
```

- Installs theme files, configures the extension, and applies optimal settings.

### Method 2: Manual Setup

1. Download and extract the theme to your Spicetify Themes directory:
   ```powershell
   cd "$env:APPDATA\spicetify\Themes"
   # Extract catppuccin-starrynight folder here (with Extensions directory)
   ```
2. Apply the theme and extension:
   ```powershell
   spicetify config current_theme catppuccin-starrynight
   spicetify config color_scheme mocha
   spicetify config extensions catppuccin-starrynight/Extensions/catppuccin-starrynight.js
   spicetify backup apply
   ```

---

## Customization

You can adjust the theme's appearance and behavior in Spotify's preferences panel. Options include:

- **Accent Color**: Choose a static Catppuccin accent or let it adapt to album art.
- **Dynamic Gradient**: Control the intensity of background gradients.
- **Star Animation**: Set the density and speed of star overlays.
- **Performance Mode**: Optimize for your device.
- **Flavor**: Switch between Latte, Frappé, Macchiato, and Mocha color schemes.

For advanced tweaks, you can override CSS variables in `user.css`:

```css
:root {
  --sn-gradient-opacity: 0.25;
  --sn-gradient-blur: 30px;
  --sn-star-count: 5;
  --sn-star-speed: 6s;
  --sn-color-saturation: 1.3;
  --sn-color-brightness: 1.1;
}
```

See [docs/README.md](docs/README.md) for more details and technical documentation.

---

## Troubleshooting

- **Theme not showing up**: Run `spicetify restore backup apply`.
- **Dynamic colors not working**:
  1. Check that the extension is installed and enabled.
  2. Select "Dynamic" in accent color settings.
  3. Restart Spotify.
  4. Ensure `catppuccin-starrynight.js` is in the Extensions folder.
  5. Check for "Year 3000 Color Harmony System initialized" in the console.
- **Performance issues**: Lower gradient/star settings or enable eco mode.
- **PowerShell execution policy error**: Run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`.
- **Colors look wrong**: Try a different color scheme or reset settings.

For more, see the [full troubleshooting guide](docs/README.md#troubleshooting) and the [docs/](docs/) directory for technical details.

---

## Credits

- **Catppuccin**: Color palette and UI inspiration ([repo](https://github.com/catppuccin/spicetify))
- **StarryNight Vibrant**: Dynamic effects inspiration ([repo](https://github.com/ElPioterro/StarryNightVibrant))
- **Spicetify**: The platform that makes Spotify theming possible ([repo](https://github.com/spicetify/spicetify-cli))
- Thanks to all contributors and the open-source community!

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

_If you have questions, suggestions, or want to contribute, feel free to open an issue or pull request!_
