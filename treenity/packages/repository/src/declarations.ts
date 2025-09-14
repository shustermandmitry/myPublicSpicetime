// For more information about this file see https://dove.feathersjs.com/guides/cli/typescript.html
import type {
  HookContext as FeathersHookContext,
  NextFunction,
  Application as FeathersApplication,
} from '@feathersjs/feathers';
import { ApplicationConfiguration } from './configuration';

export { NextFunction };

// The types for app.get(name) and app.set(name)
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Configuration extends ApplicationConfiguration {}

// A mapping of service names to types. Will be extended in service files.
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ServiceTypes {
  [key: string]: any;
}

// The application instance type that will be used everywhere else
export type Application<T = ServiceTypes> = FeathersApplication<T, Configuration>;

// The context for hook functions - can be typed with a service class
export type HookContext<S = any> = FeathersHookContext<Application, S>;
