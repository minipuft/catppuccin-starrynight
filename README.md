<div align="center">
  <img src="assets/logo.png" alt="Catppuccin StarryNight Logo" width="200"/>
  <h1>Catppuccin StarryNight</h1>
  <p><strong>Year 3000 Visual System for Spotify</strong></p>

  <p>
    <a href="https://github.com/minipuft/catppuccin-starrynight/stargazers"><img src="https://img.shields.io/github/stars/minipuft/catppuccin-starrynight?style=for-the-badge&colorA=363a4f&colorB=cba6f7&logo=github" alt="Stars"></a>
    <a href="https://github.com/minipuft/catppuccin-starrynight/releases/latest"><img src="https://img.shields.io/github/v/release/minipuft/catppuccin-starrynight?style=for-the-badge&colorA=363a4f&colorB=a6e3a1&logo=github" alt="Release"></a>
    <a href="https://github.com/minipuft/catppuccin-starrynight/blob/main/LICENSE"><img src="https://img.shields.io/github/license/minipuft/catppuccin-starrynight?style=for-the-badge&colorA=363a4f&colorB=f9e2af&logo=github" alt="License"></a>
    <a href="https://github.com/minipuft/catppuccin-starrynight/issues"><img src="https://img.shields.io/github/issues/minipuft/catppuccin-starrynight?style=for-the-badge&colorA=363a4f&colorB=f38ba8&logo=github" alt="Issues"></a>
  </p>
</div>

> **Beta Notice** - StarryNight is getting ready for the Spicetify Marketplace. Expect rapid updates and please report anything that feels off.

Catppuccin StarryNight turns Spotify into a living, music-reactive canvas. Built on the Catppuccin palette, it blends real-time album color harmonies, beat-synced visuals, and a performance-conscious architecture so you can enjoy the show on everything from ultrabooks to studio rigs.

---

## Highlights

- **Dynamic Catppuccin palette** - Album art feeds the OKLAB color pipeline for instant mood shifts across the UI.
- **Music-aware visuals** - The Visual Effects Coordinator keeps gradients, particles, and UI accents in sync with BPM, energy, and emotional tone.
- **Performance-first** - Unified animation loop, batched CSS variable updates, and adaptive quality tiers target 60 FPS while gracefully degrading when hardware or APIs fall back.
- **Built-in settings** - Tweak flavor, accent behavior, flow intensity, and performance modes directly inside Spotify.
- **Accessible by design** - Honors reduced-motion and high-contrast preferences with automatic fallbacks.

---

## Quick Start

1. Install the [Spicetify CLI](https://spicetify.app/docs/getting-started) and make sure Spotify is up to date.
2. Follow the detailed install instructions in **[`docs/BUILD_AND_DEPLOY.md`](docs/BUILD_AND_DEPLOY.md)** (covers install scripts, manual setup, validation, and troubleshooting).
3. Launch Spotify, open **Settings -> Catppuccin StarryNight**, and dial in your vibe.

_Note: The detailed guide above is the source of truth, but quick scripts are available:_

### One-liner install scripts

```powershell
# Windows PowerShell
iwr -useb "https://raw.githubusercontent.com/minipuft/catppuccin-starrynight/main/install.ps1" | iex
```

```bash
# Linux / macOS
curl -fsSL "https://raw.githubusercontent.com/minipuft/catppuccin-starrynight/main/install.sh" | sh
```

```bash
# Hybrid (WSL detecting Windows paths)
curl -fsSL "https://raw.githubusercontent.com/minipuft/catppuccin-starrynight/main/install-hybrid.sh" | bash
```

_<small>Scripts will rebuild/install the theme automatically. Manual steps remain documented in [`docs/BUILD_AND_DEPLOY.md`](docs/BUILD_AND_DEPLOY.md).</small>_

---

## Screenshots

<div align="center">
  <table>
    <tr>
      <td align="center" width="25%"><img src="assets/home.png" alt="Home view" width="220"/><br/><sub>Home</sub></td>
      <td align="center" width="25%"><img src="assets/album.png" alt="Album view" width="220"/><br/><sub>Album</sub></td>
      <td align="center" width="25%"><img src="assets/likedSongs.png" alt="Liked songs" width="220"/><br/><sub>Favorites</sub></td>
      <td align="center" width="25%"><img src="assets/search.png" alt="Search view" width="220"/><br/><sub>Search</sub></td>
    </tr>
  </table>
</div>

---

## Customisation

Open **Settings -> Catppuccin StarryNight** in Spotify to adjust:
- Flavor (Latte, Frappe, Macchiato, Mocha)
- Dynamic accent vs. static palette
- Flow/gradient intensity and blur
- Star density/speed and UI highlight energy
- Performance profile (battery, balanced, performance, premium)

For deeper tweaks (CSS variables, override examples), see **[`docs/STYLING_AND_TOKENS.md`](docs/STYLING_AND_TOKENS.md)**.

---

## Documentation

Start at the **[Documentation Index](docs/README.md)**. Key guides:

| Document | Why you might need it |
| --- | --- |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Lifecycle, coordinators, and system layout. |
| [`docs/COLOR_AND_AUDIO.md`](docs/COLOR_AND_AUDIO.md) | MusicSyncService, ColorHarmonyEngine, OKLAB pipeline. |
| [`docs/BUILD_AND_DEPLOY.md`](docs/BUILD_AND_DEPLOY.md) | Build scripts, validation, CI overview, install notes. |
| [`docs/PERFORMANCE_OPTIMIZATION_GUIDELINES.md`](docs/PERFORMANCE_OPTIMIZATION_GUIDELINES.md) | Current performance targets and quality scaling. |
| [`docs/GRACEFUL_DEGRADATION_GUIDE.md`](docs/GRACEFUL_DEGRADATION_GUIDE.md) | How the theme handles missing APIs/hardware. |

Legacy research lives under `docs/legacy/` if you want the full history.

---

## Contributing

Bugs, ideas, or pull requests are welcome:
- File issues with the appropriate template in the [issue tracker](https://github.com/minipuft/catppuccin-starrynight/issues/new/choose).
- Before contributing code, skim the core docs above so your changes stay aligned with the architecture.

---

## Credits

- [Catppuccin](https://github.com/catppuccin) for the legendary palette.
- [Spicetify](https://github.com/spicetify/spicetify-cli) for making Spotify customisation possible.
- Everyone in the community providing feedback, testing, and inspiration.

---

## License

Released under the MIT License. See [`LICENSE`](LICENSE) for details.
