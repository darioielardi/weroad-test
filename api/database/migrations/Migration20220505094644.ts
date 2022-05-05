import { Migration } from '@mikro-orm/migrations';

export class Migration20220505094644 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "user_roles" drop constraint "user_roles_role_id_foreign";',
    );

    this.addSql('drop table if exists "role" cascade;');

    this.addSql('drop table if exists "user_roles" cascade;');

    this.addSql(
      'alter table "travel" add constraint travel_number_of_days_check check(number_of_days >= 0);',
    );

    this.addSql('alter table "tour" drop constraint tour_price_check;');
    this.addSql(
      'alter table "tour" add constraint tour_price_check check(price >= 0 AND price % 100 = 0);',
    );

    this.addSql(
      'alter table "user" add column "role" text check ("role" in (\'editor\', \'admin\')) not null;',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'create table "role" ("id" uuid not null default gen_random_uuid(), "name" varchar not null default null, "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null default CURRENT_TIMESTAMP);',
    );
    this.addSql(
      'alter table "role" add constraint "role_pkey" primary key ("id");',
    );

    this.addSql(
      'create table "user_roles" ("user_id" uuid not null default null, "role_id" uuid not null default null);',
    );
    this.addSql(
      'alter table "user_roles" add constraint "user_roles_pkey" primary key ("user_id", "role_id");',
    );

    this.addSql(
      'alter table "user_roles" add constraint "user_roles_role_id_foreign" foreign key ("role_id") references "role" ("id") on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table "user_roles" add constraint "user_roles_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;',
    );

    this.addSql('alter table "tour" drop constraint tour_price_check;');
    this.addSql(
      'alter table "tour" add constraint tour_price_check check((price >= 0) AND ((price % 100) = 0));',
    );

    this.addSql(
      'alter table "travel" drop constraint travel_number_of_days_check;',
    );

    this.addSql('alter table "user" drop column "role";');
  }
}
