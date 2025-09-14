import { BasePsqlMigration } from '@treenity/feathers-psql';

const indexName = 'unique_email_removed';
export class UniqEmailMigration extends BasePsqlMigration {
  public name: string = '00003-user-add-uniq-email.ts';

  async up() {
    const indexes = await this.queryInterface.showIndex(this.table);
    // @ts-ignore
    if (indexes.some(indexItem => indexItem.name === indexName)) {
      await this.queryInterface.removeIndex(this.table, indexName);
    }
    return this.queryInterface.addIndex(this.table, ['email'], {
      unique: true,
      name: indexName,
      where: { deleted_at: null },
    });
  }

  async down() {
    return await this.queryInterface.removeIndex(this.table, indexName);
  }
}
