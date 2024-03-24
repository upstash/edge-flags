/**
 * A simple cache implementation with ttl support
 */
export class Cache<T> {
  private readonly ttl?: number;
  private map: Map<string, { createdAt: number; value: T }>;
  constructor(ttl?: number) {
    this.ttl = ttl && ttl > 0 ? ttl : undefined;
    this.map = new Map();
  }
  set(key: string, value: T) {
    this.map.set(key, {
      createdAt: Date.now(),
      value,
    });
  }

  get(key: string): T | null {
    const item = this.map.get(key);
    if (!item) {
      return null;
    }
    if (this.ttl && (item.createdAt + this.ttl) < Date.now()) {
      this.map.delete(key);
      return null;
    }
    return item.value;
  }
}
