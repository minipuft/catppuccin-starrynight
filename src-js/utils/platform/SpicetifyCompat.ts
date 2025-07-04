/**
 * Compatibility layer for Spicetify API differences
 * Handles graceful fallbacks during migration from incorrect to correct APIs
 */

export class SpicetifyCompat {
  /**
   * Get audio data with fallback handling
   * Uses correct Spicetify.getAudioData() API with fallback to legacy patterns
   */
  static async getAudioData(): Promise<any> {
    try {
      // Use the correct API (not Spicetify.Player.getAudioData which doesn't exist)
      if (typeof Spicetify !== "undefined" && Spicetify.getAudioData) {
        return await Spicetify.getAudioData();
      } else {
        console.warn("[SpicetifyCompat] Spicetify.getAudioData not available");
        return null;
      }
    } catch (error) {
      console.error("[SpicetifyCompat] Error fetching audio data:", error);
      return null;
    }
  }

  /**
   * Check if Spicetify APIs are available
   */
  static isAvailable(): boolean {
    return typeof Spicetify !== "undefined" && !!Spicetify.getAudioData;
  }

  /**
   * Retry wrapper for audio data fetching
   */
  static async getAudioDataWithRetry(
    retryDelay = 200,
    maxRetries = 10
  ): Promise<any> {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const audioData = await this.getAudioData();
        if (audioData) {
          return audioData;
        }
      } catch (error) {
        if (attempt < maxRetries - 1) {
          console.log(
            `[SpicetifyCompat] Retrying audio data fetch (${
              attempt + 1
            }/${maxRetries})...`
          );
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        } else {
          console.warn(
            `[SpicetifyCompat] Audio data fetch failed after ${maxRetries} attempts:`,
            error
          );
        }
      }
    }
    return null;
  }
}
