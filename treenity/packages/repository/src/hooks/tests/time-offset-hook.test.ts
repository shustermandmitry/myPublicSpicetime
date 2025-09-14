import { HookContext } from '@/declarations';
import timeOffsetHookThis from '@/hooks/time-offset-hook';

const userUpdateMock = jest.fn((userId: number, user: any) => user);

const timeOffsetHook = timeOffsetHookThis.bind(null!);

describe('TZ offset hook test', () => {
  let context: HookContext;

  beforeEach(async () => {
    userUpdateMock.mockClear();

    context = {
      app: {
        service: (path: string) => ({ update: userUpdateMock }),
      } as any,
      arguments: [] as any[],
    } as HookContext;
  });

  it('No headers', async () => {
    await timeOffsetHook(context);
    expect(userUpdateMock.mock.calls).toHaveLength(0);

    expect(context).toStrictEqual(context);
  });

  it('No cookie in headers', async () => {
    context.arguments.push({ headers: {} });

    await timeOffsetHook(context);
    expect(userUpdateMock.mock.calls).toHaveLength(0);

    expect(context).toStrictEqual(context);
  });

  it('No tz in cookie headers', async () => {
    context.arguments.push({
      headers: {
        cookie: 'param1=val1; param2=val2;param2=val2;',
      },
    });

    await timeOffsetHook(context);
    expect(userUpdateMock.mock.calls).toHaveLength(0);

    expect(context).toStrictEqual(context);
  });

  it('Positive offset in headers', async () => {
    context.params = { user: { id: 1 } };
    context.arguments.push({
      headers: {
        cookie: 'param1=val1; tz=100; param2=val2;param2=val2;',
      },
    });

    await timeOffsetHook(context);
    expect(userUpdateMock.mock.calls).toHaveLength(1);

    expect(context).toStrictEqual(context);
    expect(context.params.user.tz).toStrictEqual(100);
  });

  it('Negative offset in headers', async () => {
    context.params = { user: { id: 1 } };
    context.arguments.push({
      headers: {
        cookie: 'param1=val1; tz=-240; param2=val2;param2=val2;',
      },
    });

    await timeOffsetHook(context);
    expect(userUpdateMock.mock.calls).toHaveLength(1);

    expect(context).toStrictEqual(context);
    expect(context.params.user.tz).toStrictEqual(-240);
  });

  it('Invalid offset in headers', async () => {
    context.params = { user: { id: 1 } };
    context.arguments.push({
      headers: {
        cookie: 'param1=val1; tz=a240; param2=val2;param2=val2;',
      },
    });

    await timeOffsetHook(context);
    expect(userUpdateMock.mock.calls).toHaveLength(0);

    expect(context).toStrictEqual(context);
    expect(context.params.user.tz).toStrictEqual(undefined);
  });

  it("Invalid offset don't change old offset", async () => {
    context.params = { user: { id: 1, tz: 200 } };
    context.arguments.push({
      headers: {
        cookie: 'param1=val1; tz=a240; param2=val2;param2=val2;',
      },
    });

    await timeOffsetHook(context);
    expect(userUpdateMock.mock.calls).toHaveLength(0);

    expect(context).toStrictEqual(context);
    expect(context.params.user.tz).toStrictEqual(200);
  });

  it('New offset changed old offset', async () => {
    context.params = { user: { id: 1, tz: 200 } };
    context.arguments.push({
      headers: {
        cookie: 'param1=val1; tz=240; param2=val2;param2=val2;',
      },
    });

    await timeOffsetHook(context);
    expect(userUpdateMock.mock.calls).toHaveLength(1);

    expect(context).toStrictEqual(context);
    expect(context.params.user.tz).toStrictEqual(240);
  });
});
