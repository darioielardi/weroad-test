import { Collection, Entity, ManyToMany, Property } from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '../../common/base.entity';
import { User } from './user.entity';

@Entity()
@ObjectType()
export class Role extends BaseEntity {
  @Property()
  name: string;

  @Field(() => [User], { nullable: true })
  @ManyToMany(() => User, (user) => user.roles)
  users = new Collection<User>(this);
}
