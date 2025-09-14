import { Params, ServiceMethods } from '@feathersjs/feathers';
import { awaitService, FeathersService } from '@/utils';
import { Application } from '@/declarations';
import type { ServiceConstructorParams } from '@treenity/feathers-service';
import { feathersContext } from '@treenity/feathers-service';
import { CounterMeta } from '@/mods/counter/counter.meta';

class CounterService extends FeathersService<any> {
  private service: ServiceMethods = null!;
  private servicePath: string = null!;

  constructor({ meta }: ServiceConstructorParams<CounterMeta>) {
    super();
    this.servicePath = meta.servicePath;
  }

  async _setup(app: Application, path: string) {
    this.service = await awaitService(app, this.servicePath);
  }

  async find(params: Params) {
    const res = await this.service.find({
      ...params,
      paginate: {
        default: 1,
        max: 0,
      },
    });

    return res.total;
  }

  async teardown(app: Application, path: string) {
    console.log('teardown');
  }
}

feathersContext.add('sys.counter', CounterService);

export default CounterService;
