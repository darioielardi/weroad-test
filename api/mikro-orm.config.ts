import { Options } from '@mikro-orm/core';
import { Role } from './src/users/entities/role.entity';
import { User } from './src/users/entities/user.entity';

const options: Options = {
  entities: [User, Role],
  dbName: 'weroad-dev',
  type: 'postgresql',
};

export default options;
