/*
 * Copyright (c) 2024. Treenity Inc.
 */

// import { MetaRaw, metaType, Node, NodeRaw, types } from '@treenity/core';
import { Entity, entity, EntityActions, EntityManager, method, writeMethod } from '@treenity/entity';
import '../..';
// import { classFactory, Raw } from '@treenity/js-shared/utils';
import { NodeEntityImpl, NodeEntityType } from '../node.entity';
import { TestEntity, TestEntityType } from './test.entity';

describe('Node-meta entity operations', () => {
  const manager = new EntityManager();

  test('get from node', async () => {
    const testActions: EntityActions<any> = {
      execute<R>(entity: Entity<any>, method: string, args: any[]): Promise<R> {
        return entity[method](...args);
      },
      patch(entity: Entity<any>, patches: []): Promise<void> {
        return entity.$onUpdate(patches);
      },
      subscribe(entity: Entity<any>, cb: (patches: [], cancel: () => void) => void): () => void {
        return () => {};
      },
    };

    const nodeData = {
      $type: 'node',
      $id: 'node-1',
      metas: {
        test: {
          $id: 'test-1',
          $type: 'test.entity',
          a: 'hello',
          b: 3.14,
          c: false
        }
      }
    }

    const node = await manager.ensure(nodeData, testActions, NodeEntityType);
    const test = await node.get(TestEntityType);

    expect(test.a).toBe('hello');
  });
})