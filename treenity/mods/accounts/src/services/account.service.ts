import {
  Application,
  awaitService,
  feathersContext,
  Params,
  TreenityService,
} from '@treenity/feathers-service';
import { AccountEntity, AccountType } from './account.entity';
import { Patch } from '@treenity/tree-api';
import { rest } from '@treenity/repository/mods.types';

class AccountService extends TreenityService<
  AccountEntity | undefined,
  Partial<AccountEntity>,
  Params,
  Patch[]
> {
  accountRestClient: rest.RestClient = null!;

  async _setup(app: Application, path: string) {
    this.accountRestClient = await awaitService(app, '/sys/accounts-rest');
  }

  private convertAccountToEntity(account: AccountEntity) {
    const accountAny = account as any;
    accountAny.$id = `${AccountType.$type}_${account.id}`;
    accountAny.$type = AccountType.$type;
    return accountAny;
  }

  async create(data: AccountEntity): Promise<AccountEntity> {
    const { item } = await this.accountRestClient.update<
      AccountEntity,
      rest.GoServiceItem<AccountEntity>
    >('create', data);
    return this.convertAccountToEntity(item);
  }

  async get(id: string, params: Params): Promise<AccountEntity | undefined> {
    const accounts = await this.find(params);
    const account = accounts.find(account => account.id === id);
    return account;
  }

  async find(params: Params): Promise<AccountEntity[]> {
    const { list } = await this.accountRestClient.update<
      undefined,
      rest.GoServiceList<AccountEntity>
    >('list', undefined, params);
    return list.map(account => this.convertAccountToEntity(account));
  }
}

feathersContext.add('sys.accounts.service', AccountService);

export default AccountService;
