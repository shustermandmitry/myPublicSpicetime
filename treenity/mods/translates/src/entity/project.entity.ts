import { metaType } from '@treenity/core';
import { entity } from '@treenity/entity';

export const ProjectType = metaType<ProjectEntity>('sys.translates.project');

@entity(ProjectType)
export class ProjectEntity {
  id!: number;
  createdAt!: string;
  updatedAt!: string;
  deletedAt?: string;
  domain!: string;
  cache!: number;
  defaultLang!: string;
  displayDefaultLang?: string;
  method!: string;
  singleField?: boolean = true;
  apiKey?: string;
}
