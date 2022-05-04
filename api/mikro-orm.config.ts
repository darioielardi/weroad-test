import { Options } from '@mikro-orm/core';
import { BaseEntity } from './src/common/base.entity';
import { Tour } from './src/tours/entities/tour.entity';
import { Travel } from './src/travels/entities/travel.entity';
import { Role } from './src/users/entities/role.entity';
import { User } from './src/users/entities/user.entity';

const options: Options = {
  clientUrl: process.env.DATABASE_URL,
  type: 'postgresql',

  entities: [BaseEntity, User, Role, Travel, Tour],

  seeder: {
    path: 'database/seeders',
  },

  migrations: {
    path: 'database/migrations',
  },
};

export default options;
