// For more information about this file see https://dove.feathersjs.com/guides/cli/app.test.html
import { Application } from '@/declarations';
import { services } from '@/services';
import awaitService from '@/utils/service-awaiter';
import { Forbidden } from '@feathersjs/errors';
import { feathers } from '@feathersjs/feathers';
import type { ServiceConstructorParams } from '@treenity/feathers-service';
import { CasbinServiceMeta } from '../casbin.meta';
import CasbinService from '../casbin.service';

class NoErrorThrownError extends Error {}

const getError = async <TError>(call: () => unknown): Promise<TError> => {
  try {
    await call();

    throw new NoErrorThrownError();
  } catch (error: unknown) {
    return error as TError;
  }
};

const meta = {
  $id: '21gAe2kPbPus7779iADp5',
  $name: 'casbin_service',
  $type: 'sys.access-control.casbin',
  model: {
    request_definition: 'r = sub, obj, act',
    policy_definition: 'p = sub, obj, act',
    role_definition: 'g = _, _',
    policy_effect: 'e = some(where (p.eft == allow))',
    matchers: 'm = g(r.sub, p.sub) && keyMatch4(r.obj, p.obj) && regexMatch(r.act, p.act)',
  },
} as CasbinServiceMeta;

describe('Access control service tests', () => {
  let app: Application;

  beforeAll(async () => {
    app = feathers() as Application;
    app.set('tree', { root: __dirname + '/db' });
    app.configure(services);
    await app.setup();
  });

  afterAll(async () => {
    await app.teardown();
  });

  it('simple run', async () => {
    const path = '/ac-1';
    app.use(path, new CasbinService({ meta } as ServiceConstructorParams<CasbinServiceMeta>));
    const service = await awaitService(app, path);
    expect(service).not.toEqual(undefined);
  });
});

describe('Access control check method tests', () => {
  let app: Application;
  const path = '/ac-1';

  beforeAll(async () => {
    app = feathers() as Application;
    app.set('tree', { root: __dirname + '/db' });
    app.configure(services);
    app.use(path, new CasbinService({ meta } as ServiceConstructorParams<CasbinServiceMeta>));
    await app.setup();
  });

  afterAll(async () => {
    await app.teardown();
  });

  it('check: simple, ok', async () => {
    const service = await awaitService(app, path);

    await service.check({ query: { path: '/simple' } }, { user: { role: 'admin' } });

    await service.check({ query: { path: '/simple', method: 'get' } }, { user: { role: 'user' } });

    await service.check(
      { query: { path: '/simple', method: 'check' } },
      { user: { role: 'user' } },
    );
  });

  it('check: no-perm, ok', async () => {
    const service = await awaitService(app, path);

    const error = await getError(async () =>
      service.check({ query: { path: '/no-perm' } }, { user: { role: 'admin' } }),
    );
    expect(error).not.toBeInstanceOf(NoErrorThrownError);
    expect(error).toBeInstanceOf(Forbidden);
  });

  it('check: simple, forbidden', async () => {
    const service = await awaitService(app, path);

    const error = await getError(async () =>
      service.check({ query: { path: '/simple' } }, { user: { role: 'user' } }),
    );

    expect(error).not.toBeInstanceOf(NoErrorThrownError);
    expect(error).toBeInstanceOf(Forbidden);
  });

  it('check: override', async () => {
    const service = await awaitService(app, path);

    const error = await getError(async () =>
      service.check({ query: { path: '/simple-not-found' } }, { user: { role: 'user' } }),
    );

    expect(error).not.toBeInstanceOf(NoErrorThrownError);
    expect(error).toBeInstanceOf(Forbidden);
  });

  it('check: all permissions count up to root', async () => {
    const service = await awaitService(app, path);

    const error = await getError(async () =>
      service.check({ query: { path: '/perm_check/admin' } }, { user: { role: 'user' } }),
    );
    expect(error).not.toBeInstanceOf(NoErrorThrownError);
    expect(error).toBeInstanceOf(Forbidden);

    expect(
      await service.check({ query: { path: '/perm_check/admin' } }, { user: { role: 'admin' } }),
    ).toBeTruthy();
    expect(
      await service.check({ query: { path: '/perm_check/user' } }, { user: { role: 'user' } }),
    ).toBeTruthy();
  });
});
