import { Migration } from '@mikro-orm/migrations';

export class Migration20220504090240 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "travel" alter column "is_public" type boolean using ("is_public"::boolean);',
    );
    this.addSql(
      'alter table "travel" alter column "is_public" set default false;',
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table "travel" alter column "is_public" drop default;');
    this.addSql(
      'alter table "travel" alter column "is_public" type boolean using ("is_public"::boolean);',
    );
  }
}
