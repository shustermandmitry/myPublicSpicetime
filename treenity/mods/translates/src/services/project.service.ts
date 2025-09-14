import {
  Application,
  awaitService,
  feathersContext,
  Params,
  TreenityService,
} from '@treenity/feathers-service';
import { Patch } from '@treenity/tree-api';
import { ProjectEntity, ProjectType } from '../entity';
import { rest } from '@treenity/repository/mods.types';
import { DomainRequest } from '../types';
import { APPLICATION_TYPE_JSON } from '../consts';

class ProjectService extends TreenityService<
  ProjectEntity,
  Partial<ProjectEntity>,
  Params,
  Patch[]
> {
  projectService: rest.RestClientService = null!;

  async _setup(app: Application, path: string) {
    this.projectService = await awaitService(app, '/sys/translates-rest/project');
  }

  private convertProjectToEntity(project: ProjectEntity) {
    const projectAny = project as any;
    projectAny.$id = `${ProjectType.$type}_${project.id}`;
    projectAny.$type = ProjectType.$type;
    return projectAny;
  }

  // @ts-ignore
  async create(data: ProjectEntity, params: Params): Promise<rest.GoServiceItem<ProjectEntity>> {
    const res = await this.projectService.update<ProjectEntity, rest.GoServiceItem<ProjectEntity>>(
      'create',
      data,
      { headers: APPLICATION_TYPE_JSON },
    );
    res.item = this.convertProjectToEntity(res.item);
    return res;
  }

  // @ts-ignore
  async update(
    id: number,
    data: ProjectEntity,
    params: Params,
  ): Promise<rest.GoServiceItem<ProjectEntity>> {
    data.id = id;
    const res = await this.projectService.update<ProjectEntity, rest.GoServiceItem<ProjectEntity>>(
      'update',
      data,
      { headers: APPLICATION_TYPE_JSON },
    );
    res.item = this.convertProjectToEntity(res.item);
    return res;
  }

  // @ts-ignore
  async find(params: Params): Promise<ProjectEntity> {
    const { domain } = params.query || {};
    return this.get(domain, params);
  }

  async get(domain: string, params: Params): Promise<ProjectEntity> {
    const res = await this.projectService.update<DomainRequest>('get', { domain }, params);
    res.item = this.convertProjectToEntity(res.item);
    return res;
  }
}

feathersContext.add('sys.translate.project.service', ProjectService);

export default ProjectService;
