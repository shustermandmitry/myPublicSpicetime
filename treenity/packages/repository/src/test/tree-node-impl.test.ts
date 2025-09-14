// For more information about this file see https://dove.feathersjs.com/guides/cli/app.test.html
import { Application } from '@/declarations';
import { TreeServiceType } from '@/services/types';
import { createClientServer } from '@/test/create-client.server';
import awaitService from '@/utils/service-awaiter';
import { TransportConnection } from '@feathersjs/feathers';
import { Meta, metaType } from '@treenity/core';
import { entity, EntityActions, write } from '@treenity/entity';
import { NodeEntityImpl, TreeNode } from '@treenity/tree-api';

class NoErrorThrownError extends Error {}

jest.setTimeout(100000);

const getError = async <TError>(call: () => unknown): Promise<TError> => {
  try {
    await call();

    throw new NoErrorThrownError();
  } catch (error: unknown) {
    return error as TError;
  }
};

interface TreeServiceRaw {
  root: string;
}

const meta = {
  $id: '21gAe2kPbPus7779iADp5',
  $name: 'tree-fs-service',
  $type: 'sys.tree-fs-service',
  root: __dirname + '/db',
} as Meta<TreeServiceRaw> & TreeServiceRaw;

class EntityImpl {
  constructor(raw: any, meta: Meta<EntityImpl>, actions: EntityActions<any>) {
    Object.assign(this, raw);
  }
}

const TestEntity = metaType<TestEntityClient>('test-entity');

@entity(TestEntity.client)
class TestEntityClient extends EntityImpl {
  name: string = 'Some Name';

  @write
  async updateName(name: string) {
    this.name = name;
  }
}

@entity(TestEntity.server)
class TestEntityServer extends TestEntityClient {}

function localCaller<T>(): TransportConnection<T> {
  const tc = function (p1: Application<T>) {} as TransportConnection<T>;
  tc.Service = null!;

  return tc;
}

describe('Tree nodes and entities', () => {
  let app: Application;
  let client: Application;
  const path = '/ac-1';

  beforeAll(async () => {
    ({ app, client } = await createClientServer());
  });

  afterAll(async () => {
    app.teardown();
  });

  it('Tree api', async () => {
    const service = await awaitService(app, '/sys/tree', TreeServiceType);

    const node0 = await service.get('/a/b', { entity: true });
    await expect(async () => node0.get(TestEntity)).rejects.toThrow(
      'entity test-entity in tree:/a/b not found',
    );

    const node = await service.get('/a/b/entity', { entity: true });

    expect(node).toBeInstanceOf(NodeEntityImpl);

    const testEntity = await node.get(TestEntity);

    await testEntity.updateName('New Name');

    expect(testEntity.name).toBe('New Name');
  });

  it('create-remove node', async () => {
    const service = await awaitService(app, '/sys/tree', TreeServiceType);

    const node = await service.get('/a/b/entity', { entity: true });
    let child = await node.child('child').catch(() => null);

    expect(child).toBeNull();

    child = await node.createChild({ name: 'child' });

    expect(child).not.toBeFalsy();

    // expect(child).toBeInstanceOf(NodeEntityImpl);

    let child2 = await node.child('child').catch(() => null);
    expect(child2).not.toBeFalsy();

    await child2!.removeNode();

    child2 = await node.child('child').catch(() => null);
    expect(child2).toBeFalsy();
  });

  it('create-remove meta in node', async () => {
    const service = await awaitService(app, '/sys/tree', TreeServiceType);

    const node = await service.get('/a/b/entity', { entity: true });

    await node
      .child('child2')
      .then(child => child.removeNode())
      .catch(console.warn);
    const child = await node.createChild({ name: 'child2' });

    const testEntity = await child.add(TestEntity, { name: 'Some Name' }, 'task');
    await child.add(TestEntity, { name: 'Some Name 2 ' });
    const testMeta3 = await child.add(TestEntity, { name: 'Some Name 3' });

    expect(await child.remove('$test-entity')).toBeTruthy();
    expect(await child.remove(testMeta3)).toBeTruthy();

    expect(testEntity).toBeInstanceOf(TestEntityClient);

    expect(child.allRaw().length).toBe(1);

    const testEntity2 = await child.get(TestEntity, '$task');
    expect(testEntity2).toBeInstanceOf(TestEntityClient);
    expect(testEntity2).toEqual(testEntity);

    // let child2 = await node.child('child').catch(() => null);
    // expect(child2).not.toBeFalsy();
    //
    // await child2!.removeNode();
    //
    // child2 = await node.child('child').catch(() => null);
    // expect(child2).toBeFalsy();
  });

  it('create-remove meta in node from client', async () => {
    const service = client.service('/sys/tree');

    const node = (await service.get('/a/b/entity', { entity: true })) as TreeNode;

    await node
      .child('child2')
      .then(child => child.removeNode())
      .catch(console.warn);

    const child = await node.createChild({ name: 'child2' });

    const testEntity = await child.add(TestEntity, { name: 'Some Name' }, 'task');
    await child.add(TestEntity, { name: 'Some Name 2 ' });
    const testMeta3 = await child.add(TestEntity, { name: 'Some Name 3' });

    expect(await child.remove('$test-entity')).toBeTruthy();
    // XXX todo remove from client by meta
    // let remove = await child.remove(testMeta3);
    // expect(remove).toBeTruthy();

    expect(testEntity).toBeInstanceOf(TestEntityClient);

    expect(child.allRaw().length).toBe(2);

    const testEntity2 = await child.get(TestEntity, '$task');
    expect(testEntity2).toBeInstanceOf(TestEntityClient);
    expect(testEntity2).toEqual(testEntity);

    // let child2 = await node.child('child').catch(() => null);
    // expect(child2).not.toBeFalsy();
    //
    // await child2!.removeNode();
    //
    // child2 = await node.child('child').catch(() => null);
    // expect(child2).toBeFalsy();
  });
});
