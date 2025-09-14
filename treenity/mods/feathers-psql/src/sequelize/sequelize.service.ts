import { Application, awaitService, Params } from '@treenity/feathers-service';
import Sequelizer from '@treenity/sequelizer';
import { SequelizeAdapterOptions, SequelizeService } from 'feathers-sequelize';
import { JSONSchema7 } from 'json-schema';
import { defaultColumns, defaultOptions } from './sequelize.options';
import MigrationSequelize from './sequelize.migration';
import { SequelizePsqlService } from './sequelize.psql.service';
import { ModelAttributes } from 'sequelize';

export { defaultOptions } from './sequelize.options';
interface AdapterOptions extends SequelizeAdapterOptions {
  schema: JSONSchema7;
  uniqueFields?: string[];
  indexes?: object[];
}

export class TableSequelizeService<
  Result = any,
  Data = Partial<Result>,
  ServiceParams = Params,
  PatchData = Partial<Data>,
> extends SequelizeService<Result, Data, ServiceParams & Params, PatchData> {
  private uniqueFields: string[] = [];
  private indexes: object[] = [];

  constructor(options: AdapterOptions) {
    super(options);
    this.uniqueFields = options.uniqueFields || this.uniqueFields;
    this.indexes = options.indexes || this.indexes;
  }

  async init(app: Application, schema: JSONSchema7) {
    const sequelizeService = await awaitService<SequelizePsqlService>(app, '/sys/sequelize');
    const sequelize = await sequelizeService.get(null!, null!);
    const definition = Sequelizer.fromJsonSchema(schema, null, {
      uniqueFields: this.uniqueFields,
      notNullFields: (schema as JSONSchema7).required,
      customFieldDefinitions: {
        ...defaultColumns,
      },
    }) as ModelAttributes<any, any>;

    const tableName = schema.$id;
    if (!tableName) {
      throw new Error('Table name is required');
    }

    const migration = new MigrationSequelize(sequelize.getQueryInterface(), tableName);
    await migration.makeMigrate();
    this.Model.init(definition, {
      ...defaultOptions,
      tableName: tableName,
      sequelize,
      indexes: this.indexes as any,
    });
  }
}
