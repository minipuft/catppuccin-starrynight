import { ADVANCED_SYSTEM_CONFIG } from "@/config/globalConfig";
import { Y3KDebug } from "@/debug/DebugCoordinator";
import type { MusicalOKLABProcessor } from "./MusicalOKLABCoordinator";
import { OKLABColorProcessor } from "./OKLABColorProcessor";

type MusicalOKLABProcessorCtor = new (enableDebug?: boolean) => MusicalOKLABProcessor;

type ProcessorKind = "standard" | "musical";

export interface ProcessorRequestMetrics {
  requester: string;
  kind: ProcessorKind;
  timestamp: number;
}

export interface ProcessorCacheMetrics {
  name: string;
  size: number;
  metadata?: Record<string, unknown>;
  updatedAt: number;
}

export interface OKLABSingletonMetrics {
  totalRequests: number;
  perRequester: Map<string, number>;
  recentRequests: ProcessorRequestMetrics[];
  instances: {
    standard: boolean;
    musical: boolean;
  };
  cacheFootprint: Map<string, ProcessorCacheMetrics>;
}

interface RequestOptions {
  requester?: string;
  enableDebug?: boolean;
  reason?: string;
}

const MAX_RECENT_REQUESTS = 25;

let musicalProcessorCtor: MusicalOKLABProcessorCtor | null = null;

function resolveMusicalProcessorCtor(): MusicalOKLABProcessorCtor {
  if (!musicalProcessorCtor) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const module = require("./MusicalOKLABCoordinator") as typeof import("./MusicalOKLABCoordinator");
    musicalProcessorCtor = module.MusicalOKLABProcessor;
  }

  return musicalProcessorCtor;
}

function cloneMetrics(metrics: OKLABSingletonMetrics) {
  return {
    totalRequests: metrics.totalRequests,
    perRequester: Object.fromEntries(metrics.perRequester.entries()),
    recentRequests: metrics.recentRequests.slice(),
    instances: { ...metrics.instances },
    cacheFootprint: Object.fromEntries(metrics.cacheFootprint.entries()),
  };
}

export class OKLABProcessorSingleton {
  private static standardInstance: OKLABColorProcessor | null = null;
  private static musicalInstance: MusicalOKLABProcessor | null = null;
  private static metrics: OKLABSingletonMetrics = {
    totalRequests: 0,
    perRequester: new Map(),
    recentRequests: [],
    instances: {
      standard: false,
      musical: false,
    },
    cacheFootprint: new Map(),
  };

  public static getStandardOKLABProcessor(
    options: RequestOptions = {}
  ): OKLABColorProcessor {
    if (!OKLABProcessorSingleton.standardInstance) {
      OKLABProcessorSingleton.standardInstance = new OKLABColorProcessor(
        options.enableDebug ?? ADVANCED_SYSTEM_CONFIG.enableDebug
      );
      OKLABProcessorSingleton.metrics.instances.standard = true;
    }

    OKLABProcessorSingleton.registerRequest("standard", options);
    return OKLABProcessorSingleton.standardInstance;
  }

  public static getMusicalOKLABProcessor(
    options: RequestOptions = {}
  ): MusicalOKLABProcessor {
    if (!OKLABProcessorSingleton.musicalInstance) {
      const MusicalCtor = resolveMusicalProcessorCtor();
      OKLABProcessorSingleton.musicalInstance = new MusicalCtor(
        options.enableDebug ?? ADVANCED_SYSTEM_CONFIG.enableDebug
      );
      OKLABProcessorSingleton.metrics.instances.musical = true;
    }

    OKLABProcessorSingleton.registerRequest("musical", options);
    return OKLABProcessorSingleton.musicalInstance;
  }

  public static reportCacheFootprint(
    name: string,
    size: number,
    metadata?: Record<string, unknown>
  ): void {
    const cacheMetrics: ProcessorCacheMetrics = {
      name,
      size,
      updatedAt: Date.now(),
    };

    if (metadata) {
      cacheMetrics.metadata = metadata;
    }

    OKLABProcessorSingleton.metrics.cacheFootprint.set(name, cacheMetrics);
  }

  public static getProcessingMetrics() {
    return cloneMetrics(OKLABProcessorSingleton.metrics);
  }

  public static getMemoryStats() {
    return {
      standardInstances: OKLABProcessorSingleton.standardInstance ? 1 : 0,
      musicalInstances: OKLABProcessorSingleton.musicalInstance ? 1 : 0,
      trackedCaches: OKLABProcessorSingleton.metrics.cacheFootprint.size,
    };
  }

  public static ensureAvailability(kind: ProcessorKind, requester?: string): boolean {
    const instance =
      kind === "standard"
        ? OKLABProcessorSingleton.standardInstance
        : OKLABProcessorSingleton.musicalInstance;

    if (!instance) {
      const message =
        kind === "standard"
          ? "Standard OKLABColorProcessor singleton has not been initialized"
          : "Musical OKLABColorProcessor singleton has not been initialized";
      console.warn(`[OKLABProcessorSingleton] ${message}`, {
        requester,
      });
      return false;
    }

    return true;
  }

  public static resetForTests(): void {
    OKLABProcessorSingleton.standardInstance = null;
    OKLABProcessorSingleton.musicalInstance = null;
    OKLABProcessorSingleton.metrics = {
      totalRequests: 0,
      perRequester: new Map(),
      recentRequests: [],
      instances: {
        standard: false,
        musical: false,
      },
      cacheFootprint: new Map(),
    };
  }

  private static registerRequest(
    kind: ProcessorKind,
    options: RequestOptions
  ): void {
    const requester = options.requester ?? "unknown";
    const timestamp = Date.now();

    OKLABProcessorSingleton.metrics.totalRequests += 1;
    OKLABProcessorSingleton.metrics.perRequester.set(
      requester,
      (OKLABProcessorSingleton.metrics.perRequester.get(requester) ?? 0) + 1
    );

    OKLABProcessorSingleton.metrics.recentRequests.unshift({
      requester,
      kind,
      timestamp,
    });

    if (OKLABProcessorSingleton.metrics.recentRequests.length > MAX_RECENT_REQUESTS) {
      OKLABProcessorSingleton.metrics.recentRequests.length = MAX_RECENT_REQUESTS;
    }

    const shouldDebugLog =
      options.enableDebug ?? ADVANCED_SYSTEM_CONFIG.enableDebug;

    if (shouldDebugLog) {
      Y3KDebug?.debug?.log(
        "OKLABProcessorSingleton",
        `Singleton request registered for ${kind} processor`,
        {
          requester,
          reason: options.reason,
          metrics: {
            totalRequests: OKLABProcessorSingleton.metrics.totalRequests,
            cacheFootprint: OKLABProcessorSingleton.metrics.cacheFootprint.size,
          },
        }
      );
    }
  }
}

export const getStandardOKLABProcessor = OKLABProcessorSingleton.getStandardOKLABProcessor.bind(
  OKLABProcessorSingleton
);
export const getMusicalOKLABProcessor = OKLABProcessorSingleton.getMusicalOKLABProcessor.bind(
  OKLABProcessorSingleton
);
