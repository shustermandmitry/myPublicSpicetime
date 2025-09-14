import { metaType } from '@treenity/core';
import { entity } from '@treenity/entity';

export const TranslateType = metaType<TranslateEntity>('sys.translates.translate');

@entity(TranslateType)
export class TranslateEntity {
  id!: number;
  createdAt!: string;
  updatedAt!: string;
  deletedAt?: string;
  key!: string;
  projectId!: number;
  revision!: number;
  disableTranslate: boolean = false;
  values?: object;
}
