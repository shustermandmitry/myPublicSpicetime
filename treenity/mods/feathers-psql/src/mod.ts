import { types } from '@treenity/core';
import '@treenity/json-schema';
import { sequelizeServiceSchema } from './sequelize/sequelize.psql.meta';

types.schema.add('db.sequelize-model', sequelizeServiceSchema, {});
