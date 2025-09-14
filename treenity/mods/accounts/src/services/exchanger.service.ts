import { Application, Params, awaitService, feathersContext } from '@treenity/feathers-service';
import { TreenityService } from '@treenity/feathers-service';
import { Patch } from '@treenity/tree-api';
import { ExchangerEntity, ExchangerType } from './exchanger.entity';
import { rest } from '@treenity/repository/mods.types';
import { IdRequest } from '@treenity/repository';

class ExchangerService extends TreenityService<
  ExchangerEntity,
  Partial<ExchangerEntity>,
  Params,
  Patch[]
> {
  customMethods: string[] = ['rate'];
  exchangerRestClient: rest.RestClient = null!;

  async _setup(app: Application, path: string) {
    this.exchangerRestClient = await awaitService(app, '/sys/accounts-rest/exchanger');
  }

  private convertExchangerToEntity(exchanger: ExchangerEntity) {
    const exchangerAny = exchanger as any;
    exchangerAny.$id = `${ExchangerType.$type}_${exchanger.id}`;
    exchangerAny.$type = ExchangerType.$type;
    return exchangerAny as ExchangerEntity;
  }

  async get(id: number, params: Params): Promise<ExchangerEntity> {
    const { from, to } = params.query!;
    const { item } = await this.exchangerRestClient.update<
      { from: string; to: string },
      rest.GoServiceItem<ExchangerEntity>
    >('getBySlug', { from, to });
    return this.convertExchangerToEntity(item);
  }

  async create(data: ExchangerEntity): Promise<ExchangerEntity> {
    const { item } = await this.exchangerRestClient.update<
      ExchangerEntity,
      rest.GoServiceItem<ExchangerEntity>
    >('create', data);
    return this.convertExchangerToEntity(item);
  }

  async rate(data: ExchangerEntity): Promise<any> {
    await this.exchangerRestClient.update<ExchangerEntity, never>('rate', data);
    return true;
  }

  async find(): Promise<ExchangerEntity[]> {
    const { list } = await this.exchangerRestClient.update<
      undefined,
      rest.GoServiceList<ExchangerEntity>
    >('list', undefined);

    return list.map(exchanger => this.convertExchangerToEntity(exchanger));
  }

  async remove(id: number): Promise<any> {
    await this.exchangerRestClient.update<IdRequest, never>('remove', { id });
    return true;
  }
}

feathersContext.add('sys.accounts.exchanger.service', ExchangerService);

export default ExchangerService;
