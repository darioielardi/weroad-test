import { Migration } from '@mikro-orm/migrations';

export class Migration20220503200943 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "travel" ("id" uuid not null default gen_random_uuid(), "is_public" boolean not null, "slug" varchar(255) not null, "name" varchar(255) not null, "description" varchar(255) not null, "number_of_days" int not null);',
    );
    this.addSql(
      'alter table "travel" add constraint "travel_slug_unique" unique ("slug");',
    );
    this.addSql(
      'alter table "travel" add constraint "travel_pkey" primary key ("id");',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "travel" cascade;');
  }
}
