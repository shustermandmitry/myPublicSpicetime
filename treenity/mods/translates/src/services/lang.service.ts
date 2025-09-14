import {
  Application,
  awaitService,
  feathersContext,
  Params,
  TreenityService,
} from '@treenity/feathers-service';
import { Patch } from '@treenity/tree-api';
import { LangEntity, LangType } from '../entity';
import { rest } from '@treenity/repository/mods.types';
import { DomainRequest, RemoveRequest, VerifyRequest } from '../types';
import { APPLICATION_TYPE_JSON } from '../consts';

class LangService extends TreenityService<
  LangEntity | boolean | string,
  Partial<LangEntity>,
  Params,
  Patch[]
> {
  langService: rest.RestClientService = null!;
  customMethods: string[] = ['verify'];

  async _setup(app: Application, path: string) {
    this.langService = await awaitService(app, '/sys/translates-rest/lang');
  }

  private convertLangToEntity(lang: LangEntity) {
    const langAny = lang as any;
    langAny.$id = `${LangType.$type}_${lang.id}`;
    langAny.$type = LangType.$type;
    return langAny as LangEntity;
  }

  async create(data: LangEntity, params: Params): Promise<LangEntity> {
    const { item } = await this.langService.update<LangEntity>('create', data, {
      headers: APPLICATION_TYPE_JSON,
    });
    return this.convertLangToEntity(item);
  }

  async update(id: number, data: LangEntity, params: Params): Promise<LangEntity> {
    const { item } = await this.langService.update<LangEntity, rest.GoServiceItem<LangEntity>>(
      'update',
      { id, ...data },
      { headers: APPLICATION_TYPE_JSON },
    );
    return this.convertLangToEntity(item);
  }

  // @ts-ignore
  async find(params: Params): Promise<rest.GoServiceList<LangEntity>> {
    const { domain } = params.query!;
    const res = await this.langService.update<DomainRequest, rest.GoServiceList<LangEntity>>(
      'list',
      {
        domain,
      },
      { headers: APPLICATION_TYPE_JSON },
    );

    return res;
  }

  // @ts-ignore
  async remove(_id: string, params: Params): Promise<rest.GoServiceItem<boolean>> {
    const { domain, id } = params.query!;
    const actualId = _id ?? id;
    return await this.langService.update<RemoveRequest, rest.GoServiceItem<boolean>>(
      'delete',
      { id: parseInt(actualId), domain },
      { headers: APPLICATION_TYPE_JSON },
    );
  }

  async verify(data: VerifyRequest, params: Params): Promise<rest.GoServiceItem<string>> {
    const res = await this.langService.update<VerifyRequest, rest.GoServiceItem<string>>(
      'verify',
      data,
      { headers: APPLICATION_TYPE_JSON },
    );

    return res;
  }
}

feathersContext.add('sys.translate.lang.service', LangService);

export default LangService;
