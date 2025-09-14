import { Meta, metaType } from '@treenity/core';
import { FromSchema, Params } from '@treenity/feathers-service';

export const clickUpServiceSchema = {
  $id: 'click_up_service',
  type: 'object',
  require: ['teamId', 'listId', 'authToken', 'webhookEndPoint'],
  additionalProperties: false,
  properties: {
    teamId: {
      type: 'string',
    },
    listId: {
      type: 'string',
    },
    webhookEndPoint: {
      type: 'string',
    },
    authToken: {
      type: 'string',
    },
  },
} as const;

export type IClickUpServiceMeta = Meta & FromSchema<typeof clickUpServiceSchema>;

export const clickUpTaskSchema = {
  $id: 'Task',
  title: 'Task',
  type: 'object',
  require: ['name'],
  properties: {
    name: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
    markdown_description: {
      type: 'string',
    },
    assignees: {
      type: 'array',
      items: {
        type: 'number',
      },
    },
    archived: {
      type: 'boolean',
    },
    group_assignees: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    tags: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    status: {
      type: 'string',
    },
    priority: {
      type: 'number',
    },
    due_date: {
      type: 'number',
    },
    due_date_time: {
      type: 'boolean',
    },
    time_estimate: {
      type: 'number',
    },
    start_date: {
      type: 'number',
    },
    start_date_time: {
      type: 'boolean',
    },
    points: {
      type: 'number',
    },
    notify_all: {
      type: 'boolean',
    },
    parent: {
      type: ['null', 'string'],
    },
    links_to: {
      type: ['null', 'string'],
    },
    check_required_custom_fields: {
      type: 'boolean',
    },
    custom_fields: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
          value: {
            type: 'string',
          },
        },
        required: ['id', 'value'],
      },
    },
  },
} as const;

export type IClickUpTask = FromSchema<typeof clickUpTaskSchema>;

export const clickUpWebhookRequest = {
  $id: 'click-up-webhook-request',
  title: 'WebhookRequestBody',
  type: 'object',
  required: ['endpoint', 'events'],
  properties: {
    id: {
      type: 'string',
    },
    endpoint: {
      type: 'string',
    },
    events: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    space_id: {
      type: 'number',
    },
    folder_id: {
      type: 'number',
    },
    list_id: {
      type: 'number',
    },
    task_id: {
      type: 'string',
    },
    secret: {
      type: 'string',
    },
  },
} as const;

export type IClickUpWebhook = FromSchema<typeof clickUpWebhookRequest>;

export type ClickUpService = {
  createTask(task: IClickUpTask): Promise<any>;
  updateStatusTask(taskId: string, status: string): Promise<any>;
  addComment(taskId: string, comment: string): Promise<any>;
  verifySignature(data: any, params: Params): Promise<void>;
  getTask(data: { taskId: string }): Promise<IClickUpTask>;
};

export const ClickUpServiceType = metaType<ClickUpService>('sys.click_up');
