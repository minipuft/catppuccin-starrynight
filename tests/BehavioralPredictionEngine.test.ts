import { YEAR3000_CONFIG } from "../src-js/config/globalConfig";
import { PerformanceMonitor } from "../src-js/debug/PerformanceMonitor";
import { SettingsManager } from "../src-js/managers/SettingsManager";
import { MusicSyncService } from "../src-js/services/MusicSyncService";
import { BehavioralPredictionEngine } from "../src-js/systems/visual/BehavioralPredictionEngine";
import * as Year3000Utilities from "../src-js/utils/Year3000Utilities";

// Mock dependencies
jest.mock("../src-js/debug/PerformanceMonitor");
jest.mock("../src-js/services/MusicSyncService");
jest.mock("../src-js/managers/SettingsManager");

describe("BehavioralPredictionEngine", () => {
  let config: any;
  let utils: any;
  let performanceMonitor: any;
  let musicSyncService: any;
  let settingsManager: any;

  beforeEach(() => {
    config = YEAR3000_CONFIG;
    utils = Year3000Utilities;
    performanceMonitor = new PerformanceMonitor();
    musicSyncService = new MusicSyncService({} as any);
    settingsManager = new SettingsManager({} as any);
  });

  it("should initialize without errors", () => {
    expect(() => {
      new BehavioralPredictionEngine(
        config,
        utils,
        performanceMonitor,
        musicSyncService,
        settingsManager
      );
    }).not.toThrow();
  });
});
