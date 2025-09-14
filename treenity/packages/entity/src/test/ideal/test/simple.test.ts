import { Meta, MetaType, metaType } from '@treenity/core';
import '../simple.entity';
import { Raw } from '@treenity/js-shared/utils';
import { Operation } from 'fast-json-patch';
import { createEntity } from '../../../create-entity';
import { Entity, EntityActions } from '../../../entity';
import { EntityManager } from '../../../entity-manager';
import { MySimple, MySimpleType } from '../simple.entity';
import '../simple.entity.server';

type Params<T> = {
  query: T;
};

type WithName = {
  name: string;
};

type X = Raw<{
  name: string;
  test(): void;
}>;

const x: X = {} as X;
x.name = '1asdf';

let SIMPLES: (Raw<MySimple> & Meta)[] = [
  {
    $id: 'test',
    $type: 'simple',
    name: '123',
    age: 12,
    health: 100,
  },
  {
    $id: 'test2',
    $type: 'simple',
    name: '321',
    age: 13,
    health: 85,
  },
  {
    $id: 'test3',
    $type: 'simple',
    name: '567',
    age: 15,
    health: 60,
  },
];

const service = {
  manager: new EntityManager(),

  async find<T>(type: MetaType<T>, params: Params<WithName>): Promise<T | undefined> {
    const idx = SIMPLES.findIndex(s => s.name === params.query.name);
    if (idx < 0) return undefined;
    const data = SIMPLES[idx];

    let simpleClient: Entity<any> = null!;
    let simpleServer: Entity<any> = null!;

    const cliCtx = {
      subs: new Set<any>(),

      async patch(id, cb) {},
      async execute(id, method, args) {
        return simpleServer[method](...args);
      },
      subscribe(
        this: any,
        id: string,
        cb: (entity: Operation[], cancel: () => void) => void,
      ): () => void {
        this.subs.add(cb);
        return () => {
          this.subs.delete(cb);
        };
      },
    } as EntityActions<any>;

    const srvCtx = {
      subs: new Set<any>(),

      async patch(this: any, id, patches) {
        const cliSubs = (cliCtx as any).subs;
        cliSubs.forEach((sub: any) => sub(patches, () => cliSubs.delete(sub)));
        // this.subs.forEach((sub: any) => sub(toJS(simpleServer)));
      },
      execute<R>(id: string, method: string, args: any[]): Promise<R> {
        return undefined!;
      },
      subscribe(
        this: any,
        id: string,
        cb: (patches: Operation[], cancel: () => void) => void,
      ): () => void {
        // this.subs.add(cb);
        return () => {
          // this.subs.delete(cb);
        };
      },
    } as EntityActions<any>;

    simpleServer = await createEntity(metaType(data.$type).server, data, srvCtx);
    simpleClient = await createEntity(metaType(data.$type).client, data, cliCtx);

    return simpleClient as T;
  },
};

describe('simple-entity-system', () => {
  // test('metaType entity decorator');

  test('just-running', async () => {
    const userId = '123';

    const simple = await service.find(MySimpleType, { query: { name: userId } });

    expect(simple?.health).toBe(100);
  });

  test('run method', async () => {
    const userId = '567';

    const simple = await service.find(MySimpleType, { query: { name: userId } });
    expect(simple).not.toBeNull();
    if (!simple) return;

    expect(simple?.health).toBe(60);
    await simple.heal();

    expect(simple?.health).toBe(100);
  });

  test('remote run method', async () => {
    const userId = '567';

    const simple = await service.find(MySimpleType, { query: { name: userId } });
    expect(simple).not.toBeNull();
    if (!simple) return;

    expect(simple?.health).toBe(60);
    const heal = await simple.heal();
    const oldAge = await simple.changeAge(99);

    expect(oldAge).toBe(15);
    expect(simple.age).toBe(99);

    expect(simple?.health).toBe(100);
  });

  test('remote run server method', async () => {
    const userId = '567';

    const simple = await service.find(MySimpleType, { query: { name: userId } });
    expect(simple).not.toBeNull();
    if (!simple) return;

    const oldValue = await simple.serverChange('new value');

    expect(oldValue).toBe('server');
    expect(simple?.serverValue).toBe('new value');
  });
});
