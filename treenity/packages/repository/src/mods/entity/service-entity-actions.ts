/*
 * Copyright (c) 2024. Treenity Inc.
 */

import { TreeServiceType } from '@/services/types';
import { awaitService } from '@/utils';
import { stripSlashes } from '@feathersjs/commons';
import type { HookContext } from '@feathersjs/feathers';
import { FromMetaType, MetaRaw } from '@treenity/core';
import { Entity, EntityActions } from '@treenity/entity';
import { Raw } from '@treenity/js-shared/utils';
import type { Operation } from 'fast-json-patch';

export type ClientOrServer = 'client' | 'server';

export function makeServiceActions(
  context: ClientOrServer,
  hookContext: Pick<HookContext, 'path' | 'app' | 'service'>,
): EntityActions<any> {
  const { path, app, service } = hookContext;
  if (context === 'client') {
    // save promise returning service for future usage
    let entityService: Promise<FromMetaType<typeof TreeServiceType>> = null!;
    return {
      service,
      app,
      patch(entity: Entity<any>, patches: Operation[]) {
        return undefined!;
      },
      execute<R>(entity: Entity<any>, method: string, args: any[]): Promise<R> {
        const id = entity.$.id;
        return (entityService ??= awaitService(app, `/sys/entity`, TreeServiceType)).then(service =>
          service.execute({
            service: path,
            id,
            method,
            args,
          }),
        );
      },
      subscribe(entity: Entity<any>, cb: (patches: Operation[], cancel: () => void) => void) {
        const id = entity.$.id;
        const handler = (patchedId: string, patches: Operation[]) => {
          if (id === patchedId) {
            cb(patches, () => app.off('sub', handler));
          }
        };
        app.on('sub', handler);
        return () => app.off('sub', handler);
      },
    } as EntityActions<any> & Record<string, any>;
  } else {
    return {
      app,
      service,
      create<T>(data: Partial<MetaRaw & Raw<T>>, ctx?: any): Promise<Raw<T>> {
        const { parent, $name, ...rest } = data as any;

        const $path = stripSlashes((data as any).parent) + '/' + data.$name;
        return service.create(rest, { path: $path }, ctx);
      },
      remove<T>(entity: Entity<any>, ctx?: any): Promise<void> {
        return service.remove(entity.$.id, {}, ctx);
      },
      patch(entity: Entity<any>, patches: Operation[], ctx?: any) {
        const id = entity.$.id;
        return service.patch(id, patches, ctx);
      },
      // async execute<R>(entity: Entity<any>, method: string, args: any[]): Promise<R> {
      //   const id = entity.$id;
      //   return awaitService(app, `/sys/tree`, TreeServiceType).then(service => {
      //     return service.execute({ service: path, id, method, args });
      //   });
      // },
      subscribe(entity: Entity<any>, cb: (patches: Operation[], cancel: () => void) => void) {
        const id = entity.$.id;
        const res = service.on('patched', (patchedId: string, patches: Operation[]) => {
          if (id === patchedId) {
            cb(patches, () => res());
          }
        });
        return res;
      },
    } as EntityActions<any> & Record<string, any>;
  }
}
