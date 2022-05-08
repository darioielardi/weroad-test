import { Migration } from '@mikro-orm/migrations';

export class Migration20220508224710 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "tour" drop constraint "tour_travel_id_foreign";');

    this.addSql('alter table "tour" alter column "travel_id" drop default;');
    this.addSql(
      'alter table "tour" alter column "travel_id" type uuid using ("travel_id"::text::uuid);',
    );
    this.addSql('alter table "tour" alter column "travel_id" set not null;');
    this.addSql(
      'alter table "tour" add constraint "tour_travel_id_foreign" foreign key ("travel_id") references "travel" ("id") on update cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table "tour" drop constraint "tour_travel_id_foreign";');

    this.addSql('alter table "tour" alter column "travel_id" drop default;');
    this.addSql(
      'alter table "tour" alter column "travel_id" type uuid using ("travel_id"::text::uuid);',
    );
    this.addSql('alter table "tour" alter column "travel_id" drop not null;');
    this.addSql(
      'alter table "tour" add constraint "tour_travel_id_foreign" foreign key ("travel_id") references "travel" ("id") on delete cascade;',
    );
  }
}
