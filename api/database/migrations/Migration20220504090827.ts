import { Migration } from '@mikro-orm/migrations';

export class Migration20220504090827 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "travel" add column "created_at" timestamptz(0) not null default CURRENT_TIMESTAMP, add column "updated_at" timestamptz(0) not null default CURRENT_TIMESTAMP;',
    );
    this.addSql(
      'alter table "travel" alter column "description" type TEXT using ("description"::TEXT);',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "travel" alter column "description" type varchar(255) using ("description"::varchar(255));',
    );
    this.addSql('alter table "travel" drop column "created_at";');
    this.addSql('alter table "travel" drop column "updated_at";');
  }
}
