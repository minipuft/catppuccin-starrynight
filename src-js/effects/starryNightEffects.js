import { YEAR3000_CONFIG } from "../config/globalConfig.js"; // Used in applyStarryNightSettings, though not directly visible in the provided snippet

// Function to inject or update the star container
function injectStarContainer() {
  const existingContainer = document.querySelector(".sn-stars-container");
  if (existingContainer) {
    // Clear existing stars if we are re-injecting (e.g., for density changes not handled by class alone)
    // However, the current applyStarryNightSettings removes/re-adds the whole container for simplicity if not disabled.
    // For now, if it exists, assume it's managed by applyStarryNightSettings or is being re-created.
    return existingContainer; // Return existing if found, applyStarryNightSettings handles removal/re-add logic
  }

  const starContainer = document.createElement("div");
  starContainer.className = "sn-stars-container";

  // Create stars - this part is somewhat static. If density needs dynamic stars, this needs change.
  for (let i = 1; i <= 5; i++) {
    // Original had 5, could be tied to a 'balanced' default
    const star = document.createElement("div");
    star.className = "star";
    if (Math.random() > 0.7) star.classList.add("twinkle");
    starContainer.appendChild(star);
  }
  document.body.appendChild(starContainer);
  return starContainer;
}

// Function to create shooting stars
function createShootingStar() {
  const shootingStar = document.createElement("div");
  shootingStar.className = "shootingstar";
  shootingStar.style.left = Math.random() * window.innerWidth + "px";
  shootingStar.style.top = "-10px"; // Start above the viewport

  document.body.appendChild(shootingStar);

  setTimeout(() => {
    if (shootingStar.parentNode) {
      shootingStar.parentNode.removeChild(shootingStar);
    }
  }, 3000); // Matches typical animation duration for a shooting star
}

// Function to start the interval for shooting stars
function startShootingStars() {
  // The interval ID should be stored if we need to clear it later, e.g., on theme unload or when stars are disabled.
  // For now, mirroring original functionality where it's not explicitly cleared outside of a page reload.
  return setInterval(() => {
    const starSetting = localStorage.getItem("sn-starDensity") ?? "balanced";
    if (starSetting !== "disabled" && Math.random() < 0.3) {
      createShootingStar();
    }
  }, 5000 + Math.random() * 10000);
}

// Function to apply StarryNight visual settings
function applyStarryNightSettings(gradientIntensity, starDensity) {
  if (YEAR3000_CONFIG.enableDebug) {
    console.log("[StarryNightEffects] applyStarryNightSettings CALLED with:", {
      gradientIntensity,
      starDensity,
    });
  }
  const body = document.body;

  // Ensure YEAR3000_CONFIG and its defaults are available
  const configGradient =
    YEAR3000_CONFIG?.settings?.["sn-gradientIntensity"]?.options?.find(
      (o) => o.default
    )?.value || "balanced";
  const configStars =
    YEAR3000_CONFIG?.settings?.["sn-starDensity"]?.options?.find(
      (o) => o.default
    )?.value || "balanced";

  const currentGradient = gradientIntensity || configGradient;
  const currentStars = starDensity || configStars;

  // Remove existing StarryNight classes more robustly
  const gradientClasses = [
    "sn-gradient-disabled",
    "sn-gradient-minimal",
    "sn-gradient-balanced",
    "sn-gradient-intense",
  ];
  const starClasses = [
    "sn-stars-disabled",
    "sn-stars-minimal",
    "sn-stars-balanced",
    "sn-stars-intense",
  ];
  body.classList.remove(...gradientClasses, ...starClasses);

  // Apply gradient classes
  if (currentGradient !== "balanced") {
    body.classList.add(`sn-gradient-${currentGradient}`);
  }

  // Apply star classes
  if (currentStars !== "balanced") {
    body.classList.add(`sn-stars-${currentStars}`);
  }

  if (YEAR3000_CONFIG.enableDebug) {
    console.log(
      "[StarryNightEffects] Body classes FINAL (gradient/star):",
      body.className
    );
  }

  // Manage star container
  const existingContainer = document.querySelector(".sn-stars-container");
  if (currentStars === "disabled") {
    if (existingContainer) existingContainer.remove();
  } else {
    if (!existingContainer) injectStarContainer(); // Only inject if not already there
    // If it exists, its content might be updated by SCSS based on the new body class or might need explicit refresh here if stars are dynamic beyond CSS
  }
}

export {
  applyStarryNightSettings,
  createShootingStar,
  injectStarContainer,
  startShootingStars,
};
