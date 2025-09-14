import { hashPassword, userValidatorHook } from '@/mods/user/hooks';
import { IUser } from '@/mods/user/user.meta';
import { ApplicationHookOptions } from '@feathersjs/feathers';
import { PsqlTableService } from '@treenity/feathers-psql';
import { feathersContext } from '@treenity/feathers-service';

class UsersService extends PsqlTableService<IUser> {
  public getHooks(): ApplicationHookOptions<this> {
    return {
      before: {
        // create: [userValidator],
        // TODO: Check hashPassword is even needed here
        create: [userValidatorHook, hashPassword],
      },
    } as ApplicationHookOptions<this>;
  }
}

feathersContext.add('sys.users', UsersService);

export default UsersService;
