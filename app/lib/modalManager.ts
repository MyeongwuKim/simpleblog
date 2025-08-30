// src/lib/ModalManager.ts
class ModalManager {
  private resolvers: Record<string, (result: number) => void> = {};

  openModal(id: string): Promise<number> {
    return new Promise((resolve) => {
      this.resolvers[id] = resolve;
    });
  }

  closeModal(id: string, result: number) {
    if (this.resolvers[id]) {
      this.resolvers[id](result);
      delete this.resolvers[id];
    }
  }
}

export const modalManager = new ModalManager();
