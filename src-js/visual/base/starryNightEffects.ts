import { SettingsManager } from "@/ui/managers/SettingsManager";
import { YEAR3000_CONFIG } from "@/config/globalConfig";

type GradientIntensity = "disabled" | "minimal" | "balanced" | "intense";
type StarDensity = "disabled" | "minimal" | "balanced" | "intense";

function injectStarContainer(): HTMLElement {
  const existingContainer = document.querySelector<HTMLElement>(
    ".sn-stars-container"
  );
  if (existingContainer) {
    return existingContainer;
  }

  const starContainer = document.createElement("div");
  starContainer.className = "sn-stars-container";

  for (let i = 1; i <= 5; i++) {
    const star = document.createElement("div");
    star.className = "star";
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
    const starSetting =
      getSettingsManager().get("sn-star-density") ?? "balanced";
    if (starSetting !== "disabled" && Math.random() < 0.3) {
      createShootingStar();
    }
  }, 5000 + Math.random() * 10000);
}

function applyStarryNightSettings(
  gradientIntensity: GradientIntensity,
  starDensity: StarDensity
): void {
  if (YEAR3000_CONFIG.enableDebug) {
    console.log("[StarryNightEffects] Applying settings:", {
      gradientIntensity,
      starDensity,
    });
  }
  const body = document.body;

  const gradientClasses: `sn-gradient-${GradientIntensity}`[] = [
    "sn-gradient-disabled",
    "sn-gradient-minimal",
    "sn-gradient-balanced",
    "sn-gradient-intense",
  ];
  const starClasses: `sn-stars-${StarDensity}`[] = [
    "sn-stars-disabled",
    "sn-stars-minimal",
    "sn-stars-balanced",
    "sn-stars-intense",
  ];

  body.classList.remove(...gradientClasses, ...starClasses);

  if (gradientIntensity !== "balanced") {
    body.classList.add(`sn-gradient-${gradientIntensity}`);
  }

  if (starDensity !== "balanced") {
    body.classList.add(`sn-stars-${starDensity}`);
  }

  const existingContainer = document.querySelector(".sn-stars-container");
  if (starDensity === "disabled") {
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
