import { Application } from '@/declarations';
import { MetaType } from '@treenity/core';
import { awaitService } from '@treenity/feathers-service';

export default awaitService as <T = any>(
  app: Application,
  path: string,
  type?: MetaType<T>,
) => Promise<T>;
