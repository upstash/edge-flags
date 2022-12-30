export class Cache<T> {
  private readonly maxAge?: number;
  private map: Map<string, { expires?: number; value: T }>;
  constructor(maxAge?: number) {
    this.maxAge = maxAge && maxAge > 0 ? maxAge : undefined;
    this.map = new Map();
  }
  set(key: string, value: T) {
    this.map.set(key, {
      expires: this.maxAge ? Date.now() + this.maxAge : undefined,
      value,
    });
  }

  get(key: string): T | null {
    const item = this.map.get(key);
    if (!item) {
      return null;
    }
    if (item.expires && item.expires < Date.now()) {
      this.map.delete(key);
      return null;
    }
    return item.value;
  }
}
