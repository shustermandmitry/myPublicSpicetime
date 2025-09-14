import {
  BasePsqlMigration,
  defaultOptions,
  defaultColumns,
  DataTypes,
} from '@treenity/feathers-psql';

export class InitMigration extends BasePsqlMigration {
  public name: string = '00001-user-init.ts';

  async up() {
    return this.queryInterface.tableExists(this.table).then(exist => {
      if (exist) return;
      return this.queryInterface.createTable(
        this.table,
        {
          ...defaultColumns,
          email: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          password: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          role: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          verified: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
          },
          blocked: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
          },
          first_name: {
            type: DataTypes.STRING,
          },
          last_name: {
            type: DataTypes.STRING,
          },
          surname: {
            type: DataTypes.STRING,
          },
          lang: {
            type: DataTypes.STRING,
          },
          photo: {
            type: DataTypes.STRING,
          },
          tz: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
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
