import { HookContext, NextFunction } from '@/declarations';
import { SecurityServiceType } from '@/mods/security/security-code.meta';
import { awaitService } from '@/utils';

export const verifyEmail2fa = async (context: HookContext, next: NextFunction) => {
  const { app } = context;
  const [data, params] = context.arguments;
  const { code } = data;
  const { user_id } = params;

  if (!code) {
    throw new Error('Two-factor authentication was not performed');
  }

  if (process.env.NODE_ENV !== 'production') {
    return true;
  }

  const securityService = await awaitService(app, '/sys/security', SecurityServiceType);

  try {
    await securityService.verify({
      code,
      itemId: String(user_id),
      type: 'checkEmail2fa',
    });
  } catch (e) {
    throw new Error('Invalid code');
  }

  return true;
};
