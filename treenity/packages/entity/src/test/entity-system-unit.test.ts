import { metaType } from '@treenity/core';
import { EventEmitter } from 'events';
import { makeAutoObservable, runInAction } from 'mobx';
import { method, write, writeMethod } from '../decorators';
import { Entity, EntityActions } from '../entity';
import { entity } from '../entity-decorator';
import { EntityManager } from '../entity-manager';
import { HistoryStore } from '../undo-redo/history-store';
import { Patch } from '../undo-redo/patch';

// Test entity definitions
export const TestEntityType = metaType<TestEntity>('test-entity');

@entity(TestEntityType)
class TestEntity {
  constructor(
    public name: string,
    public value: number,
  ) {}

  @write
  async setValue(newValue: number): Promise<void> {
    this.value = newValue;
  }

  @method
  async asyncMethod(): Promise<string> {
    return `${this.name}-${this.value}`;
  }

  @writeMethod
  async asyncWriteMethod(newValue: number): Promise<number> {
    const oldValue = this.value;
    this.value = newValue;
    return oldValue;
  }
}

describe('Entity System', () => {
  let manager: EntityManager;
  let actions: EntityActions<TestEntity>;

  beforeEach(() => {
    manager = new EntityManager();
    actions = {
      init: jest.fn(),
      patch: jest.fn(),
      subscribe: jest.fn(),
      execute: jest.fn(),
    };
  });

  describe('EntityManager', () => {
    test("ensure creates a new entity if it doesn't exist", async () => {
      const entity = await manager.ensure(
        {
          $id: 'test1',
          $type: 'test-entity',
          name: 'Test',
          value: 10,
        },
        actions,
        TestEntityType,
      );
      expect(entity).toBeInstanceOf(TestEntity);
      expect(entity.name).toBe('Test');
      expect(entity.value).toBe(10);
    });

    test('ensure returns existing entity if it exists', async () => {
      const entity1 = await manager.ensure(
        {
          $id: 'test1',
          $type: 'test-entity',
          name: 'Test',
          value: 10,
        },
        actions,
        TestEntityType,
      );
      const entity2 = await manager.ensure(
        {
          $id: 'test1',
          $type: 'test-entity',
          name: 'Test',
          value: 10,
        },
        actions,
        TestEntityType,
      );
      expect(entity1).toBe(entity2);
    });

    test('get returns undefined for non-existent entity', () => {
      const entity = manager.get('non-existent');
      expect(entity).toBeUndefined();
    });

    test('get returns entity after it has been ensured', async () => {
      await manager.ensure(
        { $id: 'test1', $type: 'test-entity', name: 'Test', value: 10 },
        actions,
        TestEntityType,
      );
      const entity = manager.get('test1');
      expect(entity).toBeInstanceOf(TestEntity);
    });
  });

  describe('Entity Decorators', () => {
    let testEntity: Entity<TestEntity>;

    beforeEach(async () => {
      testEntity = await manager.ensure(
        {
          $id: 'test1',
          $type: 'test-entity',
          name: 'Test',
          value: 10,
        },
        actions,
        TestEntityType,
      );
    });

    test('@write decorator modifies entity state', () => {
      testEntity.setValue(20);
      expect(testEntity.value).toBe(20);
    });

    test('@method decorator calls execute function', async () => {
      (actions.execute as jest.Mock).mockResolvedValue('Test-10');
      const result = await testEntity.asyncMethod();
      expect(result).toBe('Test-10');
      expect(actions.execute).toHaveBeenCalledWith(testEntity, 'asyncMethod', []);
    });

    test('@writeMethod decorator modifies state and calls execute function', async () => {
      (actions.execute as jest.Mock).mockResolvedValue(10);
      const result = await testEntity.asyncWriteMethod(30);
      expect(result).toBe(10);
      expect(testEntity.value).toBe(30);
      expect(actions.execute).toHaveBeenCalledWith(testEntity, 'asyncWriteMethod', [30]);
    });
  });

  describe('HistoryStore', () => {
    let document: { value: number };
    let historyStore: HistoryStore<typeof document>;

    beforeEach(() => {
      document = makeAutoObservable({ value: 0 });
      historyStore = new HistoryStore(document);
    });

    test('undo and redo work correctly', () => {
      runInAction(() => {
        historyStore.document.value = 1;
      });
      runInAction(() => {
        historyStore.document.value = 2;
      });
      runInAction(() => {
        document.value = 3;
      });
      // historyStore.finalizeChange();

      expect(historyStore.document.value).toBe(3);
      historyStore.undo();
      expect(historyStore.document.value).toBe(2);
      historyStore.undo();
      expect(historyStore.document.value).toBe(1);
      historyStore.redo();
      expect(historyStore.document.value).toBe(2);
    });

    test('pause and resume work correctly', () => {
      historyStore.pause();
      historyStore.document.value = 1;
      historyStore.document.value = 2;
      historyStore.resume();

      expect(historyStore.document.value).toBe(2);
      historyStore.undo();
      expect(historyStore.document.value).toBe(0);
    });

    test('dispose stops tracking changes', () => {
      historyStore.dispose();
      historyStore.document.value = 1;
      historyStore.document.value = 2;

      expect(historyStore.document.value).toBe(2);
      expect(() => historyStore.undo()).not.toThrow();
      expect(historyStore.document.value).toBe(2);
    });
  });

  describe('Entity Synchronization', () => {
    let clientManager: EntityManager;
    let serverManager: EntityManager;
    let clientActions: EntityActions<TestEntity> & EventEmitter;
    let serverActions: EntityActions<TestEntity>;

    beforeEach(() => {
      clientManager = new EntityManager('client');
      serverManager = new EntityManager('server');

      clientActions = new (class extends EventEmitter {
        execute = jest.fn((entity: Entity<TestEntity>, method, args) => {
          const serverEntity = serverManager.get(entity.$.id);
          return (serverEntity as any)[method](...args);
        });
        patch = jest.fn();
        subscribe = jest.fn(function (entity, cb) {
          const patch = (id: string, patches: Patch) => {
            if (id === entity.$.id) cb(patches);
          };
          this.on('patch', patch);
          return () => this.off('patch', patch);
        });
      })();

      serverActions = {
        patch: jest.fn(async (entity: Entity<TestEntity>, patches) => {
          const clientEntity = clientManager.get(entity.$.id);
          if (clientEntity) {
            await (clientActions.patch as any)(clientEntity, patches);
          }
        }),
        subscribe: jest.fn(),
      };
    });

    const entityData = {
      $id: 'test1',
      $type: 'test-entity',
      name: 'Test',
      value: 10,
    };
    test('changes on client are reflected on server', async () => {
      const clientEntity = await clientManager.ensure(entityData, clientActions, TestEntityType);
      const serverEntity = await serverManager.ensure(entityData, serverActions, TestEntityType);

      await clientEntity.asyncWriteMethod(20);

      expect(clientEntity.value).toBe(20);
      expect(serverEntity.value).toBe(20);
      expect(clientActions.execute).toHaveBeenCalled();
      expect(serverActions.patch).toHaveBeenCalled();
    });

    test('changes on server are reflected on client', async () => {
      const clientEntity = await clientManager.ensure(entityData, clientActions, TestEntityType);
      const serverEntity = await serverManager.ensure(entityData, serverActions, TestEntityType);

      await serverEntity.setValue(30);
      clientActions.emit('patch', serverEntity.$.id, [
        { op: 'replace', path: '/value', value: 30 },
      ]);

      expect(clientEntity.value).toBe(30);
      expect(serverEntity.value).toBe(30);
      expect(clientActions.patch).toHaveBeenCalled();
    });
  });
});
