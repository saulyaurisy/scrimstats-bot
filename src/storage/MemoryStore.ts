import { Training } from "../models/Training.js";

export class MemoryStore {
  private trainings = new Map<string, Training>();

  create(training: Training): void {
    this.trainings.set(training.channelId, training);
  }

  get(channelId: string): Training | undefined {
    return this.trainings.get(channelId);
  }

  has(channelId: string): boolean {
    return this.trainings.has(channelId);
  }

  delete(channelId: string): boolean {
    return this.trainings.delete(channelId);
  }

  getAll(): Training[] {
    return [...this.trainings.values()];
  }

  clear(): void {
    this.trainings.clear();
  }
}

export const memoryStore = new MemoryStore();