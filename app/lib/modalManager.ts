// src/lib/ModalManager.ts

class ModalManager {
  private resolvers: Record<string, (result: unknown) => void> = {};

  create<T>(id: string): Promise<T> {
    return new Promise((resolve) => {
      this.resolvers[id] = resolve as (result: unknown) => void;
    });
  }

  resolve(id: string, result: unknown) {
    if (this.resolvers[id]) {
      this.resolvers[id](result);
      delete this.resolvers[id];
    }
  }

  cleanup(id: string, fallbackResult: unknown) {
    this.resolve(id, fallbackResult);
  }

  cleanupMany(ids: string[], fallbackResult: unknown) {
    ids.forEach((id) => this.cleanup(id, fallbackResult));
  }
}

export const modalManager = new ModalManager();
