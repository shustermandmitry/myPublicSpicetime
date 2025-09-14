import { TelegramUser } from '@/mods/telegram-user/telegram-user.entity';
import { PsqlTableService } from '@treenity/feathers-psql';
import { feathersContext } from '@treenity/feathers-service';

class TelegramUsersService extends PsqlTableService<TelegramUser> {}

feathersContext.add('sys.telegram-user', TelegramUsersService);

export default TelegramUsersService;
