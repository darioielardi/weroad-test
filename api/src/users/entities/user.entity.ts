import {
  Collection,
  Entity,
  ManyToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Role } from './role.entity';

@Entity()
export class User {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id: string;

  @Property({ unique: true })
  email: string;

  @Property({ hidden: true })
  password: string;

  @ManyToMany(() => Role)
  roles = new Collection<Role>(this);
}
