import { Entity, Enum, Property } from '@mikro-orm/core';
import { HideField, ObjectType, registerEnumType } from '@nestjs/graphql';
import { BaseEntity } from '../../common/base.entity';

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @Property({ unique: true })
  email: string;

  @HideField()
  @Property({ lazy: true, hidden: true })
  password: string;

  @Enum(() => Role)
  role: Role;
}

export enum Role {
  EDITOR = 'editor',
  ADMIN = 'admin',
}

registerEnumType(Role, {
  name: 'Role',
});
