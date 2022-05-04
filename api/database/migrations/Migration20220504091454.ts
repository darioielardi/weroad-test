import { Migration } from '@mikro-orm/migrations';

export class Migration20220504091454 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "travel" alter column "created_at" type timestamptz(0) using ("created_at"::timestamptz(0));',
    );
    this.addSql(
      'alter table "travel" alter column "created_at" set default CURRENT_TIMESTAMP;',
    );
    this.addSql(
      'alter table "travel" alter column "updated_at" type timestamptz(0) using ("updated_at"::timestamptz(0));',
    );
    this.addSql(
      'alter table "travel" alter column "updated_at" set default CURRENT_TIMESTAMP;',
    );

    this.addSql(
      'alter table "role" add column "created_at" timestamptz(0) not null default CURRENT_TIMESTAMP, add column "updated_at" timestamptz(0) not null default CURRENT_TIMESTAMP;',
    );

    this.addSql(
      'alter table "user" add column "created_at" timestamptz(0) not null default CURRENT_TIMESTAMP, add column "updated_at" timestamptz(0) not null default CURRENT_TIMESTAMP;',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "travel" alter column "created_at" type timestamptz(0) using ("created_at"::timestamptz(0));',
    );
    this.addSql(
      'alter table "travel" alter column "created_at" set default \'CURRENT_TIMESTAMP\';',
    );
    this.addSql(
      'alter table "travel" alter column "updated_at" type timestamptz(0) using ("updated_at"::timestamptz(0));',
    );
    this.addSql(
      'alter table "travel" alter column "updated_at" set default \'CURRENT_TIMESTAMP\';',
    );

    this.addSql('alter table "role" drop column "created_at";');
    this.addSql('alter table "role" drop column "updated_at";');

    this.addSql('alter table "user" drop column "created_at";');
    this.addSql('alter table "user" drop column "updated_at";');
  }
}
