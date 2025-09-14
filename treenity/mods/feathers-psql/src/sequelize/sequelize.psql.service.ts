import { Node } from '@treenity/core';
import {
  Application,
  Id,
  Params,
  ServiceConstructorParams,
  TreenityService,
} from '@treenity/feathers-service';
import { Options, Sequelize } from 'sequelize';
import { SequelizeServiceMeta } from './sequelize.psql.meta';

export class SequelizePsqlService extends TreenityService<any> {
  meta: SequelizeServiceMeta;
  node: Node;
  instance: Sequelize = null!;

  constructor({ meta, node }: ServiceConstructorParams<SequelizeServiceMeta>) {
    super();
    this.meta = meta;
    this.node = node;
  }

  async _setup(app: Application, path: string) {
    this.getInstance();
  }

  private getInstance() {
    const { database, username, password, ...other } = this.meta.connection;
    return (this.instance ||= new Sequelize(database, username, password, other as Options));
  }

  async get(id: Id, params: Params) {
    return this.getInstance();
  }

  async teardown() {
    return this.instance.close();
  }
}

//
// types.schema.add('db.sequelize-model', sequelizeServiceSchema, {});
// feathers.add('sys.sequelize.psql', SequelizePsqlService);
