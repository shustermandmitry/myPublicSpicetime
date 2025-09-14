import { makeAutoObservable } from 'mobx';

class AIChatStore {
  private loadingStates: Map<string, boolean> = new Map();

  constructor() {
    makeAutoObservable(this);
  }

  setLoading(entityId: string, isLoading: boolean) {
    this.loadingStates.set(entityId, isLoading);
  }

  isLoading(entityId: string): boolean {
    return this.loadingStates.get(entityId) ?? false;
  }

  clearLoadingState(entityId: string) {
    this.loadingStates.delete(entityId);
  }
}

export const aiChatStore = new AIChatStore();
