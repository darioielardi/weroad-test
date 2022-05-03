import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { UsersSeeder } from './UsersSeeder';

export class TestSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    await this.call(em, [UsersSeeder]);
  }
}
