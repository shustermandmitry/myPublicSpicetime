import { Application } from '@/declarations';
import {
  createContext,
  defaultServiceMethods,
  getServiceOptions,
  NullableId,
  ServiceInterface,
} from '@/feathers';
import { RestServerSchema } from '@/mods/rest-server/rest.server.meta';
import type { ServiceConstructorParams } from '@treenity/feathers-service';
import { feathersContext } from '@treenity/feathers-service';
import { FeathersService } from '@/utils/feathers-setup-service';
import { MethodNotAllowed } from '@feathersjs/errors';
import { http } from '@feathersjs/transport-commons';
import { Express, NextFunction, Request, Response } from 'express';
import multer from 'multer';
import { pipeline } from 'node:stream';
import { awaitService } from '../../utils/index';

const multipartMiddleware = multer();

function movedFileMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.file) {
    (req as any).feathers.file = req.file;
  }
  next();
}

type GetServiceResult = { service: ServiceInterface; id: NullableId };

class RestServerService extends FeathersService<any> {
  prefix: string = '';

  constructor({ meta, app }: ServiceConstructorParams<RestServerSchema>) {
    super();
    const { prefix = '' } = meta;
    console.log('rest server constructor prefix', prefix);
    this.prefix = prefix;
  }

  private getServicePathWithId(requestUrl: string, lastIndex: number = 0): string {
    const removeSymbols = `/api${this.prefix}`.length;
    if (lastIndex > 0) {
      requestUrl = requestUrl.substring(0, lastIndex);
    }
    const urlPath = requestUrl.substring(removeSymbols, requestUrl.length);
    return '/' + this.path + urlPath;
  }

  private getMethod(req: Request, res: Response, service: ServiceInterface): string {
    const { headers, method: httpMethod, path, url } = req;
    const methodOverride = headers[http.METHOD_HEADER] as string | undefined;

    const method = http.getServiceMethod(httpMethod, null, methodOverride);
    const { methods } = getServiceOptions(service);

    if (
      !methods!.includes(method) ||
      (methodOverride && defaultServiceMethods.includes(methodOverride))
    ) {
      const error = new MethodNotAllowed(
        `Method \`${method}\` is not supported by this endpoint. Path: ${path}. URL: ${url}`,
      );
      res.statusCode = error.code;
      throw error;
    }

    return method;
  }

  private getArgs(req: Request, res: Response, method: string) {
    const { query, headers, body } = req;
    const createArguments = http.argumentsFor[method as 'get'] || http.argumentsFor.default;
    const params = {
      query,
      headers,
      route: {},
      req,
      res,
      // @ts-ignore
      rawBody: req.rawBody,
      ...((req as any).feathers || { provider: 'rest' }),
    };

    return createArguments({ id: null, data: body, params });
  }

  async _setup(app: Application, path: string) {
    const restApp: Express = app.get('restApp') as unknown as Express;
    console.log('rest server setup prefix', this.prefix);
    if (!this.prefix) {
      console.log('⚠️ prefix is not set', path || this.path);
    }

    restApp.use(
      `${this.prefix}/*`,
      multipartMiddleware.single('file'),
      movedFileMiddleware,
      async (req: Request, res: Response, next: NextFunction) => {
        let path = this.getServicePathWithId(req.baseUrl);
        const service = await awaitService(app, path);

        const method = this.getMethod(req, res, service as ServiceInterface);
        const contextBase = createContext(service, method, { http: {} });
        const args = this.getArgs(req, res, method);
        //Maybe remove this in test contextBase equal null

        (res as any).hook = contextBase;
        try {
          // @ts-ignore
          const context = await service[method](...args, contextBase);
          (res as any).hook = context;

          const response = http.getResponse(context);
          if (response.status === 201) {
            response.status = 200;
          }

          const isFile = response.body?.isFile;
          if (isFile) {
            pipeline(response.body.stream, res, error => console.log('Error stream', error));
            return;
          } else {
            res.set(response.headers);
          }
          res.statusCode = response.status;
          res.send(response.body);
          return;
        } catch (e) {
          next(e);
        }
      },
    );
  }

  async teardown(app: Application, path: string) {
    console.log(`Teardown rest server ${path}`);
  }
}

feathersContext.add('sys.rest.server', RestServerService);

export default RestServerService;
