import { metaType } from '@treenity/core';
import { entity, writeMethod } from '@treenity/entity';
import { Raw } from '@treenity/js-shared/utils';

type integer = number;

export const BaseUserType = metaType<BaseUserEntity>('sys.users');

@entity(BaseUserType)
export class BaseUserEntity {
  id!: integer;
  created_at!: Date;
  updated_at?: Date;
  deleted_at?: Date;
  verified: boolean = false;
  blocked: boolean = false;
  first_name?: string;
  last_name?: string;
  surname?: string;
  lang?: string;
  photo?: string;

  removed: boolean = false;

  /** @format email */
  email!: string;

  role!: string;
  tz: integer = 0;

  @writeMethod
  async update(data: Partial<Raw<BaseUserEntity>>): Promise<void> {
    Object.assign(this, data);
  }
}
//
// @entity(UserType.server)
// class UseEntityServer extends UserEntity {
//   password!: string;
// }
// //
// // class User extends UserEntity {}
