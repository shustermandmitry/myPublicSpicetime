import { FromSchema } from '@treenity/json-schema';

export const userCreatedSchema = {
  $id: 'user_created',
  type: 'object',
  additionalProperties: false,
  required: ['email', 'password'],
  properties: {
    email: { type: 'string', format: 'email' },
    lang: { type: 'string' },
    role: { type: 'string' },
    password: { type: 'string' },
    first_name: { type: 'string' },
    last_name: { type: 'string' },
    photo: { type: 'string' },
    tz: { type: 'integer', default: 0 },
  },
} as const;

export const userSchema = {
  id: 'user',
  ...userCreatedSchema,
  properties: {
    ...userCreatedSchema.properties,
    id: { type: 'number' },
    created_at: { type: 'string', format: 'date' },
    updated_at: { type: 'string', format: 'date' },
    deleted_at: { type: 'string', format: 'date' },
    verified: { type: 'boolean' },
    blocked: { type: 'boolean' },
    first_name: { type: 'string' },
    last_name: { type: 'string' },
    surname: { type: 'string' },
    lang: { type: 'string' },
    photo: { type: 'string' },
  },
  required: ['id', 'email', 'password', 'role', 'created_at', 'updated_at'],
} as const;

export type IUser = FromSchema<typeof userSchema>;
export type IUserCreate = FromSchema<typeof userCreatedSchema>;

export type UserMeta = IUser;
