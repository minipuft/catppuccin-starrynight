export const CAN_USE_WEB_WORKERS = false;

/**
 * Centralised environment capability flags for the StarryNight theme.
 * Importing this file avoids hard-coding checks across the codebase and
 * guarantees consistency with the build target (Spicetify desktop).
 */
export const ENVIRONMENT_RULES = {
  canUseWebWorkers: CAN_USE_WEB_WORKERS,
};

// Future flags:
// export const CAN_USE_SHARED_ARRAY_BUFFER = false;
