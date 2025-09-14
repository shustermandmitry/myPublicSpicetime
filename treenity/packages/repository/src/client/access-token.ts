import { Application } from '@feathersjs/feathers';
import { set } from '@s-libs/micro-dash';
import { isClient } from '@treenity/js-shared';
import { promised } from '@treenity/js-shared/utils';

let wait: any = null;

export const refreshAccessToken = async (app: Application<any>) => {
  if (wait) {
    return wait;
  }

  wait = promised();

  const cookies = app.get('cookies');
  const refreshToken = cookies.refreshToken;
  if (!refreshToken) {
    cookies('accessToken', ''); // remove access token
    throw new Error('no refresh token found, check before calling refreshAccessToken');
  }

  try {
    const domain =
      (typeof window !== 'undefined'
        ? ((window as any).ENV.WS_API_URL as string)
        : '');

    const res = await fetch(`${domain}/api/sys/auth`, {
      method: 'PUT',
      body: JSON.stringify({
        refreshToken,
      }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (res.status !== 200) {
      throw new Error('Could not retrieve access token');
    }

    const result = await res.json();
    cookies('accessToken', result.accessToken, result.accessExpiredIn);
    set(app.io!._opts.extraHeaders, ['Authorization'], result.accessToken);
    app.io?.disconnect();
  } catch (e: any) {
    if (e.message === 'Could not retrieve access token') {
      cookies('refreshToken', '');
      cookies('accessToken', '');
      isClient && window.location.reload();
    }
    throw e;
  } finally {
    wait.resolve();
    wait = null;
  }
};
