export interface WorkerPoolLike {
  call<T = any>(type: string, payload: any): Promise<T>;
  destroy(): void;
}

interface WorkerMessage {
  id: number;
  type: string;
  payload: any;
}

interface WorkerResponse {
  id: number;
  result?: any;
  error?: any;
}

/**
 * Extremely lightweight pool wrapper around a single Web Worker.  It queues
 * requests and resolves a Promise once the worker posts a response with the
 * corresponding `id`.
 *
 * NOTE: A *single* worker is used here – future optimisation could expand this
 * into a full multi-worker pool with round-robin scheduling.  The interface
 * remains generic enough to allow such an upgrade without changing callers.
 */
export class WorkerPool implements WorkerPoolLike {
  private _worker: Worker | null = null;
  private _nextId = 1;
  private _pending = new Map<number, (value: any) => void>();

  /**
   * @param workerFactory Either a path/url string or a factory that returns a
   *                       `Worker` instance.  Accepting a factory makes it
   *                       easier to integrate with bundlers (e.g. Vite, Webpack
   *                       `new URL()` patterns).
   */
  constructor(workerFactory: string | URL | (() => Worker)) {
    try {
      this._worker =
        typeof workerFactory === "function"
          ? workerFactory()
          : new Worker(workerFactory as any, { type: "module" });

      this._worker.onmessage = (e: MessageEvent<WorkerResponse>) => {
        const { id, result } = e.data;
        const resolver = this._pending.get(id);
        if (resolver) {
          this._pending.delete(id);
          resolver(result);
        }
      };
    } catch (err) {
      console.warn("[WorkerPool] Failed to initialise worker", err);
      this._worker = null; // Graceful degradation
    }
  }

  call<T = any>(type: string, payload: any): Promise<T> {
    if (!this._worker) {
      // Fallback: resolve immediately on environments without Worker support.
      return Promise.resolve(null as unknown as T);
    }
    const id = this._nextId++;
    return new Promise<T>((resolve) => {
      this._pending.set(id, resolve);
      const msg: WorkerMessage = { id, type, payload } as const;
      this._worker!.postMessage(msg);
    });
  }

  destroy(): void {
    if (this._worker) {
      this._worker.terminate();
      this._worker = null;
    }
    this._pending.clear();
  }
}
