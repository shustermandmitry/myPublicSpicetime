import { getComponent } from '../component-db';

const addressRegEx = /^[A-z0-9:\.\-_]+$/;


export type ComponentLoadHook = (  address: string,
  name: string,
  context: string,
) => [any, boolean];

/**
 * Collect accounts loading for some time, and then load all at once
 */
export const useGetComponent: ComponentLoadHook = (
  address: string,
  name: string,
  context: string,
): [any, boolean] => {
  if (!addressRegEx.test(address)) throw new Error('bad address');

  const config = getComponent(address, name, context);

  return [config, false];
};
