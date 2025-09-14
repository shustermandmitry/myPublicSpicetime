import { metaType } from '@treenity/core';
import { entity } from '@treenity/entity';

export const PageRouterMetaType = metaType<PageRouterEntity>('sys.page-router');

@entity(PageRouterMetaType)
export class PageRouterEntity {
  resolvedPath!: string;
  params!: Record<string, string>;
  notFound: boolean = false;
}
