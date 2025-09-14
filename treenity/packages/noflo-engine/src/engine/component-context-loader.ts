import { types } from '@treenity/core';
import type { ComponentLoader } from 'noflo';
import { createComponent, toNofloPorts } from './create-component';

class ContextTypeComponentLoader {
  async listComponents() {
    console.log('ListComponents');
  }

  async load(type: any, ...args: any) {
    console.log('Load noflo', type, ...args);
    const [proc, options] = await types.noflo.get(type);

    return createComponent({
      proc,
      ...toNofloPorts(options.ports),
    });
  }
}

/** recast to ComponentLoader due to not include BIG ComponentLoader to bundle, only use its type */
const componentLoader: ComponentLoader =
  new ContextTypeComponentLoader() as unknown as ComponentLoader;

export default componentLoader;
