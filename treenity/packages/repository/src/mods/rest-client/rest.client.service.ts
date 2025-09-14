import { Application } from '@/declarations';
import { RestClientSchema } from '@/mods/rest-client/rest.client.meta';
import { FeathersService } from '@/utils/feathers-setup-service';
import { Conflict, FeathersError } from '@feathersjs/errors';
import { Params } from '@feathersjs/feathers';
import type { ServiceConstructorParams } from '@treenity/feathers-service';
import { feathersContext } from '@treenity/feathers-service';
import FormData from 'form-data';

const defaultHeaders = {};
const regexp = new RegExp(`\{[^\}]*\}`, 'gm');

type MethodParams = { path: string; method: string; headers?: Record<string, string> };
type BodyType = FormData | string | undefined;

interface ParamsWithFile extends Params {
  file?: Express.Multer.File;
  isFile?: boolean;
}

class RestClientService extends FeathersService<any> {
  baseUrl: string = null!;
  path: string = null!;
  methods: Record<string, MethodParams> = null!;

  constructor({ meta }: ServiceConstructorParams<RestClientSchema>) {
    super();
    const { host, port, protocol } = meta.connection;
    this.baseUrl = `${protocol}://${host}:${port}`;
    this.methods = meta.methods as Record<string, MethodParams>;
  }

  async _setup(app: Application, path: string) {
    this.path = path;
  }

  private getUrl<Data>(path: string, data?: Data) {
    if (!path.length) {
      throw new Conflict(`Rest client with path ${this.path} has missing method or url`);
    }

    let fullUrl = this.baseUrl + path.replace('//', '/');
    const replaceKeys = fullUrl.match(regexp);
    if (replaceKeys?.length) {
      replaceKeys.forEach(replaceKey => {
        const key = replaceKey.slice(1, -1);
        const value = (data as any)?.[key];
        delete (data as any)?.[key];
        fullUrl = fullUrl.replace(replaceKey, value);
      });
    }

    return fullUrl.trim();
  }

  private async request<Data, Response = any>(
    data: Data,
    method: string,
    params?: ParamsWithFile,
  ): Promise<Response> {
    const methodOptions: MethodParams | undefined = this.methods[method];
    if (!methodOptions) {
      throw new Conflict(`Rest client with path ${this.path} has missing method or url`);
    }

    const url = this.getUrl<Data>(methodOptions.path, data);
    let { headers = {}, isFile = false } = params || {};
    const _isFile = isFile && params?.file;
    let body: any = methodOptions.method !== 'GET' ? JSON.stringify(data || {}) : undefined;

    if (_isFile) {
      const formData = new FormData();
      formData.append('file', params.file!.buffer, params.file!.originalname);
      headers = formData.getHeaders();
      body = formData.getBuffer();
    } else {
      delete headers['content-length'];
    }

    const requestOptions: RequestInit = {
      method: methodOptions.method,
      headers: {
        ...methodOptions.headers,
        ...defaultHeaders,
        ...headers,
      },
      body,
    };
    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      const serviceError = await response.json().catch(() => undefined);
      throw new FeathersError(
        serviceError?.message || response.statusText,
        'Rest client',
        response.status,
        'error',
        undefined,
      );
    }

    const contentLength = Number(response.headers.get('content-length'));
    const responseContentType = response.headers.get('content-type');

    if (contentLength && responseContentType?.includes('application/json')) {
      return response.json();
    }

    const contentType = response.headers.get('content-type');
    const isContentType = !!contentType;
    const isJson = contentType === 'application/json';

    // if (!isContentType) {
    //   return {} as Response;
    // }

    if (isFile) {
      return {
        stream: response.body,
        mimeType: contentType,
        isFile,
      } as Response;
    }

    if (isJson) {
      return response.json();
    } else {
      return response.text() as Response;
    }
  }

  async update<Data = {}, Response = any>(
    method: string,
    data: Data,
    params?: Params,
  ): Promise<Response> {
    return this.request<Data, Response>(data, method, params as ParamsWithFile);
  }

  async find() {
    return this.methods as any;
  }
}

feathersContext.add('sys.rest', RestClientService);

export default RestClientService;
