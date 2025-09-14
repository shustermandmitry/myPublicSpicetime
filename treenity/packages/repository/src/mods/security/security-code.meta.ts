import { VerifyRequest } from '@/mods/security/security.service';
import { FromSchema } from '@treenity/json-schema';
import { Meta, metaType } from '@treenity/core';
import type { TreenityService } from '@treenity/feathers-service';

export const securityCodeSchema = {
  $id: 'sys.security',
  type: 'object',
  additionalProperties: false,
  required: ['code', 'type', 'itemId'],
  properties: {
    id: { type: 'number' },
    code: { type: 'string' },
    type: { type: 'string' },
    itemId: { type: 'string' },
    extra: { type: 'object' },
  },
} as const;

export type SecurityCodeMeta = Meta & FromSchema<typeof securityCodeSchema>;

type CreateSecurity = { itemId: string; type: string; lifetimeMs?: number };
export type GetByCodeRequest = { code: string; type: string };

export type SecurityService = TreenityService<SecurityCodeMeta, CreateSecurity> & {
  verify(data: VerifyRequest): Promise<null>;
  getByCode(data: GetByCodeRequest): Promise<SecurityCodeMeta>;
};
export const SecurityServiceType = metaType<SecurityService>('sys.security');
export type CreateSecurityMeta = Omit<
  SecurityCodeMeta,
  'id' | 'createdAt' | 'deletedAt' | 'updatedAt'
>;
