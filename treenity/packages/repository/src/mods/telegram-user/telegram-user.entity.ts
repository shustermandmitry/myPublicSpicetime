import { metaType } from '@treenity/core';
import { entity } from '@treenity/entity';
import { PsqlTableService } from '@treenity/feathers-psql';

export const TelegramUserType = metaType<TelegramUser>('sys.telegram-user');

@entity(TelegramUserType)
export class TelegramUser extends PsqlTableService<TelegramUser> {
  chat_instance!: bigint;
  tuser!: bigint;
  user_id!: number;
  user_name!: string;
  is_premium!: boolean;
}
