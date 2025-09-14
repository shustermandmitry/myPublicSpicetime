import { metaType } from '@treenity/core';
import { method, write, writeMethod } from '../decorators';
import { Entity, EntityActions, EntityImpl } from '../entity';
import { entity } from '../entity-decorator';
import { EntityManager } from '../entity-manager';

export const TestEntityType = metaType<TestEntityClient>('test-entity');
export const TestEntityServerType = TestEntityType.inContext<TestEntityServer>('server');

@entity(TestEntityType)
class TestEntityClient {
  a: number = 0;
  b: string = 'def';
  c!: Date;
  d?: boolean;

  _unwatched?: string;

  @write
  writeMe(change: Partial<TestEntityClient>) {
    Object.assign(this, change);
  }

  @method
  async callMe(param: string): Promise<string> {
    return (this.b = 'callMe_' + param);
  }

  @writeMethod
  async callWriteMe(param: string): Promise<void> {
    this.b = param;
  }
}

@entity(TestEntityType.inContext('server'))
class TestEntityServer extends TestEntityClient {
  serverOnlyProperty!: string;

  @method
  async callMe(param: string): Promise<string> {
    return (this.b = 'callMeServer_' + param);
  }

  @writeMethod
  async callWriteMe(param: string): Promise<void> {
    this.b = 'callWriteMe_' + param;
  }
}

const entityData = {
  $id: 'id',
  $type: 'test-entity',
  b: 'abc',
  a: 100500,
};

let manager: EntityManager;
let managerServer: EntityManager;
let actions: EntityActions<any>;
let testEntity: Entity<TestEntityClient>;
let testEntityServer: Entity<TestEntityServer>;

describe('client entity', () => {
  beforeEach(async () => {
    manager = new EntityManager('client');
    actions = {
      init: jest.fn(),
      patch: jest.fn(),
      subscribe: jest.fn(),
      execute: jest.fn(),
    };
    testEntity = await manager.ensure(entityData, actions, TestEntityType);
  });

  test('types', () => {
    expect(testEntity).toBeInstanceOf(TestEntityClient);
  });

  test('entity types', () => {
    type X = { x: number };
    const x: Entity<X> = new EntityImpl<X>() as Entity<X>;
    x.$ = {
      variants: {},
      actions: null!,
      meta: null!,
      id: '1',
      rev: 0,
      type: metaType<X>('x'),
      obj: { x: 1 },
      raw: { x: 1, $id: '1', $type: 'x' },
      options: {},
      manager: null!,
      addVariantOverride: jest.fn(),
      removeVariantOverride: jest.fn(),
      getVariant: jest.fn(),
    };

    const x1: X = x;

    const y = x1 as Entity<X>;

    expect(y.$.id).toBe('1');
  });

  test('test subscribe', async () => {
    expect(Object.keys(testEntity)).toEqual(['_unwatched', 'a', 'b', 'c', 'd']);
    expect((actions.subscribe as jest.Mock).mock.calls.length).toBe(1);
    expect((actions.subscribe as jest.Mock).mock.calls[0].length).toBe(2);
  });

  test('can be created without subscribe', async () => {
    delete actions.subscribe;
    const entity = manager.ensure({ ...entityData, $id: 'id2' }, actions, TestEntityType);
    await expect(entity).resolves.toBeInstanceOf(TestEntityClient);
  });

  test('can be called', async () => {
    const result = await testEntity.callMe('test');

    expect(result).toBe('callMe_test');
    expect(testEntity.b).toBe('callMe_test');
    expect((actions.execute as jest.Mock).mock.calls.length).toBe(1);
    expect((actions.execute as jest.Mock).mock.calls[0]).toEqual([testEntity, 'callMe', ['test']]);
  });

  test('can be called if execute return value', async () => {
    const execute = actions.execute as jest.Mock;
    execute.mockReturnValueOnce(Promise.resolve('executed'));

    const result = await testEntity.callMe('test2');

    expect(result).toBe('executed');
    expect(testEntity.b).toBe('callMe_test2');
    expect(execute.mock.calls.length).toBe(1);
    expect(execute.mock.calls[0]).toEqual([testEntity, 'callMe', ['test2']]);
  });

  test('can be called without execute', async () => {
    delete actions.execute;

    const entity = manager.ensure({ ...entityData, $id: 'id2' }, actions, TestEntityType);
    await expect(entity).resolves.toBeInstanceOf(TestEntityClient);
  });
});

describe('server entity', () => {
  beforeEach(async () => {
    manager = new EntityManager('server');
    actions = {
      init: jest.fn(),
      patch: jest.fn(),
      subscribe: jest.fn(),
      execute: jest.fn(),
    };
    testEntity = await manager.ensure(entityData, actions, TestEntityType);
  });

  test('types', () => {
    expect(testEntity).toBeInstanceOf(TestEntityServer);
  });

  test('test subscribe', async () => {
    const subscribe = actions.subscribe as jest.Mock;

    expect(Object.keys(testEntity)).toEqual([
      '_unwatched',
      'a',
      'b',
      'c',
      'd',
      'serverOnlyProperty',
    ]);
    expect(subscribe.mock.calls.length).toBe(1);
    expect(subscribe.mock.calls[0].length).toBe(2);
  });

  test('can be created without subscribe', async () => {
    delete actions.subscribe;
    const entity = manager.ensure({ ...entityData, $id: 'id2' }, actions, TestEntityType);
    await expect(entity).resolves.toBeInstanceOf(TestEntityServer);
  });

  test('can be called', async () => {
    const execute = actions.execute as jest.Mock;

    const result = await testEntity.callMe('test');

    expect(result).toBe('callMeServer_test');
    expect(execute.mock.calls.length).toBe(0);
  });

  test('can be called if execute return value', async () => {
    const execute = actions.execute as jest.Mock;
    execute.mockReturnValueOnce(Promise.resolve('executed'));

    const result = await testEntity.callMe('test2');

    expect(result).toBe('callMeServer_test2');
    expect(testEntity.b).toBe('callMeServer_test2');
    expect(execute.mock.calls.length).toBe(0);
  });

  test('can be called without execute', async () => {
    delete actions.execute;

    const entity = manager.ensure({ ...entityData, $id: 'id2' }, actions, TestEntityType);
    await expect(entity).resolves.toBeInstanceOf(TestEntityServer);
  });

  test('patch called', async () => {
    const patch = actions.execute as jest.Mock;

    testEntity.writeMe({ a: 10 });

    expect(patch.mock.calls.length).toBe(0);
    await expect(testEntity.a).toBe(10);
  });

  test('working without patch', async () => {
    delete actions.patch;

    const entity = manager.ensure({ ...entityData, $id: 'id2' }, actions, TestEntityType);
    await expect(entity).resolves.toBeInstanceOf(TestEntityServer);
  });
});
