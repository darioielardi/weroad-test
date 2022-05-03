import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class Travel {
  @Field(() => ID)
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id: string;

  @Property()
  isPublic: boolean;

  @Property({ unique: true })
  slug: string;

  @Property()
  name: string;

  @Property()
  description: string;

  @Property()
  numberOfDays: number;

  @Property({ persist: false })
  get numberOfNights() {
    return this.numberOfDays - 1;
  }
}
