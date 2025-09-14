import {
  Application,
  awaitService,
  feathersContext,
  Params,
  TreenityService,
  Unprocessable,
} from '@treenity/feathers-service';
import { rest } from '@treenity/repository/mods.types';
import { WalletEntity, WalletType } from './wallet.entity';
import { Patch } from '@treenity/tree-api';
import {
  IBalanceByAccount,
  IBalanceBySlugValuesWithIdRequest,
  IBalanceListBySlugObjectResponse,
  IBalanceListBySlugResponse,
  IBalanceResponse,
  ICreateWallet,
  ICreateWalletSlug,
  ISlugRequest,
  ListBySlugRequest,
} from './mods.types';
import { IdRequest } from '@treenity/repository';

class WalletService extends TreenityService<WalletEntity, Partial<WalletEntity>, Params, Patch[]> {
  accountRestClient: rest.RestClient = null!;
  customMethods: string[] = [
    'balanceBySlug',
    'balanceListBySlug',
    'balanceListBySlugObject',
    'balanceSum',
    'balanceBySlugValuesWithId',
    'balanceByAccount',
    'balanceListByAccount',
    'createWalletSlug',
  ];

  async _setup(app: Application, path: string) {
    this.accountRestClient = await awaitService(app, '/sys/accounts-rest/wallet');
  }

  async createWalletSlug(data: ICreateWalletSlug) {
    const { account, token, desc = '', owner } = data;
    return `${account}${token}${desc}${owner}`;
  }

  private convertWalletToEntity(wallet: WalletEntity) {
    const walletAny = wallet as any;
    walletAny.$id = `${WalletType.$type}_${wallet.ID}`;
    walletAny.$type = WalletType.$type;
    return walletAny;
  }

  async get(id: string, params: Params<{ id: string }>): Promise<WalletEntity> {
    const _id = id ?? params.query?.id;
    if (!_id) {
      throw new Unprocessable('Wallet id required');
    }
    const { item } = await this.accountRestClient.update<
      IdRequest<string>,
      rest.GoServiceItem<WalletEntity>
    >('get', {
      id: _id,
    });

    return this.convertWalletToEntity(item);
  }

  async create(data: ICreateWallet): Promise<WalletEntity> {
    const { account, token, owner } = data;
    const item = await this.accountRestClient.update<ICreateWallet, WalletEntity>('create', {
      account,
      token,
      owner,
    });

    return this.convertWalletToEntity(item);
  }

  async balanceBySlug(data: ISlugRequest): Promise<IBalanceResponse> {
    const { slug } = data;
    return await this.accountRestClient.update<ISlugRequest, IBalanceResponse>('balanceBySlug', {
      slug,
    });
  }

  async balanceListBySlug(data: ListBySlugRequest): Promise<IBalanceListBySlugResponse[]> {
    const { slugs } = data;

    const { list } = await this.accountRestClient.update<
      { slugs: string[] },
      rest.GoServiceList<IBalanceListBySlugResponse>
    >('balanceListBySlug', { slugs });

    return list;
  }

  async balanceListBySlugObject(
    data: ListBySlugRequest,
  ): Promise<IBalanceListBySlugObjectResponse> {
    const { slugs } = data;
    const { list } = await this.accountRestClient.update<
      ListBySlugRequest,
      { list: IBalanceListBySlugObjectResponse }
    >('balanceListBySlugObject', { slugs });

    return list;
  }

  async balanceSum(data: ListBySlugRequest): Promise<IBalanceResponse> {
    const { slugs } = data;
    return await this.accountRestClient.update<ListBySlugRequest, IBalanceResponse>('balanceSum', {
      slugs,
    });
  }

  async balanceBySlugValuesWithId(
    data: IBalanceBySlugValuesWithIdRequest,
  ): Promise<IBalanceListBySlugResponse[]> {
    const { account, token, ids } = data;
    const { list } = await this.accountRestClient.update<
      IBalanceBySlugValuesWithIdRequest,
      rest.GoServiceList<IBalanceListBySlugResponse>
    >('balanceBySlugValuesWithId', { account, token, ids });

    return list;
  }

  async balanceByAccount(data: IBalanceByAccount): Promise<IBalanceListBySlugResponse[]> {
    const { account } = data;
    const { list } = await this.accountRestClient.update<
      IBalanceByAccount,
      rest.GoServiceList<IBalanceListBySlugResponse>
    >('balanceByAccount', { account });

    return list;
  }

  async balanceListByAccount(data: ISlugRequest): Promise<IBalanceListBySlugResponse[]> {
    const { slug } = data;
    const { list } = await this.accountRestClient.update<
      ISlugRequest,
      rest.GoServiceList<IBalanceListBySlugResponse>
    >('balanceListByAccount', { slug });

    return list;
  }
}

feathersContext.add('sys.accounts.wallet.service', WalletService);

export default WalletService;
