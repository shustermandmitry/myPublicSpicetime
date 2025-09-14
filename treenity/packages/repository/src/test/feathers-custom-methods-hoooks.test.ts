/*
 * Copyright (c) 2024. Treenity Inc.
 */

import { createFeathersClient } from '@/client/create-feathers-client';
import { createApp } from '@/feathers-app';
import { MemoryService } from '@/mods/memory';
import { awaitService } from '@/utils';
import { createCookies } from '@/utils/cookies';
import { random } from '@s-libs/micro-dash';
import '@treenity/tree-api';
import './shared';

const email: string = 'login@example.com';
const password: string = 'login';

// jest.setTimeout(100000000);

class WithCustomMethods {
  getCustomMethods() {
    return ['customMethod'];
  }

  get() {
    throw new Error('not implemented');
  }

  async customMethod(params: any, context?: any): Promise<any> {
    console.log('customMethod called');
    return {
      $id: 'customMethod-id',
      $type: 'event-type',
      createdAt: 'created',
      title: 'title',
      suffix: 'suffix',
    };
  }
}

const CUSTOM_METHODS_PATH = '/with-custom-methods';

describe('Test custom methods hooks called', () => {
  let server: any;
  let client: any;
  let app: any;
  let url: string;

  beforeEach(async () => {
    const host = 'localhost';
    const port = random(5000, 10000);
    url = `ws://${host}:${port}`;

    app = createApp({
      fullApp: false,
      config: { tree: { root: './src/test/db', host, port } },
      dontCheckPermission: true,
    });

    const USERS = '/sys/users';
    app.use(USERS, new MemoryService());
    const users = app.service(USERS);
    await app.service(USERS).create({ email, password });

    app.use(CUSTOM_METHODS_PATH, new WithCustomMethods());

    server = await app.listen(port);
    server.on('listening', async () => {
      console.log('Feathers application started on', url);
    });

    client = createFeathersClient({ url, noAuth: true, cookies: createCookies({}) });
  });

  afterAll(() => {
    // client.logout();
    server.close();
  });

  test('Call method and receive entity', async () => {
    const service = await awaitService<WithCustomMethods>(client, CUSTOM_METHODS_PATH);

    const entity = await service.customMethod({}, { entity: true });

    expect(entity).toBeDefined();
    expect(entity.$).toBeDefined();
  });

  test('Add custom hook on client', async () => {
    const service = await awaitService<WithCustomMethods>(client, CUSTOM_METHODS_PATH);
    const hookMock = jest.fn();
    // @ts-ignore
    service.hooks({
      before: {
        customMethod: [hookMock],
      },
      after: {
        customMethod: [hookMock],
      },
    });

    const entity = await service.customMethod({}, { entity: true });

    expect(hookMock).toBeCalledTimes(2);
  });

  test('Add custom hook on server', async () => {
    const service = await awaitService<WithCustomMethods>(app, CUSTOM_METHODS_PATH);
    const hookMock = jest.fn();
    // @ts-ignore
    service.hooks({
      before: {
        customMethod: [hookMock],
      },
      after: {
        customMethod: [hookMock],
      },
    });

    const entity = await service.customMethod({}, { entity: true });

    expect(hookMock).toBeCalledTimes(2);
  });
});
