import { set, get } from 'lodash';

export const components: { [code: string]: any } = {};

export function getComponent(id: any, name: any, context: any): { component: any, [name: string]: any } {
  return get(components, [id, context, name]);
}

export function addComponent(id: any, name: any, context: any, options: any, component: any) {
  set(components, [id, context, name], { component, ...options });
}
