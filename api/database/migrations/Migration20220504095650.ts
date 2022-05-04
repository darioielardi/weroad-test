import { Migration } from '@mikro-orm/migrations';

export class Migration20220504095650 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "tour" ("id" uuid not null default gen_random_uuid(), "created_at" timestamptz(0) not null default CURRENT_TIMESTAMP, "updated_at" timestamptz(0) not null default CURRENT_TIMESTAMP, "name" varchar(255) not null, "starting_date" date not null, "ending_date" date not null, "price" int not null, "travel_id" uuid not null, constraint tour_price_check check (price >= 0 AND price % 100 = 0), constraint tour_dates_check check (starting_date < ending_date));',
    );
    this.addSql(
      'alter table "tour" add constraint "tour_name_unique" unique ("name");',
    );
    this.addSql(
      'alter table "tour" add constraint "tour_pkey" primary key ("id");',
    );

    this.addSql(
      'alter table "tour" add constraint "tour_travel_id_foreign" foreign key ("travel_id") references "travel" ("id") on update cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "tour" cascade;');
  }
}
