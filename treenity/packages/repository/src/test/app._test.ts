// For more information about this file see https://dove.feathersjs.com/guides/cli/app.test.html
import { singleton } from '@/feathers-app';
import type { Server } from 'http';

const app = singleton();

const port = app.get('port');
const appUrl = `http://${app.get('host')}:${port}`;

describe('Feathers application tests', () => {
  let server: Server;

  beforeAll(async () => {
    server = await app.listen(port);
  });

  afterAll(async () => {
    await app.teardown();
  });

  it('starts and shows the index page', async () => {
    const data = await (await fetch(appUrl)).text();

    expect(data.indexOf('<html lang="en">') !== -1).toBeTruthy();
  });

  it('shows a 404 JSON error', async () => {
    try {
      await (await fetch(`${appUrl}/path/to/nowhere`)).json();

      // 'should never get here'
      expect(false).toBeTruthy();
    } catch (error: any) {
      const { response } = error;
      expect(response?.status).toStrictEqual(404);
      expect(response?.data?.code).toStrictEqual(404);
      expect(response?.data?.name).toStrictEqual('NotFound');
    }
  });
});
