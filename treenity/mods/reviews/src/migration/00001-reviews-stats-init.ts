import {
  BasePsqlMigration,
  DataTypes,
  defaultOptions,
  defaultColumns,
} from '@treenity/feathers-psql';

export class ReviewsStatsInit extends BasePsqlMigration {
  public name: string = '00001-reviews-stats-init.ts';

  async up() {
    return this.queryInterface.tableExists(this.table).then(exist => {
      if (exist) return;
      return this.queryInterface.createTable(
        this.table,
        {
          ...defaultColumns,
          user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
          count: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
          },
          sum_rating: {
            type: DataTypes.FLOAT,
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
