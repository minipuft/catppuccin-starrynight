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

  public destroy(): void {
    this.subscribers = {};
  }
}

// Create a singleton instance for global use
export const GlobalEventBus = new EventBus();
