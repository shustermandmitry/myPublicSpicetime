/*
 * Copyright (c) 2024. Treenity Inc.
 */

import { MetaRaw, metaType, Node, NodeRaw, types } from '@treenity/core';
import { Entity, entity, EntityActions, EntityManager, method, writeMethod } from '@treenity/entity';
import '../..';
import { classFactory, Raw } from '@treenity/js-shared/utils';
import { NodeEntityImpl, NodeEntityType } from '../node.entity';
// import NodeSchema from './'
//
// type NodeType = TypeFrom<typeof NodeSchema>;

export const ServiceRaw = metaType<ServiceImpl>('sys.service');
export const ServiceType = ServiceRaw.inContext('client');
export type ServiceType = typeof ServiceType & {
  impl: ServiceImpl;
  ref: ServiceImpl;
};
const ServiceServerType = ServiceRaw.inContext<ServiceServerImpl>('server');
export const NodeRawType = metaType<NodeRaw>('node');
const NodeType = NodeRawType.inContext<NodeEntityImpl>('client');

@entity(ServiceType)
class ServiceImpl {
  name: string = 'service';
  test: number = 5;

  @method
  send(param: string): Promise<number> {
    return undefined!;
  }

  @method
  async find(value: string): Promise<Node> {
    return {
      $id: value,
      $name: value,
      $type: 'node',
      $perm: {},
      url: '/service',
      refs: [],
      metas: {},
      path: '/service',
    } as NodeRaw & MetaRaw as unknown as Node;
  }

  @writeMethod
  async setName(newName: string): Promise<void> {
    this.name = newName;
  }
}

@entity(ServiceType.server)
class ServiceServerImpl extends ServiceImpl {
  async find(value: string): Promise<Node> {
    return {
      $id: value,
      $type: 'node',
      $perm: {},
      url: '/service',
      refs: [],
      metas: {},
      get path() {
        return this.url;
      },
    } as NodeRaw & MetaRaw as unknown as Node;
  }
}

types.entity.add('client', NodeType, classFactory(NodeEntityImpl), {});
types.entity.add(ServiceRaw, svc => svc, {});
types.entity.add('client', ServiceType, classFactory(ServiceImpl), {});

const nodeData = {
  $id: 'node-id',
  $type: 'node',
  url: '/',
  refs: [],
  metas: {
    service: {
      $id: 'id',
      $type: 'sys.service',
      $name: 'service',
      name: 'service',
    } as MetaRaw & Raw<ServiceImpl>,
    service2: {
      $id: 'id2',
      $type: 'sys.service',
      $name: 'service2',
      name: 'service2',
    } as MetaRaw & Raw<ServiceImpl>,
  },
};

export type Node2 = typeof nodeData;

const manager = new EntityManager();

const testActions: EntityActions<any> = {
  execute<R>(entity: Entity<any>, method: string, args: any[]): Promise<R> {
    return Promise.resolve(undefined as R);
  },
  patch(entity: Entity<any>, patches: []): Promise<void> {
    return Promise.resolve(undefined);
  },
  subscribe(entity: Entity<any>, cb: (patches: [], cancel: () => void) => void): () => void {
    return function() {
    };
  },
};

let node: Entity<Node>;

type Predicate = (key: string, value: any) => number;

describe('node', () => {
  beforeAll(async () => {
    node = await manager.ensure(nodeData, testActions, NodeEntityType);
  });

  test('should return different services', async () => {
    expect(node.url).toBe('/');

    const service1 = await node.get(ServiceType);
    const service1_2 = await node.get(ServiceType);
    const service2 = await node.get(ServiceType, '$service2');

    expect(service1).toEqual(service1_2);
    expect(service1).not.toEqual(service2);

    // const test = await service.find('something');
  });
  test('should return right types', async () => {
    const serviceRaw = await node.raw(ServiceRaw);
    const service = await node.get(ServiceType);
    const service2 = await node.get(ServiceType, '$service2');

    expect(serviceRaw instanceof ServiceImpl).toBeFalsy();
    expect(service instanceof ServiceImpl).toBeTruthy();
    expect(service2 instanceof ServiceImpl).toBeTruthy();
  });

  test('can run $$ call chain', async () => {
    const url = await node.$$.$get(ServiceType).find('something').url;
    const service = await node.$$.$get(ServiceType);
    const service2 = await node.$$.$get(ServiceType, '$service2').find('something');

    expect(url).toEqual('/service');
    expect(service instanceof ServiceImpl).toBeTruthy();
    expect(service2.url).toEqual('/service');
  });
  // test('add meta to node', async () => {
  //   node.add(ServiceType, 'new-service');
  // });
});
