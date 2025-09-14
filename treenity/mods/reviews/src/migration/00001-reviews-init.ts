import {
  BasePsqlMigration,
  DataTypes,
  defaultOptions,
  defaultColumns,
} from '@treenity/feathers-psql';

export class ReviewsInit extends BasePsqlMigration {
  public name: string = '00001-reviews-init.ts';

  async up() {
    return this.queryInterface.tableExists(this.table).then(exist => {
      if (exist) return;
      return this.queryInterface.createTable(
        this.table,
        {
          ...defaultColumns,
          item_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
          user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
          author_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
          content: {
            type: DataTypes.STRING,
          },
          rating: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0,
          },
          meta: {
            type: DataTypes.JSONB,
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
