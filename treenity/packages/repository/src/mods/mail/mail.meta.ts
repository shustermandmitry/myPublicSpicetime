import { FromSchema } from '@treenity/json-schema';
import { Meta } from '@treenity/core';
import { metaType } from '@treenity/core';
import { TreenityService } from '@treenity/feathers-service';

export const mailServiceSchema = {
  $id: 'timely.mail',
  type: 'object',
  additionalProperties: false,
  required: ['handler', 'company', 'defaultLang'],
  properties: {
    handler: { type: 'string' },
    company: { type: 'string' },
    defaultLang: { type: 'string' },
  },
} as const;

export type MailServiceMeta = Meta & FromSchema<typeof mailServiceSchema>;

export interface IMailData extends Record<string, any> {
  slug: string;
  receiver: string;
  userId?: string;
}

export type IMailService = Pick<TreenityService, 'create'>;
export const MailServiceType = metaType<IMailService>('sys.mail');
