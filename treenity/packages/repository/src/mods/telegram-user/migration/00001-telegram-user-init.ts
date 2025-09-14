import {
  BasePsqlMigration,
  defaultOptions,
  defaultColumns,
  DataTypes,
} from '@treenity/feathers-psql';

export class InitMigration extends BasePsqlMigration {
  public name: string = '00001-telegram-user-init.ts';

  async up() {
    return this.queryInterface.tableExists(this.table).then(exist => {
      if (exist) return;
      return this.queryInterface.createTable(
        this.table,
        {
          ...defaultColumns,
          chat_instance: {
            type: DataTypes.BIGINT,
            allowNull: false,
          },
          tuser: {
            type: DataTypes.BIGINT,
            allowNull: false,
          },
          user_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
          },
          user_name: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '',
          },
          is_premium: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
          },
        },
        {
          ...defaultOptions,
        },
      );
    });
  }

  async down() {
    return await this.queryInterface.dropTable(this.table);
  }
}
