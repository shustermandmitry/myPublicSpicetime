import { Context, ContextImpl } from '../context';

export interface ProtoTypeContextOptions {}

export interface Protocol {
  fetch(url: string): Promise<any>;
}

export interface ProtoTypeContext extends Context<Protocol, ProtoTypeContextOptions> {}

export class ProtoTypeContextImpl
  extends ContextImpl<Protocol, ProtoTypeContextOptions>
  implements ProtoTypeContext {}
