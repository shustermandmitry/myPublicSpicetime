import { Params, ServiceMethods } from '@feathersjs/feathers';
import { awaitService, FeathersService } from '@/utils';
import { Application } from '@/declarations';
import { feathersContext } from '@treenity/feathers-service';

class FileService extends FeathersService<any> {
  private fileService: ServiceMethods = null!;

  public getCustomMethods(): string[] {
    return ['create', 'get', 'find', 'upload', 'listByKeys', 'getInfoByKey'];
  }

  async _setup(app: Application, path: string) {
    this.fileService = await awaitService(app, 'sys/file-rest');
  }

  async create(data: any, params: Params): Promise<number> {
    return this.fileService.update(
      'image-upload',
      {},
      {
        ...params,
        // @ts-ignore
        isFile: true,
      },
    );
  }

  async upload(data: any, params: Params): Promise<number> {
    return this.fileService.update(
      'upload',
      {},
      {
        ...params,
        // @ts-ignore
        isFile: true,
      },
    );
  }

  async get(key: string, params: Params): Promise<any> {
    // @ts-ignore
    const { width, height } = params.query;
    return this.fileService.update(
      'getImage',
      { width, height, key },
      {
        ...params,
        // @ts-ignore
        isFile: true,
      },
    );
  }

  async getInfoByKey(data: { key: string }, params: Params): Promise<any> {
    const { key } = data;
    return this.fileService.update('getInfoByKey', { key });
  }

  async find(params: Params): Promise<any> {
    const { key, query } = params.query!;
    if (typeof key !== 'undefined') {
      return this.get(key, params);
    }

    return this.fileService.update('search', { query }, params);
  }

  async listByKeys(data: { keys: string[] }, params: Params): Promise<any> {
    const { keys } = data;
    return this.fileService.update('listByKeys', { keys }, params);
  }

  async teardown(app: Application, path: string) {
    console.log('teardown');
  }
}

feathersContext.add('sys.file', FileService);

export default FileService;
