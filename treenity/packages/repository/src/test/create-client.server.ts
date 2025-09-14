/*
 * Copyright (c) 2024. Treenity Inc.
 */

import { createFeathersClient } from '@/client/create-feathers-client';
import { createApp } from '@/feathers-app';
import { MemoryService } from '@/mods/memory';
import { createCookies } from '@/utils/cookies';
import authentication from '@feathersjs/authentication-client';
import { feathers } from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import { random } from '@s-libs/micro-dash';
import io from 'socket.io-client';

const email: string = 'login@example.com';
const password: string = 'login';

export async function createClientServer() {
  const host = 'localhost';
  const port = random(5000, 10000);
  const url = `ws://${host}:${port}`;

  const app = createApp({
    fullApp: false,
    config: { tree: { root: './src/test/db', host, port } },
    dontCheckPermission: true,
  });

  const USERS = '/sys/users';
  app.use(USERS, new MemoryService());
  const users = app.service(USERS);
  await app.service(USERS).create({ email, password });

  const server = await app.listen(port);
  server.on('listening', async () => {
    console.log('Feathers application started on', url);
  });

  const client = createFeathersClient({ url, noAuth: true, cookies: createCookies({}) });
  return { url, server, client, app };
}

async function makeClient(host: string, port: number, email: string, password: string) {
  const client = feathers();
  const socket = io(`http://${host}:${port}`, {
    transports: ['websocket'],
    forceNew: true,
    reconnection: false,
    extraHeaders: {},
  });
  client.configure(socketio(socket));
  client.configure(
    authentication({
      // path: '/sys/auth',
      storage: localStorage(),
    }),
  );

  try {
    await client.authenticate({
      strategy: 'local',
      email,
      password,
    });
  } catch (err) {
    console.log('Error authenticating!', err);
  }
  return client;
}

function localStorage() {
  const store: { [key: string]: string } = {};

  return {
    setItem(key: string, value: string) {
      store[key] = value;
    },
    getItem(key: string) {
      return store[key];
    },
    removeItem(key: string) {
      delete store[key];
    },
  };
}
