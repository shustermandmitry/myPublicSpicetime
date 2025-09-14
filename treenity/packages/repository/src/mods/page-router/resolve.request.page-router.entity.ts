import { metaType } from '@treenity/core';
import { entity } from '@treenity/entity';

export const ResolveRequestPageRouterMetaType = metaType<ResolveRequestPageRouterEntity>(
  'sys.page-router.resolver.request',
);

@entity(ResolveRequestPageRouterMetaType)
export class ResolveRequestPageRouterEntity {
  url!: string;
}
