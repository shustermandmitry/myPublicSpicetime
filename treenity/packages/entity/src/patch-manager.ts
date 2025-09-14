import { Operation } from 'fast-json-patch';

/**
 * Manages entity updates by batching and consolidating patches over time.
 * Implements singleton pattern per entity to optimize network calls and
 * prevent redundant updates to the same entity paths.
 */
export default class PatchManager {
  private static instances = new Map<string, PatchManager>();
  private patches: Operation[] = [];
  private timeoutId?: NodeJS.Timeout;

  private constructor(
    private entityId: string,
    private executePatches: (patches: Operation[]) => Promise<void>,
  ) {}

  /**
   * Gets or creates a PatchManager instance for a given entity
   * @param entityId - Unique identifier for the entity
   * @param executeFn - Function to execute the consolidated patches
   * @returns The PatchManager instance for this entity
   */
  static getInstance(entityId: string, executeFn: (patches: Operation[]) => Promise<void>) {
    if (!this.instances.has(entityId)) {
      this.instances.set(entityId, new PatchManager(entityId, executeFn));
    }
    return this.instances.get(entityId)!;
  }

  /**
   * Adds new patches to the queue and schedules them for batch processing
   * @param patches - Array of JSON patch operations to be applied
   */
  addPatches(patches: Operation[]) {
    this.patches.push(...patches);
    this.scheduleBatch();
  }

  private consolidatePatches(patches: Operation[]): Operation[] {
    const pathMap = new Map<string, Operation>();

    patches.forEach(patch => {
      pathMap.set(`${patch.op}:${patch.path}`, patch);
    });

    return Array.from(pathMap.values());
  }

  private scheduleBatch() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = setTimeout(async () => {
      const consolidatedPatches = this.consolidatePatches(this.patches);
      this.patches = [];

      await this.executePatches(consolidatedPatches);
    }, 1000);
  }
}
