import type { CreateTokensResponse, IAuthService } from '@/mods/auth/auth.service';
import { FromSchema } from '@treenity/json-schema';
import { Meta, metaType } from '@treenity/core';

export const authServiceSchema = {
  $id: 'sys.auth',
  type: 'object',
  additionalProperties: false,
  required: ['sessionServicePath', 'strategiesPath', 'defaultRole', 'defaultPassword'],
  properties: {
    sessionServicePath: { type: 'string' },
    defaultRole: { type: 'string' },
    useVerify: { type: 'boolean' },
    defaultPassword: { type: 'string' },
    customCode: { type: 'string' },
    disallowSignup: { type: 'boolean' },
    refreshTokenExpiresIn: { type: 'number' },
    accessTokenExpiresIn: { type: 'number' },
    strategiesPath: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
  },
} as const;
export type AuthServiceMeta = Meta & FromSchema<typeof authServiceSchema>;
export { IAuthService, CreateTokensResponse };
export const AuthServiceType = metaType<IAuthService>('sys.auth');
