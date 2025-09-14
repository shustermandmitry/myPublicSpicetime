/*
 * Copyright (c) 2024. Treenity Inc.
 */

import { FEATHERS_METHOD_CONTEXT } from '@/mods/entity/feathers-method-context';
import { Application, NullableId, Params, Query } from '@feathersjs/feathers';
import { Node } from '@treenity/core';
import { Entity } from '@treenity/entity';
import { CliParams, TreenityService } from '@treenity/feathers-service';
import { copyElements } from '@treenity/js-shared/utils';
import { Operation } from 'fast-json-patch';

export class EntityManagerService extends TreenityService<
  Node,
  Partial<Node>,
  Params & CliParams,
  Operation[]
> {
  resolver: TreenityService<Entity<Node>> = null!; // any
  private app!: Application;

  customMethods = ['execute'];

  constructor(
    public resolverUrl: string,
    public permissionUrl: string,
  ) {
    super();
  }

  async setup(app: Application, path: string) {
    this.app = app;
    this.resolver = app.service(this.resolverUrl) as unknown as TreenityService<Entity<Node>>;
  }

  async patch(id: NullableId, data: any, params?: Params<Query>): Promise<Node> {
    const sub = (await this.resolver.patch(id, data, params)) as Node;
    this.emit('sub', sub);
    return null!;
  }

  async execute(params: { id: string; method: string; args: any[]; service: string }, ctx: any) {
    // @ts-ignore failed in tests
    await this.app.service(this.permissionUrl).check(
      {
        query: {
          path: params.service,
          method: params.method,
        },
      },
      ctx,
    );

    const service = (this.app as Application<{ [name: string]: TreenityService<any> }>).service(
      params.service,
    );
    // @ts-ignore
    const entity = await service.get(params.id, { entity: true }, ctx);
    if (!entity) throw new Error(`Entity not found: ${params.id} to execute ${params.method}`);

    const methodInfo = entity.$.options.methods[params.method];

    // !!! copy only needed args, because client can call method with more args,
    // and replace ctx in params as a security issue
    ctx.entity = false;
    const args = copyElements(params.args, methodInfo.argsCount);
    Object.defineProperty(entity, FEATHERS_METHOD_CONTEXT, {
      enumerable: false,
      value: ctx,
      configurable: true,
    });

    const result = await entity[params.method](...args, ctx);

    delete (entity as any)[FEATHERS_METHOD_CONTEXT];
    return result;
  }
}

export default EntityManagerService;
