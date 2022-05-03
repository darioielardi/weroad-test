import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import * as bcrypt from 'bcrypt';
import { Role } from '../src/users/entities/role.entity';
import { User } from '../src/users/entities/user.entity';

export class UsersSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    // roles (using data from json samples)

    const adminRole = em.create(Role, {
      id: 'baf18948-721e-49f5-aa7f-bed1a5415cb6',
      name: 'admin',
    });

    const editorRole = em.create(Role, {
      id: '9442703c-dd4f-4e36-9554-a60574c408be',
      name: 'editor',
    });

    // users

    const hashedPassword = await bcrypt.hash('password', 10);

    em.create(User, {
      email: 'admin1@test.com',
      password: hashedPassword,
      roles: [adminRole],
    });

    em.create(User, {
      email: 'editor1@test.com',
      password: hashedPassword,
      roles: [editorRole],
    });

    // we dont need to flush here because it's called by the seeder
  }
}
