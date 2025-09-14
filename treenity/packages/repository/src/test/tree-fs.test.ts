// For more information about this file see https://dove.feathersjs.com/guides/cli/app.test.html
import '@treenity/tree-api';
import { createApp } from '@/feathers-app';
import { JsonFsService } from '@/services/json-fs';
import TreeFsService from '@/services/tree-fs-service';
import { TypesTreeService } from '@/services/types-tree-service';
import { types } from '@treenity/core';
// import assert from 'assert';
import type { Server } from 'http';

const app = createApp({ fullApp: false });

const port = app.get('port');
const appUrl = `http://${app.get('host')}:${port}`;

describe('Feathers application tests', () => {
  let server: Server;
  let fs = undefined as any;
  let tree = undefined as any;

  beforeAll(async () => {
    app.use('/fs-test/', new JsonFsService({ rootPath: './src/test/db' }));
    app.use('/tree-test/', new TreeFsService('/fs-test/', '/sys/ctx'));
    fs = app.service('/fs-test');
    tree = app.service('/tree-test');

    server = await app.listen(port + Math.floor(Math.random() * 1000));
  });

  afterAll(async () => {
    await app.teardown();
  });

  it('run plain find', async () => {
    const page = await tree.find({ query: { path: '/' }, paginate: {} });

    expect(page.data).toHaveLength(5);
  });
  it('run find with query', async () => {
    const data = await tree.find({ query: { path: '/', 'metas.$type': 'test' } });

    expect(data).toHaveLength(1);
    expect(data[0].metas.test.$type).toEqual('test');
  });

  it('run find searchUpward', async () => {
    const data = await tree.find({
      query: { path: '/a/b/c/d/e', 'metas.$type': 'perm', searchUpward: true },
    });

    expect(data).toHaveLength(2);
    expect(data[0].metas.perm.$type).toEqual('perm');
    expect(data[1].metas.perm.$type).toEqual('perm');
  });

  it('mount types', async () => {
    tree.mount('/types', new TypesTreeService());

    const data = await tree.find({
      query: { path: '/types' },
      entity: true,
    });

    const layers = Object.keys(types);
    expect(data).toHaveLength(layers.length);
    expect(data.map((d: any) => d.$.meta.$name)).toEqual(layers);
  });

  it('mount types - children', async () => {
    tree.mount('/types', new TypesTreeService());

    const data = await tree.find({
      query: { path: '/types/entity' },
      entity: true,
    });

    expect(data).toBeDefined();
  });
});
