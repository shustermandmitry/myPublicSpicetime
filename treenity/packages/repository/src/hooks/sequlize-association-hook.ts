import { Application, HookContext } from '@/declarations';
import Sequelize from 'sequelize';
import { Params } from '@feathersjs/feathers';
import { AuthParams } from '@treenity/feathers-service';

interface IAssociationResult {
  as: string;
  model: any;
  include?: IAssociationResult[];
}

interface IAssociationParams {
  as: string;
  path: string;
  include?: IAssociationParams[];
}

const joinFunc = (app: Application, includesArray: IAssociationParams[]): IAssociationResult[] => {
  return (includesArray || []).map(include => {
    const service = app.services[include.path];
    if (!service) {
      throw new Error(`Service ${include.path} not found`);
    }

    const model = service.dataProvider.Model;
    const res: IAssociationResult = {
      model,
      as: include.as,
    };

    if (include.include) {
      res.include = joinFunc(app, include.include);
    }

    return res;
  });
};

const includeAssociationsHook = (includeParams: IAssociationParams[]) => {
  return async (context: HookContext) => {
    const { app } = context;
    context.params.sequelize = {
      Sequelize,
      include: joinFunc(app, includeParams),
      raw: true,
      nest: true,
    };

    return context;
  };
};

export default includeAssociationsHook;

export const includeAssociations = (
  app: Application,
  includesArray: IAssociationParams[],
  params: AuthParams | Params = {},
) => {
  // @ts-ignore
  params.sequelize = {
    Sequelize,
    include: joinFunc(app, includesArray),
    raw: true,
    nest: true,
  };

  return params;
};
