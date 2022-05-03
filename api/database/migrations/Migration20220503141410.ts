import { Migration } from '@mikro-orm/migrations';

export class Migration20220503141410 extends Migration {
  async up(): Promise<void> {
    // we are using pgcrypto instead of uuid-ossp as it's recommended by the pg docs:
    // https://www.postgresql.org/docs/12/uuid-ossp.html
    this.addSql('create extension if not exists "pgcrypto";');

    this.addSql(
      'create table "role" ("id" uuid not null default gen_random_uuid(), "name" varchar(255) not null);',
    );
    this.addSql(
      'alter table "role" add constraint "role_pkey" primary key ("id");',
    );

    this.addSql(
      'create table "user" ("id" uuid not null default gen_random_uuid(), "email" varchar(255) not null, "password" varchar(255) not null);',
    );
    this.addSql(
      'alter table "user" add constraint "user_email_unique" unique ("email");',
    );
    this.addSql(
      'alter table "user" add constraint "user_pkey" primary key ("id");',
    );

    this.addSql(
      'create table "user_roles" ("user_id" uuid not null, "role_id" uuid not null);',
    );
    this.addSql(
      'alter table "user_roles" add constraint "user_roles_pkey" primary key ("user_id", "role_id");',
    );

    this.addSql(
      'alter table "user_roles" add constraint "user_roles_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table "user_roles" add constraint "user_roles_role_id_foreign" foreign key ("role_id") references "role" ("id") on update cascade on delete cascade;',
    );
  }
}
