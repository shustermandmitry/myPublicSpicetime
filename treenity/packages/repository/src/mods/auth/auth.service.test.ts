import { Application } from '@/declarations';
import { services } from '@/services/index';
import RedisMock from '@/utils/redis-mock';
import awaitService from '@/utils/service-awaiter';
import { LocalStrategy } from '@feathersjs/authentication-local';
import { feathers } from '@feathersjs/feathers';
import type { ServiceConstructorParams } from '@treenity/feathers-service';
import { AuthServiceMeta } from './auth.meta';
import AuthService from './auth.service';
import { NotAuthenticated } from '@feathersjs/errors';
import SecurityService from '@/mods/security/security.service';

const pause = (ms: number = 100) => new Promise(res => setTimeout(() => res(true), ms));

const config = {
  authServicePath: '/sys/auth',
  secret: 'authentication-secret',
  entityId: 'id',
  entity: 'user',
  service: '/sys/users',
  authStrategies: ['jwt', 'password', 'code'],
  jwtOptions: {
    header: {
      typ: 'access',
    },
    audience: 'https://treenity.pro',
    issuer: 'feathers',
    algorithm: 'HS256',
    expiresIn: '2629743',
  },
  password: {
    usernameField: 'email',
    passwordField: 'password',
    errorMessage: 'no-idea',
  },
  lowerCaseFiled: 'email',
  code: {
    usernameField: 'email',
    codeField: 'code',
    authCodeField: 'authCode',
    securityServicePath: '/sys/security',
    codeLifetime: '60',
  },
};

const meta = {
  $id: '1AgAe2kPbPus5T9z9iADp5',
  $name: 'auth_service',
  $type: 'sys.auth',
  sessionServicePath: '/sys/session',
  defaultRole: 'user',
  strategiesPath: ['sys/auth/strategy/code', 'sys/auth/strategy/jwt'],
} as AuthServiceMeta;

describe('Auth service', () => {
  describe('Auth service init tests', () => {
    let app: Application;
    const authServicePath = '/auth';

    beforeAll(async () => {
      app = feathers() as Application;

      app.set('authentication', config);

      app.set('tree', { root: __dirname + '/db' });
      app.use('/sys/users', new RedisMock({ id: 'id' }));
      app.use('/sys/session', new RedisMock({ id: 'id' }));
      app.use(
        authServicePath,
        new AuthService({ app, meta } as ServiceConstructorParams<AuthServiceMeta>),
      );
      app.configure(services);
      await app.setup();
    });

    afterAll(async () => {
      await app.teardown();
    });

    it('simple test', async () => {
      const service = await awaitService(app, authServicePath);
      expect(service).not.toEqual(undefined);
    });
  });

  describe('Registration', () => {
    let app: Application;
    const authServicePath = '/auth';

    beforeAll(async () => {
      app = feathers() as Application;

      app.set('authentication', config);

      app.set('tree', { root: __dirname + '/db' });
      app.use('/sys/users', new RedisMock({ id: 'id' }));
      app.use('/sys/session', new RedisMock({ id: 'id' }));
      app.use(
        authServicePath,
        new AuthService({ app, meta } as ServiceConstructorParams<AuthServiceMeta>),
      );
      app.configure(services);
      await app.setup();
    });

    afterAll(async () => {
      await app.teardown();
    });

    // refresh access token when user not found in DB
    // check expiration values for refresh and access tokens

    it('Successful registration ', async () => {
      const authService = await awaitService(app, authServicePath);

      const password = 'user@password';
      const strategy = authService.getStrategy('password') as LocalStrategy;
      const hash = await strategy?.hashPassword(password, {});

      let authenticate = jest.spyOn(authService, 'authenticate');

      const result = await authService.registration({
        email: 'user@email.com',
        password: hash,
        strategy: 'password',
      });
      expect(result.authentication.strategy).toEqual('password');

      expect(authenticate.mock.calls).toHaveLength(0);
    });
  });

  describe('Login', () => {
    let app: Application;
    const authServicePath = '/auth';

    beforeAll(async () => {
      app = feathers() as Application;

      app.set('authentication', config);

      app.set('tree', { root: __dirname + '/db' });
      app.use('/sys/users', new RedisMock({ id: 'id' }));
      app.use('/sys/session', new RedisMock({ id: 'id' }));
      app.use(
        authServicePath,
        new AuthService({ app, meta } as ServiceConstructorParams<AuthServiceMeta>),
      );
      app.configure(services);
      await app.setup();
    });

    afterAll(async () => {
      await app.teardown();
    });

    // refresh access token when user not found in DB
    // check expiration values for refresh and access tokens

    it('Test password email lowercase and trim', async () => {
      const authService = await awaitService(app, authServicePath);
      const userService = await awaitService(app, '/sys/users');

      const password = 'user@password';
      const strategy = authService.getStrategy('password') as LocalStrategy;
      const hash = await strategy?.hashPassword(password, {});

      let spy = jest.spyOn(authService, 'authenticate');

      const user = await authService.registration({
        email: 'user@email.com',
        password: hash,
        strategy: 'password',
      });
      expect(user).toBeDefined();

      const credentials = await authService.create({
        email: '   UsEr@EmAiL.CoM ',
        password: 'user@password',
        strategy: 'password',
      });

      expect(credentials.accessToken).toBeDefined();
      expect(credentials.refreshToken).toBeDefined();
      const [[params, , allowed1, allowed2, allowed3]] = spy.mock.calls;
      // @ts-ignore
      expect(params.email).toEqual('user@email.com');
      // @ts-ignore
      expect(params.password).toEqual('user@password');
      // @ts-ignore
      expect(params.strategy).toEqual('password');

      expect(allowed1).toEqual('jwt');
      expect(allowed2).toEqual('password');
      expect(allowed3).toEqual('code');
    });

    it('Test password strategy', async () => {
      const authService = await awaitService(app, authServicePath);
      const userService = await awaitService(app, '/sys/users');

      const password = 'user@password';
      const strategy = authService.getStrategy('password') as LocalStrategy;
      const hash = await strategy?.hashPassword(password, {});

      const user = await authService.registration({
        email: 'user1@email.com',
        password: hash,
        strategy: 'password',
      });
      expect(user).toBeDefined();

      const credentials = await authService.create({
        email: 'user1@email.com',
        password: 'user@password',
        strategy: 'password',
      });

      expect(credentials.accessToken).toBeDefined();
      expect(credentials.refreshToken).toBeDefined();
    });
  });

  describe('Tokens', () => {
    let app: Application;
    let authService: AuthService;
    const authServicePath = '/auth';

    beforeAll(async () => {
      app = feathers() as Application;

      app.set('authentication', config);

      app.set('tree', { root: __dirname + '/db' });
      app.use('/sys/users', new RedisMock({ id: 'id' }));
      app.use('/sys/session', new RedisMock({ id: 'id' }));
      authService = new AuthService({ app, meta } as ServiceConstructorParams<AuthServiceMeta>);
      app.use(authServicePath, authService);
      app.configure(services);
      await app.setup();
    });

    afterAll(async () => {
      await app.teardown();
    });

    it('Should create tokens', async () => {
      const authResult = {
        user: { id: 1, role: 'user' },
        accessToken: 'access-token',
      };

      const result = await authService.createTokens(authResult);
      expect(result).toBeDefined();
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });

    it('Should get session with good token', async () => {
      const expiresIn = 30;
      const payload = {
        userId: 1,
        sessionId: '888',
      };

      const token = await authService.createJWT(payload, expiresIn);
      const redisGetMock = jest.fn().mockReturnValueOnce({ data: { sessionId: '888', sub: 1 } });
      authService.sessionService.get = redisGetMock;
      const result = await authService.getSession(token);

      expect(result.sessionId).toEqual('888');
      expect(result.sub).toEqual(1);
      expect(result.userId).toEqual(1);

      expect(redisGetMock.mock.calls).toHaveLength(1);
      const [[redisGetId, redisGetParams]] = redisGetMock.mock.calls;
      expect(redisGetId).toEqual(1);
      expect(redisGetParams.query.sessionId).toEqual('888');
    });

    it('Should get session with expire token', async () => {
      const expiresIn = 1;
      const payload = {
        userId: 1,
        sessionId: '888',
      };

      const token = await authService.createJWT(payload, expiresIn);
      const redisGetMock = jest.fn().mockReturnValueOnce({});
      authService.sessionService.get = redisGetMock;
      await pause(2000);
      try {
        const result = await authService.getSession(token);
        expect(result).toBeDefined();
      } catch (e: any) {
        expect(e).toBeDefined();
        expect(e).toBeInstanceOf(Error);
        expect(e.message).toEqual('jwt expired');
      }

      expect(redisGetMock.mock.calls).toHaveLength(0);
    });

    it('Should get session with bad token', async () => {
      const redisGetMock = jest.fn().mockReturnValueOnce({});
      authService.sessionService.get = redisGetMock;
      try {
        const result = await authService.getSession(
          'eyJhbGciOiJIUzI1NiIsInR5cCI6ImFjY2VzcyJ9.eyJ1c2VySWQiOjI0LCJzZXNzaW9uSWQiOiJkY2YwZGU5Mi1jZDcwLTQ3ODktYTAxZS0yOTgwZWEwODNmZTIiLCJzdWIiOjI0LCJyb2xlIjoidXNlciIsImlhdCI6MTcyMDQyMTU3MiwiZXhwIjoxNzIwNDIyNDcyLCJhdWQiOiJodHRwczovL3RyZWVuaXR5LnBybyIsImlzcyI6ImZlYXRoZXJzIiwianRpIjoiYTUwNTNmMzYtNjgwMy00NWQzLWIwNTMtZjBhYTMzNjg2Y2RiIn0.rFd7sBF6PrJ25-gd4xQ4SmQJHP-FaDUj0Hh32i0HeVU',
        );
        expect(result).toBeDefined();
      } catch (e: any) {
        expect(e).toBeDefined();
        expect(e).toBeInstanceOf(Error);
        expect(e.message).toEqual('invalid signature');
      }

      expect(redisGetMock.mock.calls).toHaveLength(0);
    });

    it('Should get session and profile not found', async () => {
      const expiresIn = 30;
      const payload = {
        userId: 1,
        sessionId: '888',
      };

      const token = await authService.createJWT(payload, expiresIn);
      const redisGetMock = jest.fn().mockReturnValueOnce({ data: null });
      authService.sessionService.get = redisGetMock;
      try {
        const result = await authService.getSession(token);
        expect(result).toBeUndefined();
      } catch (e: any) {
        expect(e).toBeDefined();
        expect(e).toBeInstanceOf(NotAuthenticated);
        expect(e.message).toEqual('Session not found');
      }

      expect(redisGetMock.mock.calls).toHaveLength(1);
      const [[redisGetId, redisGetParams]] = redisGetMock.mock.calls;
      expect(redisGetId).toEqual(1);
      expect(redisGetParams.query.sessionId).toEqual('888');
    });
  });

  describe('Logout', () => {
    let app: Application;
    let authService: AuthService;
    const authServicePath = '/auth';

    beforeAll(async () => {
      app = feathers() as Application;

      app.set('authentication', config);

      app.set('tree', { root: __dirname + '/db' });
      app.use('/sys/users', new RedisMock({ id: 'id' }));
      app.use('/sys/session', new RedisMock({ id: 'id', useData: true, useDataField: 'payload' }));
      authService = new AuthService({ app, meta } as ServiceConstructorParams<AuthServiceMeta>);
      app.use(authServicePath, authService);
      app.configure(services);
      await app.setup();
    });

    afterAll(async () => {
      await app.teardown();
    });

    it('Logout successful', async () => {
      const authService = await awaitService(app, authServicePath);

      const email = 'user@email.com';
      const password = 'user@email.com';
      const strategy = authService.getStrategy('password') as LocalStrategy;
      const hash = await strategy?.hashPassword(password, {});
      const registrationData = await authService.registration({
        email,
        password: hash,
        strategy: 'password',
      });

      expect(registrationData).toBeDefined();

      const tokens = await authService.create({
        email,
        password,
        strategy: 'password',
      });
      expect(tokens).toBeDefined();

      expect(tokens.accessToken).toBeDefined();
      expect(tokens.refreshToken).toBeDefined();

      const res = await authService.remove(null!, {
        headers: {
          authorization: tokens.accessToken,
        },
      });
      expect(res).toBeDefined();
      expect(res.accessToken).toEqual(tokens.accessToken);
    });
  });

  describe('Resend', () => {
    let app: Application;
    let authService: AuthService;
    const authServicePath = '/auth';

    beforeAll(async () => {
      app = feathers() as Application;

      app.set('authentication', config);

      app.set('tree', { root: __dirname + '/db' });
      app.use('/sys/users', new RedisMock({ id: 'id' }));
      app.use('/sys/session', new RedisMock({ id: 'id', useData: true, useDataField: 'payload' }));
      app.use('/sys/security', new SecurityService());
      authService = new AuthService({ app, meta } as ServiceConstructorParams<AuthServiceMeta>);
      app.use(authServicePath, authService);
      app.configure(services);
      await app.setup();
    });

    afterAll(async () => {
      await app.teardown();
    });

    it('Rensend successful', async () => {
      const authService = await awaitService(app, authServicePath);
      const securityService = await awaitService(app, 'sys/security');

      const email = 'user@email.com';
      const mockCreateCode = jest
        .fn()
        .mockReturnValueOnce({
          code: '123qwe23',
        })
        .mockReturnValueOnce({
          code: '123987',
        })
        .mockReturnValueOnce({
          code: '943432',
        });

      securityService.create = mockCreateCode;

      const mockGetCode = jest.fn().mockReturnValueOnce(
        Promise.resolve({
          code: '123qwe23',
        }),
      );

      securityService.getByCode = mockGetCode;

      const registrationData = await authService.registration({
        email,
        strategy: 'code',
      });

      expect(registrationData).toBeDefined();
      expect(registrationData.authCode).toBeDefined();

      const resendResponse = await authService.resendCode({
        email,
        authCode: registrationData.authCode,
        strategy: 'code',
      });
      expect(resendResponse).toBeDefined();
      expect(resendResponse.authCode).toEqual(registrationData.authCode);
    });

    it('Rensend if auth code expired', async () => {
      const authService = await awaitService(app, authServicePath);
      const securityService = await awaitService(app, 'sys/security');

      const email = 'user@email.com';
      const mockCreateCode = jest
        .fn()
        .mockReturnValueOnce({
          code: '123qwe23',
        })
        .mockReturnValueOnce({
          code: '123987',
        })
        .mockReturnValueOnce({
          code: '943432qw',
        })
        .mockReturnValueOnce({
          code: '943432',
        });

      securityService.create = mockCreateCode;

      const mockGetCode = jest.fn().mockRejectedValueOnce(Promise.reject(''));

      securityService.getByCode = mockGetCode;

      const registrationData = await authService.registration({
        email,
        strategy: 'code',
      });

      expect(registrationData).toBeDefined();
      expect(registrationData.authCode).toBeDefined();

      const resendResponse = await authService.resendCode({
        email,
        authCode: registrationData.authCode,
        strategy: 'code',
      });
      expect(resendResponse).toBeDefined();
      expect(resendResponse.authCode).toEqual('943432qw');
    });
  });
});
