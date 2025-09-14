import { PageRouterEntity } from '@/mods/page-router/page-router.entity';
import { metaType } from '@treenity/core';

export type PageRouterService = {
  resolve({ url }: { url: string }): Promise<PageRouterEntity>;
};

export const PageRouterServiceMetaType = metaType<PageRouterService>('sys.page-router.service');
