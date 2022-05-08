import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { ToursSeeder } from './ToursSeeder';
import { UsersSeeder } from './UsersSeeder';

export class MainSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    await this.call(em, [UsersSeeder, ToursSeeder]);
  }
}
