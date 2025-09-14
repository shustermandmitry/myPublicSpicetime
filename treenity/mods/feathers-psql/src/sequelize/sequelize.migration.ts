import { DataTypes, QueryInterface, QueryTypes } from 'sequelize';
import { migrationContext, MigrationInterface } from '../migration-context';

const { STRING } = DataTypes;

class MigrationSequelize {
  private migrationTableName = 'SequelizeMeta';
  protected queryInterface: QueryInterface = null!;
  private tableName: string = null!;

  constructor(queryInterface: QueryInterface, tableName: string) {
    this.queryInterface = queryInterface;
    this.tableName = tableName;
  }

  private async isProcessed(migrationName: string) {
    const exist = await this.queryInterface.tableExists(this.migrationTableName);
    if (!exist) {
      await this.queryInterface.createTable(this.migrationTableName, {
        name: {
          type: STRING,
          allowNull: false,
        },
      });
    }

    const competedMigrations = await this.queryInterface.sequelize.query(
      `SELECT * FROM "SequelizeMeta" WHERE "name" = :name`,
      {
        type: QueryTypes.SELECT,
        replacements: { name: migrationName },
      },
    );

    return competedMigrations.length > 0;
  }

  private async process(migrationName: string) {
    await this.queryInterface.sequelize.query(`INSERT INTO "SequelizeMeta" VALUES(:name)`, {
      type: QueryTypes.INSERT,
      replacements: { name: migrationName },
    });
  }

  private async run(migration: MigrationInterface) {
    const migrationName = migration.getName();
    console.info(`⌛️ Let's start the migration ${migrationName}`);
    try {
      await migration.up();
      await this.process(migration.getName());
      console.info(`⬆️ Migration ${migrationName} completed`);
    } catch (e: any) {
      await migration.down();
      console.error(`⬇️ Migration ${migrationName} canceled`);
      throw new Error(e.message);
    }
  }

  async makeMigrate() {
    const pathName = `${this.tableName}.migration`;
    const [migrationCreators] = await migrationContext.get(pathName);
    //TODO: Add queue??
    for (const migrationCreator of migrationCreators) {
      const migration = new migrationCreator({
        queryInterface: this.queryInterface,
        table: this.tableName,
      });

      const migrationName = migration.getName();
      const isProcessed = await this.isProcessed(migrationName);
      console.info(
        `🔎 Checking whether the migration has been performed previously ${migrationName}`,
      );
      if (isProcessed) {
        console.info(`➡️‍ Migration ${migrationName} has already been completed`);
        continue;
      }

      await this.run(migration);
    }
  }
}

export default MigrationSequelize;
