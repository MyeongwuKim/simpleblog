// src/lib/ModalManager.ts

class ModalManager {
  private resolvers: Record<string, (result: unknown) => void> = {};

  openModal(id: string): Promise<unknown> {
    return new Promise((resolve) => {
      this.resolvers[id] = resolve;
    });
  }

  closeModal(id: string, result: unknown) {
    if (this.resolvers[id]) {
      this.resolvers[id](result);
      delete this.resolvers[id];
    }
  }
}

export const modalManager = new ModalManager();
