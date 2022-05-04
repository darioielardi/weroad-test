import { Collection, Entity, ManyToMany, Property } from '@mikro-orm/core';
import { Field, HideField, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '../../common/base.entity';
import { Role } from './role.entity';

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @Property({ unique: true })
  email: string;

  @HideField()
  @Property({ lazy: true, hidden: true })
  password: string;

  @Field(() => [Role])
  @ManyToMany({ entity: () => Role, eager: true })
  roles = new Collection<Role>(this);
}
