// src/lib/ModalManager.ts
class ModalManager {
  private resolvers: Record<string, (result: any) => void> = {};

  openModal(id: string): Promise<any> {
    return new Promise((resolve) => {
      this.resolvers[id] = resolve;
    });
  }

  closeModal(id: string, result: any) {
    if (this.resolvers[id]) {
      this.resolvers[id](result);
      delete this.resolvers[id];
    }
  }
}

export const modalManager = new ModalManager();
