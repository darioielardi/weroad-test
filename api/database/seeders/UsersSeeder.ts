import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import * as bcrypt from 'bcrypt';
import { Role, User } from '../../src/users/entities/user.entity';

export class UsersSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const hashedPassword = await bcrypt.hash('password', 10);

    em.create(User, {
      email: 'admin1@test.com',
      password: hashedPassword,
      role: Role.ADMIN,
    });

    em.create(User, {
      email: 'editor1@test.com',
      password: hashedPassword,
      role: Role.EDITOR,
    });
  }
}
