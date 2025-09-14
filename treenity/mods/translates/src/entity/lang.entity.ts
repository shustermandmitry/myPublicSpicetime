import { metaType } from '@treenity/core';
import { entity } from '@treenity/entity';

export const LangType = metaType<LangEntity>('sys.translates.lang');

@entity(LangType)
export class LangEntity {
  id?: number;
  createdAt!: string;
  updatedAt!: string;
  deletedAt?: string;
  projectId!: number;
  code!: string;
  isTranslated: boolean = false;
  sort?: number;
  isoCode?: string;
  title?: string;
}
