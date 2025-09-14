import { ExchangerEntity } from './exchanger.entity';
import { Params } from '@treenity/feathers-service';
import { AccountEntity } from './account.entity';
import { TransactionEntity } from './transaction.entity';
import { WalletEntity } from './wallet.entity';

export type ExchangerService = {
  create(data: IExchangerData): Promise<ExchangerEntity>;
  rate(data: IExchangerData): Promise<any>;
  find(params: Params): Promise<ExchangerEntity[]>;
  get(id: number, params: Params): Promise<ExchangerEntity>;
  remove(id: number, params: Params): Promise<any>;
};

export type AccountService = {
  create(data: AccountEntity): Promise<AccountEntity>;
  find(params: Params): Promise<AccountEntity[]>;
  get(id: string): Promise<AccountEntity>;
};

export type TransactionService = {
  settleRefill(data: IPayloadData): Promise<TransactionEntity>;
  authorizeRefill(data: IPayloadData): Promise<TransactionEntity>;
  settle(transactionId: number): Promise<TransactionEntity>;
  settleList(transactionId: number[]): Promise<TransactionEntity>;
  refund(
    transactionId: number,
    params?: Params<{ description: string }>,
  ): Promise<TransactionEntity>;
  settleWithdrawal(data: IPayloadData): Promise<TransactionEntity>;
  authorizeWithdrawal(data: IPayloadData): Promise<TransactionEntity>;
  settleTransfer(data: ITransferData): Promise<TransactionEntity[]>;
  authorizeTransfer(data: ITransferData): Promise<TransactionEntity[]>;
  count(data: ICountRequest): Promise<ICountResponse>;
  find(params: Params<IListParams>): Promise<TransactionEntity[]>;
  get(id: number, params: Params): Promise<TransactionEntity>;
};

export interface IExchangerData {
  from: string;
  to: string;
  rate: number;
}

export interface ICountRequest {
  account: string;
  token: string;
  owner: number;
}

export interface ICountResponse {
  count: number;
}

export interface IListParams extends ICountRequest {}

export interface IPayloadData {
  account: string;
  token: string;
  amount: number;
  id: number;
  description?: string;
}

export interface ITransferData {
  fromId: number;
  toId: number;
  fromAccount: string;
  toAccount: string;
  fromToken: string;
  toToken: string;
  amount: number;
  description?: string;
}

export type WalletService = {
  create(data: ICreateWallet): Promise<WalletEntity>;
  balanceBySlug(data: ISlugRequest): Promise<IBalanceResponse>;
  balanceListBySlug(data: ListBySlugRequest): Promise<IBalanceListBySlugResponse[]>;
  balanceListBySlugObject(data: ListBySlugRequest): Promise<IBalanceListBySlugObjectResponse>;
  balanceSum(data: ListBySlugRequest): Promise<IBalanceResponse>;
  balanceBySlugValuesWithId(
    data: IBalanceBySlugValuesWithIdRequest,
  ): Promise<IBalanceListBySlugResponse[]>;
  balanceByAccount(data: IBalanceByAccount): Promise<IBalanceListBySlugResponse[]>;
  balanceListByAccount(data: ISlugRequest): Promise<IBalanceListBySlugResponse[]>;
  createWalletSlug(data: ICreateWalletSlug): Promise<string>;
};

export interface ICreateWallet {
  account: string;
  token: string;
  owner: number;
}

export interface ICreateWalletSlug extends ICreateWallet {
  desc?: string;
}

export interface ISlugRequest {
  slug: string;
}

export interface IBalanceListBySlugResponse extends ISlugRequest {
  value: number;
}

export interface IBalanceListBySlugObjectResponse {
  [slug: string]: number;
}

export interface IBalanceResponse {
  balance: number;
  incomeHolds: number;
  outcomeHolds: number;
}

export interface IBalanceBySlugValuesWithIdRequest {
  account: string;
  token: string;
  ids: number[];
}

export interface IBalanceByAccount {
  account: string;
}

export type ListBySlugRequest = { slugs: string[] };
