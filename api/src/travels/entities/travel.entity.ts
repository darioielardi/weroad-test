import { Entity, Property } from '@mikro-orm/core';
import { ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '../../common/base.entity';

@Entity()
@ObjectType()
export class Travel extends BaseEntity {
  @Property({ default: false })
  isPublic = false;

  @Property({ unique: true })
  slug: string;

  @Property()
  name: string;

  @Property({ columnType: 'TEXT' })
  description: string;

  @Property()
  numberOfDays: number;

  @Property({ persist: false })
  get numberOfNights() {
    return this.numberOfDays - 1;
  }
}
