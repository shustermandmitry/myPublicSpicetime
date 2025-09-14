import {
  Application,
  awaitService,
  Id,
  NotFound,
  Params,
  ServiceConstructorParams,
  TreenityService,
} from '@treenity/feathers-service';
import { JSONSchema7 } from 'json-schema';
import { Model, Op } from 'sequelize';
import { TableSequelizeService } from './sequelize.service';
import { TablePsqlMeta } from './table.psql.meta';

const modelsMap = new Map();

function getClass(name: string): Model {
  return new Function('Model', `return class ${name} extends Model {}`)(Model);
}

type Operators = { [key: string]: string };

export class PsqlTableService<
  Result = any,
  Data = Partial<Result>,
  ServiceParams = Params,
  PatchData = Partial<Data>,
> extends TreenityService<Result, Data, ServiceParams, PatchData> {
  dataProvider: TableSequelizeService<Result, Data, ServiceParams, PatchData> = null!;
  schema: JSONSchema7 = null!;
  uniqueFields?: string[] = [];
  indexes?: object[] = [];
  filters: any = {};
  operators: Operators = {};
  class: any;

  constructor({ meta }: ServiceConstructorParams<TablePsqlMeta>) {
    super();
    this.schema = meta.schema;
    this.filters = meta.filters;
    this.uniqueFields = meta.uniqueFields;
    this.indexes = meta.indexes;
    if (meta.operators) {
      this.operators = meta.operators.reduce((acc: Operators, cur: string) => {
        acc[cur] = cur;
        return acc;
      }, {} as Operators);
    }
    this.class = getClass(this.schema.$id as string);
  }

  async _setup(app: Application) {
    this.dataProvider = new TableSequelizeService<Result, Data, ServiceParams, PatchData>({
      Model: this.class,
      schema: this.schema,
      uniqueFields: this.uniqueFields,
      indexes: this.indexes,
      filters: this.filters,
      operatorMap: {
        ...this.operators,
        $col: Op.col,
      },
    });

    this.class = this.dataProvider.Model;

    await this.dataProvider.init(app, this.schema);
    const currentModel = this.dataProvider.Model;
    const properties = this.schema.properties;
    if (properties) {
      for (const [fieldName, fieldProperties] of Object.entries(properties)) {
        //TODO Add link on server instead include model name
        // @ts-ignore
        if (fieldProperties.include) {
          // @ts-ignore
          const service = await awaitService<PsqlTableService>(app, fieldProperties.include);
          const includeModel = service.class.name;
          // @ts-ignore
          const key = `${this.schema.$id}.${includeModel}`;
          modelsMap.set(key, { fieldName, fieldProperties, currentModel });
        }
      }
    }
  }

  private checkAssociation() {
    const values = modelsMap.entries();
    for (const [key, value] of values) {
      const [currentModelName, includeModelName] = key.split('.');
      const currentModel = value.currentModel.sequelize.models[currentModelName];
      const includeModel = value.currentModel.sequelize.models[includeModelName];
      if (!includeModel) {
        console.warn('association failed');
        continue;
      }

      includeModel.hasMany(currentModel, {
        // @ts-ignore
        as: value.fieldProperties.as,
        // @ts-ignore
        foreignKey: value.fieldName,
      });
      currentModel.belongsTo(includeModel, {
        // @ts-ignore
        as: value.fieldProperties.as,
        // @ts-ignore
        foreignKey: value.fieldName,
      });
      modelsMap.delete(key);
    }
  }

  async find(params: ServiceParams): Promise<Result[]> {
    this.checkAssociation();
    // @ts-ignore
    return this.dataProvider.find(params);
  }

  async get(id: Id, params: ServiceParams & Params) {
    this.checkAssociation();

    return this.dataProvider.get(id, params);
  }

  async create(data: Data, params: ServiceParams & Params): Promise<Result> {
    return this.dataProvider.create(data, params);
  }

  async update(id: Id, data: Data, params: ServiceParams & Params) {
    const item = await this.get(id, params);
    if (!item) {
      throw new NotFound(`Item ${id} not found`);
    }

    Object.assign(item, data);
    return this.dataProvider.update(id, item as Data, params);
  }

  async patch(id: Id, data: PatchData, params: ServiceParams & Params) {
    const item = await this.get(id, params);
    if (!item) {
      throw new NotFound(`Item ${id} not found`);
    }

    Object.assign(item, data);
    return this.dataProvider.patch(id, item as PatchData, params);
  }

  async remove(id: Id, params?: ServiceParams & Params) {
    return this.dataProvider.remove(id, params);
  }
}
