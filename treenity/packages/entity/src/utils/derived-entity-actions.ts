import { Operation } from 'fast-json-patch';
import { Entity, EntityActions } from '../entity';

type Actions = EntityActions<any> & {
  self: Entity<{}>;
  getPrefix: (entity: Entity<{}>) => string;
  callRemote: any;
  isClient: boolean;
};

/**
 * This factory will create you actions, if you want to call and apply patches to entities, made from your entity
 * For example, if you want to return entities from node metas, it will help, see usages
 */
const derivedActions: Actions = {
  self: null!,
  isClient: null!,
  getPrefix: null!,
  callRemote: null!,
  patch(entity: Entity<{}>, patches: Operation[]) {
    const prefix = this.getPrefix(entity);

    const innerPatches = patches.map(p => ({
      ...p,
      path: prefix + p.path,
    }));

    this.self.$onUpdate(innerPatches);

    if (this.isClient) {
      return Promise.resolve();
    } else {
      return this.self.$.actions.patch!(this.self, innerPatches);
    }
  },
  execute(entity: Entity<{}>, method: string, args: any[]) {
    if (this.isClient) {
      return this.callRemote(entity, method, args);
    }
    return undefined!;
  },
  subscribe(
    entity: Entity<any>,
    cb: (patches: Operation[], cancel: () => void) => void,
  ): () => void {
    const prefix = this.getPrefix(entity);
    return this.self.$.actions.subscribe!(this.self, (patches, cancel) => {
      // make patches paths shorter to patch meta
      let filtered = patches
        .filter(p => p.path.startsWith(prefix))
        .map(p => ({ ...p, path: p.path.slice(prefix.length) }));

      if (!filtered.length) return;

      cb(filtered, cancel);
    });
  },
} as Actions;

export const makeDerivedActions = <T, E>(
  self: Entity<E>,
  getPrefix: any,
  callRemote: any,
): EntityActions<T> => {
  const actions = Object.create(derivedActions, {
    isClient: { value: self.$.type.$context === 'client' },
    self: { value: self },
    getPrefix: { value: getPrefix },
    callRemote: { value: callRemote },
  });
  // remove derived if not present
  if (!self.$.actions.patch) actions.patch = null;
  if (!self.$.actions.execute) actions.execute = null;
  if (!self.$.actions.subscribe) actions.subscribe = null;

  return actions;
};
