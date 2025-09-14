import { FromSchema } from '@treenity/json-schema';
import { metaType } from '@treenity/core';
import { Params, TreenityService } from '@treenity/feathers-service';
import { GoServicePaginationParams } from '@/mods/rest-client/types';

export const createNotificationSchema = {
  $id: 'notification_created',
  type: 'object',
  additionalProperties: false,
  required: ['userId', 'content'],
  properties: {
    userId: { type: 'number' },
    title: { type: 'string' },
    content: { type: 'string' },
    meta: { type: 'object' },
  },
} as const;

export const notificationSchema = {
  ...createNotificationSchema,
  $id: 'notification',
  required: [...createNotificationSchema.required, 'id', 'created_at', 'updated_at'],
  properties: {
    ...createNotificationSchema.properties,
    id: { type: 'number' },
    created_at: { type: 'string', format: 'date' },
    updated_at: { type: 'string', format: 'date' },
    deleted_at: { type: 'string', format: 'date' },
    read: { type: 'boolean', default: false },
  },
} as const;

export type INotification = FromSchema<typeof notificationSchema>;
export type ICreateNotification = FromSchema<typeof createNotificationSchema>;

export type NotificationService = TreenityService<INotification> & {
  readOne(data: any, params: Params): Promise<never>;
  readAll(data: any, params: Params): Promise<never>;
  unreadCount(data: UserIdParams, params: Params): Promise<CountResponse>;
};
export const NotificationServiceType = metaType<NotificationService>('sys.notification');

export interface FindParams extends UserIdParams {
  query?: string;
  opts?: GoServicePaginationParams;
}

export interface UserIdParams {
  userId: number;
}

export interface CountResponse {
  count: number;
}
