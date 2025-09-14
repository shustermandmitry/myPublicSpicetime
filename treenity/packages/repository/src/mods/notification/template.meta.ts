import { FromSchema } from '@treenity/json-schema';
import { metaType } from '@treenity/core';
import { Params, TreenityService } from '@treenity/feathers-service';

export const createNotificationTemplateSchema = {
  $id: 'notification_template_created',
  type: 'object',
  additionalProperties: false,
  required: ['slug', 'content'],
  properties: {
    title: { type: 'string' },
    content: { type: 'string' },
    slug: { type: 'string' },
    handler: { type: 'string' },
    type: { type: 'string', default: 'html' },
  },
} as const;

export const notificationTemplateSchema = {
  ...createNotificationTemplateSchema,
  $id: 'notification_template',
  required: [...createNotificationTemplateSchema.required, 'id', 'created_at', 'updated_at'],
  properties: {
    ...createNotificationTemplateSchema.properties,
    id: { type: 'number' },
    created_at: { type: 'string', format: 'date' },
    updated_at: { type: 'string', format: 'date' },
    deleted_at: { type: 'string', format: 'date' },
  },
} as const;

export type INotificationTemplate = FromSchema<typeof notificationTemplateSchema>;
export type ICreateNotificationTemplate = FromSchema<typeof createNotificationTemplateSchema>;

export type NotificationTemplateService = TreenityService<INotificationTemplate> & {
  send(data: any, params?: Params): Promise<void>;
  count(_: undefined, params: Params): Promise<number>;
};
export const NotificationTemplateServiceType = metaType<NotificationTemplateService>(
  'sys.notification.template',
);
