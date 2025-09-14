import { Context, ContextImpl } from '../context';
import { Node } from '../node';

export interface Service<M = any> {
  setup(params: { meta: M; node: Node }): Promise<void>;
}

export interface ServiceContextOptions {}

export interface ServiceTypeContext extends Context<Service, ServiceContextOptions> {}

export class ServiceTypeContextImpl
  extends ContextImpl<Service, ServiceContextOptions>
  implements ServiceTypeContext {}
