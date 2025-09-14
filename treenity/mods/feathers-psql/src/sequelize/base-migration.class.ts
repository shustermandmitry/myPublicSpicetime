import { ModelAttributes, QueryInterface } from 'sequelize';
import { MigrationConstructorParams, MigrationInterface } from '../migration-context';

export abstract class BasePsqlMigration implements MigrationInterface {
  protected queryInterface: QueryInterface = null!;
  protected table: string = null!;
  protected name: string = null!;

  constructor({ queryInterface, table }: MigrationConstructorParams) {
    this.queryInterface = queryInterface;
    this.table = table;
  }

  async up(): Promise<void> {
    throw new Error('Method up not implemented.');
  }

  async down(): Promise<void> {
    throw new Error('Method down not implemented.');
  }

  getName(): string {
    return this.name;
  }
}
