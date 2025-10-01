import { SettingsManager } from "@/ui/managers/SettingsManager";
import { ADVANCED_SYSTEM_CONFIG } from "@/config/globalConfig";

type EffectIntensity = "disabled" | "minimal" | "balanced" | "intense";

function injectStarContainer(): HTMLElement {
  const existingContainer = document.querySelector<HTMLElement>(
    ".sn-stars-container"
  );
  if (existingContainer) {
    return existingContainer;
  }

  const starContainer = document.createElement("div");
  starContainer.className = "sn-stars-container";

  // Create 10 star particles (8 energy + 2 nebula from consolidated system)
  // Matches enhanced _stars.scss particle definitions (nth-child 1-10)
  for (let i = 1; i <= 10; i++) {
    const star = document.createElement("div");
    star.className = "star";
    // Optional twinkle enhancement for variety
    if (Math.random() > 0.7) star.classList.add("twinkle");
    starContainer.appendChild(star);
  }
  document.body.appendChild(starContainer);
  return starContainer;
}

function createShootingStar(): void {
  const shootingStar = document.createElement("div");
  shootingStar.className = "shootingstar";
  shootingStar.style.left = `${Math.random() * window.innerWidth}px`;
  shootingStar.style.top = "-10px";

  document.body.appendChild(shootingStar);

  setTimeout(() => {
    shootingStar.remove();
  }, 3000);
}

function startShootingStars(): number {
  return window.setInterval(() => {
    // Now reads consolidated gradient intensity setting
    const effectSetting =
      getSettingsManager().get("sn-gradient-intensity") ?? "balanced";
    if (effectSetting !== "disabled" && Math.random() < 0.3) {
      createShootingStar();
    }
  }, 5000 + Math.random() * 10000);
}

function applyStarryNightSettings(
  effectIntensity: EffectIntensity,
  // Legacy parameter kept for backwards compatibility
  _legacyStarDensity?: EffectIntensity
): void {
  if (ADVANCED_SYSTEM_CONFIG.enableDebug) {
    console.log("[StarryNightEffects] Applying consolidated effect settings:", {
      effectIntensity,
    });
  }
  const body = document.body;

  // Apply consolidated intensity to both gradient and star classes
  const gradientClasses: `sn-gradient-${EffectIntensity}`[] = [
    "sn-gradient-disabled",
    "sn-gradient-minimal",
    "sn-gradient-balanced",
    "sn-gradient-intense",
  ];
  const starClasses: `sn-stars-${EffectIntensity}`[] = [
    "sn-stars-disabled",
    "sn-stars-minimal",
    "sn-stars-balanced",
    "sn-stars-intense",
  ];

  body.classList.remove(...gradientClasses, ...starClasses);

  // Use the same intensity for both gradient and star effects (consolidated approach)
  if (effectIntensity !== "balanced") {
    body.classList.add(`sn-gradient-${effectIntensity}`);
    body.classList.add(`sn-stars-${effectIntensity}`);
  }

  // Star container management based on consolidated intensity
  const existingContainer = document.querySelector(".sn-stars-container");
  if (effectIntensity === "disabled") {
    existingContainer?.remove();
  } else {
    if (!existingContainer) {
      injectStarContainer();
    }
  }
}

// Unified accessor – mirrors helper used by StarryNightSettings.ts
function getSettingsManager(): SettingsManager {
  const existing = (window as any).Y3K?.system?.settingsManager as
    | SettingsManager
    | undefined;
  if (existing) return existing;

  const cached = (globalThis as any).__SN_settingsManager as
    | SettingsManager
    | undefined;
  if (cached) return cached;

  const manager = new SettingsManager();
  (globalThis as any).__SN_settingsManager = manager;
  return manager;
}

export {
  applyStarryNightSettings,
  createShootingStar,
  injectStarContainer,
  startShootingStars,
};
