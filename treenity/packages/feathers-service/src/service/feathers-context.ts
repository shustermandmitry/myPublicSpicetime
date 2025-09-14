// ------------ feathers service context ------------
import { Application, ServiceInterface } from '@feathersjs/feathers';
import { Context, ContextImpl, Node } from '@treenity/core';

export interface FeathersContextOptions {}

type CreatableCallable<A extends any[], R = any> = {
  new (...args: A): R;
  (...args: A): R;
};

export interface ServiceConstructorParams<M = any> {
  meta: M;
  node: Node;
  app?: Application;
}

type ServiceCreator = CreatableCallable<[ServiceConstructorParams], ServiceInterface>;

export interface FeathersTypeContext extends Context<ServiceCreator, FeathersContextOptions> {}

class FeathersTypeContextImpl
  extends ContextImpl<ServiceCreator, FeathersContextOptions>
  implements FeathersTypeContext {}

export const feathersContext = new FeathersTypeContextImpl('feathers');
