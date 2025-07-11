// src-js/core/EventBus.ts

type Callback<T> = (payload: T) => void;

export class EventBus {
  private subscribers: { [topic: string]: Set<Callback<any>> } = {};

  public subscribe<T>(topic: string, callback: Callback<T>): () => void {
    if (!this.subscribers[topic]) {
      this.subscribers[topic] = new Set();
    }
    this.subscribers[topic].add(callback);

    // Return an unsubscribe function
    return () => {
      if (this.subscribers[topic]) {
        this.subscribers[topic].delete(callback);
        if (this.subscribers[topic].size === 0) {
          delete this.subscribers[topic];
        }
      }
    };
  }

  public publish<T>(topic: string, payload: T): void {
    if (this.subscribers[topic]) {
      this.subscribers[topic].forEach((callback) => {
        try {
          callback(payload);
        } catch (error) {
          console.error(
            `[EventBus] Error in subscriber for topic "${topic}":`,
            error
          );
        }
      });
    }
  }

  public unsubscribe<T>(topic: string, callback: Callback<T>): void {
    if (this.subscribers[topic]) {
      this.subscribers[topic].delete(callback);
      if (this.subscribers[topic].size === 0) {
        delete this.subscribers[topic];
      }
    }
  }

  // -------------------------------------------------------------------
  // Compatibility aliases (v2 API) ------------------------------------
  // These provide ergonomic `on` / `emit` helpers used throughout newer
  // systems while retaining the underlying subscribe/publish semantics.
  // -------------------------------------------------------------------

  /**
   * Alias for `subscribe` to improve readability (`on('topic', cb)`).
   */
  public on<T>(topic: string, callback: Callback<T>): () => void {
    return this.subscribe(topic, callback);
  }

  /**
   * Alias for `publish` so call sites can use `emit('topic', data)`.
   */
  public emit<T>(topic: string, payload: T): void {
    this.publish(topic, payload);
  }

  public destroy(): void {
    this.subscribers = {};
  }
}

// Create a singleton instance for global use
export const GlobalEventBus = new EventBus();

// ---------------------------------------------------------------------------
// 🌐 Debug Convenience: expose the singleton on global scope for DevTools.
// This adds **no runtime dependency**—in production builds the global symbol is
// harmless and tree-shaking minifiers will keep the import intact.  Guarded to
// avoid overwrite during hot-reload loops.
// ---------------------------------------------------------------------------
const g = globalThis as any;
if (!g.GlobalEventBus) {
  g.GlobalEventBus = GlobalEventBus;
}
