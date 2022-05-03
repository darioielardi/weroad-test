import {
  Collection,
  Entity,
  ManyToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import { Role } from './role.entity';

@Entity()
@ObjectType()
export class User {
  @Field(() => ID)
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id: string;

  @Property({ unique: true })
  email: string;

  @HideField()
  @Property({ lazy: true, hidden: true })
  password: string;

  @Field(() => [Role])
  @ManyToMany({ entity: () => Role, eager: true })
  roles = new Collection<Role>(this);
}
