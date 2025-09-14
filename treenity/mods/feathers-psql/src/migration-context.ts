import { Context, ContextImpl, Meta, Node } from '@treenity/core';
import { ModelAttributes, QueryInterface } from 'sequelize';

export interface MigrationContextOptions {}

type CreatableCallable<A extends any[], R = any> = {
  new (...args: A): R;
  (...args: A): R;
};

export interface MigrationConstructorParams<M extends Meta = Meta> {
  queryInterface: QueryInterface;
  table: string;
}

export interface MigrationInterface {
  up(): Promise<any>;
  down(): Promise<any>;
  getName(): string;
}

type MigrationCreator = CreatableCallable<[MigrationConstructorParams], MigrationInterface>;
type MigrationCreators = MigrationCreator[];

export interface MigrationTypeContext extends Context<MigrationCreators, MigrationContextOptions> {}

class MigrationTypeContextImpl
  extends ContextImpl<MigrationCreators, MigrationContextOptions>
  implements MigrationTypeContext {}

export const migrationContext = new MigrationTypeContextImpl('feathers-psql-migration');
