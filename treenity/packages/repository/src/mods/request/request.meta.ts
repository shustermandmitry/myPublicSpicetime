import { FromSchema } from '@treenity/json-schema';
import { Params, TreenityService } from '@treenity/feathers-service';
import { metaType } from '@treenity/core';

export const requestSchema = {
  $id: 'request',
  type: 'object',
  additionalProperties: false,
  required: ['userId', 'type'],
  properties: {
    id: { type: 'number' },
    createdAt: { type: 'string', format: 'date' },
    updatedAt: { type: 'string', format: 'date' },
    deletedAt: { type: 'string', format: 'date' },
    userId: { type: 'number' },
    amount: { type: 'number' },
    type: { type: 'string' },
    status: { type: 'number', default: 0 },
    meta: { type: 'object' },
  },
} as const;

export type IRequest = FromSchema<typeof requestSchema>;
export type CreateRequestMeta = Omit<IRequest, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>;
export type ChangeStatusRequest = { id: number; status: number };

export type RequestService<Data extends IRequest = IRequest> = TreenityService<Data> & {
  changeStatus(data: ChangeStatusRequest, params: Params): Promise<Data>;
};

export const RequestServiceType = metaType<RequestService>('sys.request');
