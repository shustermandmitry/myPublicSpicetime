import { Params, TreenityService } from '@treenity/feathers-service';
import { LangEntity, ProjectEntity, TranslateEntity } from './entity';

export type DomainRequest = { domain: string };
export type CodeRequest = { code: string };
export type KeyRequest = { key: string };
export type IdRequest = { id: number };

export type ExportRequest = { ids: number[] } & DomainRequest;
export type InputValueRequest = KeyRequest & CodeRequest & DomainRequest;
export type ListByDomainCodeRequest = CodeRequest & DomainRequest;
export type FindRequest = { query: string; opts?: object } & DomainRequest;
export type ListByKeysRequest = { keys: string[] } & DomainRequest & CodeRequest;
export type ListByKeysResponse = { [key: string]: string };

export type VerifyRequest = CodeRequest & DomainRequest;
export type RemoveRequest = IdRequest & DomainRequest;

export type ImportData = {
  items: {
    [key: string]: {
      [key: string]: string;
    };
  };
} & DomainRequest;

export type TranslateProjectService = Pick<
  TreenityService<ProjectEntity>,
  'create' | 'update' | 'get'
>;

export type TranslateLangService = TreenityService<LangEntity> & {
  verify(data: VerifyRequest, params: Params): Promise<string>;
};

export type TranslateTranslatesService = TreenityService<TranslateEntity> & {
  count(data: FindRequest, params: Params): Promise<number>;
  copy(data: IdRequest & DomainRequest, params: Params): Promise<TranslateEntity>;
  listByDomainCode(data: ListByDomainCodeRequest, params: Params): Promise<ListByKeysResponse>;
  listByKeys(data: ListByKeysRequest, params: Params): Promise<{ list: ListByKeysResponse }>;
  getByKey(data: KeyRequest & DomainRequest, params: Params): Promise<TranslateEntity>;
  getByKeyWithDefaultLang(
    data: KeyRequest & DomainRequest,
    params: Params,
  ): Promise<TranslateEntity>;
  inputValue(data: InputValueRequest, params: Params): Promise<ListByKeysResponse>;
  exportAll(data: DomainRequest, params: Params): Promise<ImportData>;
  export(data: ExportRequest, params: Params): Promise<ImportData>;
  import(data: ImportData, params: Params): Promise<void>;
};

export const EMPTY = '';
