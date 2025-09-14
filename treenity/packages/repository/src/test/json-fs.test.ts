// For more information about this file see https://dove.feathersjs.com/guides/cli/app.test.html
import { createApp } from '@/feathers-app';
import { JsonFsService } from '@/services/json-fs';
// import assert from 'assert';
import type { Server } from 'http';

const app = createApp({ fullApp: false });

const port = app.get('port');
const appUrl = `http://${app.get('host')}:${port}`;

describe('Feathers application tests', () => {
  let server: Server;
  let fs = undefined as any;

  beforeAll(async () => {
    app.use('/fs-test/', new JsonFsService({ rootPath: './test/db' }));
    fs = app.service('/fs-test');

    // server = await app.listen(port + Math.floor(Math.random() * 1000));
  });

  afterAll(async () => {
    await app.teardown();
  });

  it('run plain find', async () => {
    const data = await fs.find({ query: { path: '/' } });

    expect(data).toHaveLength(2);
  });
  it('run find with query', async () => {
    const data = await fs.find({ query: { path: '/', 'metas.$type': 'test' } });

    expect(data).toHaveLength(1);
    expect(data[0].metas.test.$type).toEqual('test');
  });

  it('run find  all searchUpward', async () => {
    const data = await fs.find({
      query: { path: '/a/b/c/d/e', searchUpward: true },
    });

    expect(data).toHaveLength(6);
  });

  it('run find searchUpward', async () => {
    const data = await fs.find({
      query: { path: '/a/b/c/d/e', 'metas.$type': 'perm', searchUpward: true },
    });

    expect(data).toHaveLength(2);
    expect(data[0].metas.perm.$type).toEqual('perm');
    expect(data[1].metas.perm.$type).toEqual('perm');
  });
});
