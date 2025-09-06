// src/lib/ModalManager.ts

class ModalManager {
  private resolvers: Record<string, (result: number | string | null) => void> =
    {};

  openModal(id: string): Promise<number | string | null> {
    return new Promise((resolve) => {
      this.resolvers[id] = resolve;
    });
  }

  closeModal(id: string, result: number | string | null) {
    if (this.resolvers[id]) {
      this.resolvers[id](result);
      delete this.resolvers[id];
    }
  }
}

export const modalManager = new ModalManager();
