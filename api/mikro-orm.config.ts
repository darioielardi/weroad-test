import { Options } from '@mikro-orm/core';
import { BaseEntity } from './src/common/base.entity';
import { Travel } from './src/travels/entities/travel.entity';
import { Role } from './src/users/entities/role.entity';
import { User } from './src/users/entities/user.entity';

const options: Options = {
  entities: [BaseEntity, User, Role, Travel],
  dbName: process.env.NODE_ENV === 'test' ? 'weroad-test' : 'weroad-dev',
  type: 'postgresql',

  seeder: {
    path: 'database/seeders',
  },

  migrations: {
    path: 'database/migrations',
  },
};

export default options;
