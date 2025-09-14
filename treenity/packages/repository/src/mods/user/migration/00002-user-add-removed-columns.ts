import { BasePsqlMigration, DataTypes } from '@treenity/feathers-psql';

export class UserAddRemovedColumn extends BasePsqlMigration {
  public name: string = '00002-user-add-removed-columns.ts';

  async up() {
    return this.queryInterface.addColumn(this.table, 'removed', {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  }

  async down() {
    return this.queryInterface.removeColumn(this.table, 'removed');
  }
}
