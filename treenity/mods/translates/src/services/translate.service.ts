import {
  DomainRequest,
  ExportRequest,
  FindRequest,
  IdRequest,
  ImportData,
  InputValueRequest,
  KeyRequest,
  ListByDomainCodeRequest,
  ListByKeysRequest,
  ListByKeysResponse,
} from '../types';
import {
  Application,
  awaitService,
  feathersContext,
  Params,
  TreenityService,
} from '@treenity/feathers-service';
import { Patch } from '@treenity/tree-api';
import { TranslateEntity, TranslateType } from '../entity';
import { rest } from '@treenity/repository/mods.types';
import { APPLICATION_TYPE_JSON } from '../consts';

class TranslateService extends TreenityService<
  TranslateEntity | ListByKeysResponse,
  Partial<TranslateEntity>,
  Params,
  Patch[]
> {
  translateService: rest.RestClientService = null!;
  customMethods: string[] = [
    'change',
    'listByKeys',
    'copy',
    'count',
    'listByDomainCode',
    'getByKey',
    'getByKeyWithDefaultLang',
    'inputValue',
    'exportAll',
    'export',
    'import',
  ];

  async _setup(app: Application, path: string) {
    this.translateService = await awaitService(app, '/sys/translates-rest');
  }

  private convertTranslateToEntity(translate: TranslateEntity) {
    const translateAny = translate as any;
    translateAny.$id = `${TranslateType.$type}_${translate.id}`;
    translateAny.$type = TranslateType.$type;
    return translateAny;
  }

  async change(
    data: TranslateEntity,
    params: Params,
  ): Promise<rest.GoServiceItem<TranslateEntity>> {
    const res = await this.translateService.update<
      TranslateEntity,
      rest.GoServiceItem<TranslateEntity>
    >('change', data, { headers: APPLICATION_TYPE_JSON });
    res.item = this.convertTranslateToEntity(res.item);
    return res;
  }

  async update(id: number, data: TranslateEntity, params: Params): Promise<TranslateEntity> {
    const { item } = await this.translateService.update<
      TranslateEntity,
      rest.GoServiceItem<TranslateEntity>
    >('change', { ...data, id }, { headers: APPLICATION_TYPE_JSON });
    return this.convertTranslateToEntity(item);
  }

  async find(params: Params): Promise<any> {
    const { query, domain, opts } = params.query!;
    return await this.translateService.update<FindRequest>(
      'list-admin',
      { query, domain, opts },
      { headers: APPLICATION_TYPE_JSON },
    );
  }

  async listByKeys(data: ListByKeysRequest, params: Params): Promise<{ list: ListByKeysResponse }> {
    const { keys, code, domain } = data;
    const list = await this.translateService.update<
      ListByKeysRequest,
      { list: ListByKeysResponse }
    >('list-by-keys', { domain, keys, code }, { headers: APPLICATION_TYPE_JSON });

    return list;
  }

  async count(data: FindRequest, params: Params): Promise<rest.GoServiceItem<number>> {
    const { domain, query } = data;
    return await this.translateService.update<FindRequest>(
      'count',
      {
        query,
        domain,
      },
      { headers: APPLICATION_TYPE_JSON },
    );
  }

  // @ts-ignore
  async remove(id: number, params: Params): Promise<rest.GoServiceItem<TranslateEntity>> {
    const { domain } = params.query!;
    const res = await this.translateService.update<
      IdRequest & DomainRequest,
      rest.GoServiceItem<TranslateEntity>
    >('delete', { id: id, domain }, { headers: APPLICATION_TYPE_JSON });
    res.item = this.convertTranslateToEntity(res.item);
    return res;
  }

  async copy(
    data: IdRequest & DomainRequest,
    params: Params,
  ): Promise<rest.GoServiceItem<TranslateEntity>> {
    const { id, domain } = data;
    const res = await this.translateService.update<
      IdRequest & DomainRequest,
      rest.GoServiceItem<TranslateEntity>
    >('copy', { id, domain }, { headers: APPLICATION_TYPE_JSON });
    res.item = this.convertTranslateToEntity(res.item);
    return res;
  }

  async listByDomainCode(
    data: ListByDomainCodeRequest,
    params: Params,
  ): Promise<ListByKeysResponse> {
    const { domain, code } = data;
    const { list } = await this.translateService.update<ListByDomainCodeRequest>(
      'list-by-domain-code',
      { domain, code },
      { headers: APPLICATION_TYPE_JSON },
    );

    return list;
  }

  async getByKey(
    data: KeyRequest & DomainRequest,
    params: Params,
  ): Promise<rest.GoServiceItem<TranslateEntity>> {
    const { domain } = data;
    const { key } = params.query!;
    const res = await this.translateService.update<
      KeyRequest & DomainRequest,
      rest.GoServiceItem<TranslateEntity>
    >('get-by-key', { domain, key }, { headers: APPLICATION_TYPE_JSON });
    res.item = this.convertTranslateToEntity(res.item);
    return res;
  }

  async getByKeyWithDefaultLang(
    data: KeyRequest & DomainRequest,
    params: Params,
  ): Promise<TranslateEntity> {
    const { domain, key } = data;
    const { item } = await this.translateService.update<
      KeyRequest & DomainRequest,
      rest.GoServiceItem<TranslateEntity>
    >('get-by-key-with-default-lang', { domain, key }, { headers: APPLICATION_TYPE_JSON });

    return this.convertTranslateToEntity(item);
  }

  async inputValue(data: InputValueRequest, params: Params): Promise<ListByKeysResponse> {
    const { domain, key, code } = data;
    return await this.translateService.update<InputValueRequest>(
      'input-value',
      { domain, key, code },
      { headers: APPLICATION_TYPE_JSON },
    );
  }

  async exportAll(data: DomainRequest, params: Params): Promise<ImportData> {
    const { domain } = data;

    const res = await this.translateService.update<DomainRequest>('export-all', { domain });
    return res;
  }

  async export(data: ExportRequest, params: Params): Promise<ImportData> {
    const { ids, domain } = data;
    return await this.translateService.update<ExportRequest>(
      'export',
      {
        domain,
        ids,
      },
      { headers: APPLICATION_TYPE_JSON },
    );
  }

  async import(data: ImportData, params: Params): Promise<void> {
    const { items, domain } = data;
    return await this.translateService.update<ImportData>(
      'import',
      {
        domain,
        items,
      },
      { headers: APPLICATION_TYPE_JSON },
    );
  }
}

feathersContext.add('sys.translate.service', TranslateService);

export default TranslateService;
