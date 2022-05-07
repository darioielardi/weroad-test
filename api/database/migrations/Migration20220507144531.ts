import { Migration } from '@mikro-orm/migrations';

export class Migration20220507144531 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "travel" add column "nature_mood" int not null default 0, add column "relax_mood" int not null default 0, add column "history_mood" int not null default 0, add column "culture_mood" int not null default 0, add column "party_mood" int not null default 0;',
    );
    this.addSql(
      'alter table "travel" add constraint travel_nature_mood_check check(nature_mood >= 0 AND nature_mood <= 100);',
    );
    this.addSql(
      'alter table "travel" add constraint travel_relax_mood_check check(relax_mood >= 0 AND relax_mood <= 100);',
    );
    this.addSql(
      'alter table "travel" add constraint travel_history_mood_check check(history_mood >= 0 AND history_mood <= 100);',
    );
    this.addSql(
      'alter table "travel" add constraint travel_culture_mood_check check(culture_mood >= 0 AND culture_mood <= 100);',
    );
    this.addSql(
      'alter table "travel" add constraint travel_party_mood_check check(party_mood >= 0 AND party_mood <= 100);',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "travel" drop constraint travel_nature_mood_check;',
    );
    this.addSql(
      'alter table "travel" drop constraint travel_relax_mood_check;',
    );
    this.addSql(
      'alter table "travel" drop constraint travel_history_mood_check;',
    );
    this.addSql(
      'alter table "travel" drop constraint travel_culture_mood_check;',
    );
    this.addSql(
      'alter table "travel" drop constraint travel_party_mood_check;',
    );
    this.addSql('alter table "travel" drop column "nature_mood";');
    this.addSql('alter table "travel" drop column "relax_mood";');
    this.addSql('alter table "travel" drop column "history_mood";');
    this.addSql('alter table "travel" drop column "culture_mood";');
    this.addSql('alter table "travel" drop column "party_mood";');
  }
}
