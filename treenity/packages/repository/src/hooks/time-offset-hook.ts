import { HookContext } from '@/declarations';
import { parseCookies } from '@/utils/cookies';
import { HookFunction, Service } from '@feathersjs/feathers';
import getHeadersFromContext from '../utils/get-headers-from-context';

export const getTzFromContext = (tz: string | undefined): number | undefined => {
  const newTz = tz && parseInt(tz, 10);
  if (!newTz || isNaN(newTz)) {
    return;
  }

  return newTz;
};

const timeOffsetHook: HookFunction = async function (this: Service, context: HookContext) {
  const { app } = context;

  const headers = getHeadersFromContext(context);
  if (!headers) {
    return;
  }

  const { user } = context.params || {};
  if (!user) {
    return;
  }

  const tz = getTzFromContext(headers['timezone']);
  if (!tz) {
    return;
  }

  const isEqualTz = tz === user.tz;
  if (isEqualTz) {
    return;
  }

  try {
    user.tz = tz;
    await app.service('sys/users').update(user.id, user);
  } catch (e) {
    console.warn("Can't update user tz", e);
  }
};

export default timeOffsetHook;
