import { createFeathersClient } from '@/client/create-feathers-client';
import { TreeServiceType } from '@/services/types';
import { createClientServer } from '@/test/create-client.server';
import { awaitService } from '@/utils';
import { createCookies } from '@/utils/cookies';
import { wait } from '@treenity/js-shared/utils';
import { EventEntity, EventType } from './shared';
import '@treenity/tree-api';

jest.setTimeout(10000);

describe('node entity call', () => {
  let server: any;
  let client: any;
  let app: any;
  let url: string;

  beforeEach(async () => {
    ({ url, app, client, server } = await createClientServer());
  });

  afterAll(() => {
    client.logout();
    app.teardown();
  });

  describe('Run tests using client and server', () => {
    test('get simple tree node', async () => {
      try {
        const service = await awaitService(client, '/sys/tree', TreeServiceType);

        const treeNode = await service.get('/a/b');

        expect(service).toBeDefined();
        expect(treeNode).toBeDefined();
      } catch (err) {
        console.error('err', err);
      }
    });

    test('update node part', async () => {
      try {
        const service = await awaitService(client, '/sys/tree', TreeServiceType);

        const treeNode = await service.get('/a/b/c', { query: {}, sub: true, entity: true });

        const event = await treeNode.get(EventType);
        expect(event).toBeInstanceOf(EventEntity);

        const entity = event.$.id;

        const newTitle = 'some new title' + Math.random().toFixed(8);

        const isOk = await event.updateTitle(newTitle, 'AND SUFFIX');

        expect(isOk).toBe('ok');
        await wait(10);
        expect(event.title).toBe(newTitle);
      } catch (err) {
        console.error('err', err);
        throw err;
      }
    });

    test('update with subscribe', async () => {
      const client1 = client;
      const client2 = createFeathersClient({ url, noAuth: true, cookies: createCookies({}) });

      try {
        const service1 = await awaitService(client1, '/sys/tree', TreeServiceType);
        const service2 = await awaitService(client2, '/sys/tree', TreeServiceType);

        const treeNode1 = await service1.get('/a/b/c', { query: {}, sub: true, entity: true });
        const treeNode2 = await service2.get('/a/b/c', { query: {}, sub: true, entity: true });

        const event1 = await treeNode1.get(EventType);
        const event2 = await treeNode2.get(EventType);

        const newTitle = 'some new title' + Math.random().toFixed(8);
        const isOk = await event1.updateTitle(newTitle, 'AND SUFFIX');

        await wait(10);

        expect(event1.title).toBe(newTitle);
        expect(event2.title).toBe(newTitle);

        expect(isOk).toBe('ok');
      } catch (err) {
        console.error('err', err);
        throw err;
      }
    });
  });
});
