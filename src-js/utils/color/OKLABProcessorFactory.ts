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

export class OKLABProcessorFactory {
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
    if (!OKLABProcessorFactory.standardInstance) {
      OKLABProcessorFactory.standardInstance = new OKLABColorProcessor(
        options.enableDebug ?? ADVANCED_SYSTEM_CONFIG.enableDebug
      );
      OKLABProcessorFactory.metrics.instances.standard = true;
    }

    OKLABProcessorFactory.registerRequest("standard", options);
    return OKLABProcessorFactory.standardInstance;
  }

  public static getMusicalOKLABProcessor(
    options: RequestOptions = {}
  ): MusicalOKLABProcessor {
    if (!OKLABProcessorFactory.musicalInstance) {
      const MusicalCtor = resolveMusicalProcessorCtor();
      OKLABProcessorFactory.musicalInstance = new MusicalCtor(
        options.enableDebug ?? ADVANCED_SYSTEM_CONFIG.enableDebug
      );
      OKLABProcessorFactory.metrics.instances.musical = true;
    }

    OKLABProcessorFactory.registerRequest("musical", options);
    return OKLABProcessorFactory.musicalInstance;
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

    OKLABProcessorFactory.metrics.cacheFootprint.set(name, cacheMetrics);
  }

  public static getProcessingMetrics() {
    return cloneMetrics(OKLABProcessorFactory.metrics);
  }

  public static getMemoryStats() {
    return {
      standardInstances: OKLABProcessorFactory.standardInstance ? 1 : 0,
      musicalInstances: OKLABProcessorFactory.musicalInstance ? 1 : 0,
      trackedCaches: OKLABProcessorFactory.metrics.cacheFootprint.size,
    };
  }

  public static ensureAvailability(kind: ProcessorKind, requester?: string): boolean {
    const instance =
      kind === "standard"
        ? OKLABProcessorFactory.standardInstance
        : OKLABProcessorFactory.musicalInstance;

    if (!instance) {
      const message =
        kind === "standard"
          ? "Standard OKLABColorProcessor has not been initialized"
          : "Musical OKLABColorProcessor has not been initialized";
      console.warn(`[OKLABProcessorFactory] ${message}`, {
        requester,
      });
      return false;
    }

    return true;
  }

  public static resetForTests(): void {
    OKLABProcessorFactory.standardInstance = null;
    OKLABProcessorFactory.musicalInstance = null;
    OKLABProcessorFactory.metrics = {
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

    OKLABProcessorFactory.metrics.totalRequests += 1;
    OKLABProcessorFactory.metrics.perRequester.set(
      requester,
      (OKLABProcessorFactory.metrics.perRequester.get(requester) ?? 0) + 1
    );

    OKLABProcessorFactory.metrics.recentRequests.unshift({
      requester,
      kind,
      timestamp,
    });

    if (OKLABProcessorFactory.metrics.recentRequests.length > MAX_RECENT_REQUESTS) {
      OKLABProcessorFactory.metrics.recentRequests.length = MAX_RECENT_REQUESTS;
    }

    const shouldDebugLog =
      options.enableDebug ?? ADVANCED_SYSTEM_CONFIG.enableDebug;

    if (shouldDebugLog) {
      Y3KDebug?.debug?.log(
        "OKLABProcessorFactory",
        `Factory request registered for ${kind} processor`,
        {
          requester,
          reason: options.reason,
          metrics: {
            totalRequests: OKLABProcessorFactory.metrics.totalRequests,
            cacheFootprint: OKLABProcessorFactory.metrics.cacheFootprint.size,
          },
        }
      );
    }
  }
}

export const getStandardOKLABProcessor = OKLABProcessorFactory.getStandardOKLABProcessor.bind(
  OKLABProcessorFactory
);
export const getMusicalOKLABProcessor = OKLABProcessorFactory.getMusicalOKLABProcessor.bind(
  OKLABProcessorFactory
);
