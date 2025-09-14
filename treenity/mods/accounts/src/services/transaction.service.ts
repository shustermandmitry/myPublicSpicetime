import {
  Application,
  awaitService,
  feathersContext,
  Params,
  TreenityService,
} from '@treenity/feathers-service';
import { rest } from '@treenity/repository/mods.types';
import { IdRequest, IdsRequest } from '@treenity/repository';
import { TransactionEntity, TransactionType } from './transaction.entity';
import { Patch } from '@treenity/tree-api';
import {
  ICountRequest,
  ICountResponse,
  IListParams,
  IPayloadData,
  ITransferData,
} from './mods.types';

class TransactionService extends TreenityService<
  TransactionEntity,
  Partial<TransactionEntity>,
  Params,
  Patch[]
> {
  customMethods: string[] = [
    'settleRefill',
    'authorizeRefill',
    'settle',
    'settleList',
    'refund',
    'settleWithdrawal',
    'authorizeWithdrawal',
    'settleTransfer',
    'authorizeTransfer',
    'count',
  ];
  transactionRestService: rest.RestClient = null!;

  private getQuery(params: Params) {
    const { $skip, $sort, $limit, $select, ...query } = params.query || {};

    return {
      query,
      filters: { $skip, $sort, $limit, $select },
    };
  }

  async _setup(app: Application, path: string) {
    this.transactionRestService = await awaitService(app, '/sys/accounts-rest/transaction');
  }

  private convertTransactionToEntity(transaction: TransactionEntity) {
    const transactionAny = transaction as any;
    transactionAny.$id = `${TransactionType.$type}_${transaction.id}`;
    transactionAny.$type = TransactionType.$type;
    return transactionAny;
  }

  async settleRefill(data: IPayloadData): Promise<TransactionEntity> {
    const { item } = await this.transactionRestService.update<
      IPayloadData,
      rest.GoServiceItem<TransactionEntity>
    >('settleRefill', data);
    return this.convertTransactionToEntity(item);
  }

  async authorizeRefill(data: IPayloadData): Promise<TransactionEntity> {
    const { item } = await this.transactionRestService.update<
      IPayloadData,
      rest.GoServiceItem<TransactionEntity>
    >('authorizeRefill', data);
    return this.convertTransactionToEntity(item);
  }

  async settle(transactionId: number): Promise<TransactionEntity> {
    const { item } = await this.transactionRestService.update<
      IdRequest,
      rest.GoServiceItem<TransactionEntity>
    >('settle', { id: transactionId });
    return this.convertTransactionToEntity(item);
  }

  async settleList(transactionIds: number[]): Promise<TransactionEntity> {
    const { item } = await this.transactionRestService.update<
      IdsRequest,
      rest.GoServiceItem<TransactionEntity>
    >('settle-list', { ids: transactionIds });
    return this.convertTransactionToEntity(item);
  }

  async refund(
    transactionId: number,
    params?: Params<{ description: string }>,
  ): Promise<TransactionEntity> {
    const description = params?.query?.description;
    const { item } = await this.transactionRestService.update<
      IdRequest & { description?: string },
      rest.GoServiceItem<TransactionEntity>
    >('refund', { id: transactionId, description });
    return this.convertTransactionToEntity(item);
  }

  async settleWithdrawal(data: TransactionEntity): Promise<TransactionEntity> {
    const { item } = await this.transactionRestService.update<
      TransactionEntity,
      rest.GoServiceItem<TransactionEntity>
    >('settleWithdrawal', data);

    return this.convertTransactionToEntity(item);
  }

  async authorizeWithdrawal(data: TransactionEntity): Promise<TransactionEntity> {
    const { item } = await this.transactionRestService.update<
      TransactionEntity,
      rest.GoServiceItem<TransactionEntity>
    >('authorizeWithdrawal', data);

    return this.convertTransactionToEntity(item);
  }

  async settleTransfer(data: ITransferData): Promise<TransactionEntity[]> {
    const { list } = await this.transactionRestService.update<
      ITransferData,
      rest.GoServiceList<TransactionEntity>
    >('settleTransfer', data);
    return list.map(transaction => this.convertTransactionToEntity(transaction));
  }

  async authorizeTransfer(data: ITransferData): Promise<TransactionEntity[]> {
    const { list } = await this.transactionRestService.update<
      ITransferData,
      rest.GoServiceList<TransactionEntity>
    >('authorizeTransfer', data);
    return list.map(transaction => this.convertTransactionToEntity(transaction));
  }

  async count(data: ICountRequest): Promise<ICountResponse> {
    const { account, token, owner } = data;
    return await this.transactionRestService.update<ICountRequest, ICountResponse>('count', {
      account,
      token,
      owner,
    });
  }

  async find(params: Params<IListParams>): Promise<TransactionEntity[]> {
    const { query, filters } = this.getQuery(params);
    const { account, token, owner } = query;
    const { list } = await this.transactionRestService.update<
      IListParams,
      rest.GoServiceList<TransactionEntity>
    >('list', {
      account,
      token,
      owner,
    });
    return list.map(transaction => this.convertTransactionToEntity(transaction));
  }

  async get(id: number, params: Params): Promise<TransactionEntity> {
    const { item } = await this.transactionRestService.update<
      IdRequest,
      rest.GoServiceItem<TransactionEntity>
    >('get', { id }, params);
    return this.convertTransactionToEntity(item);
  }
}

feathersContext.add('sys.accounts.transaction.service', TransactionService);

export default TransactionService;
