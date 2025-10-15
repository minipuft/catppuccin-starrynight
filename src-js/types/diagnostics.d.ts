// Shared diagnostics and state types for color processing systems
// Centralizes previously duplicated interfaces across modules.

import type { ColorContext, ColorResult } from "@/types/colorStrategy";

export type ColorProcessingState = {
  isProcessing: boolean;
  currentTrackUri: string | null;
  lastExtractedColors: Record<string, string> | null;
  lastProcessedResult: ColorResult | null;
  lastProcessingTime: number;
  processingQueue: ColorContext[];
  queueSize: number;
};

export interface ProcessorDiagnostics {
  totalExtractions: number;
  totalProcessed: number;
  totalApplied: number;
  averageProcessingTime: number;
  successRate: number;
  errorCount: number;
  lastProcessingTime: number;
  oklabCoordinations: number;
  strategySelections: number;
  cacheHits: number;
}

export interface OrchestrationDiagnostics {
  totalProcessingTime: number;
  strategiesProcessed: number;
  strategiesSucceeded: number;
  strategiesFailed: number;
  averageStrategyTime: number;
  memoryUsage: number;
  oklabProcessingTime: number;
}

export interface ColorSystemDiagnostics {
  state: ColorProcessingState;
  processor: ProcessorDiagnostics;
  orchestration?: OrchestrationDiagnostics;
}
