import {
  Cascade,
  Collection,
  Entity,
  OneToMany,
  Property,
} from '@mikro-orm/core';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '../../common/base.entity';
import { Tour } from '../../tours/entities/tour.entity';

@Entity()
@ObjectType()
export class Travel extends BaseEntity {
  @Property({ default: false })
  isPublic: boolean = false;

  @Property({ unique: true })
  slug: string;

  @Property()
  name: string;

  @Property({ columnType: 'text' })
  description: string;

  @Property({ columnType: 'int', check: 'number_of_days >= 0' })
  numberOfDays: number;

  @Property({ persist: false })
  get numberOfNights() {
    return this.numberOfDays - 1;
  }

  @Field(() => [Tour])
  @OneToMany(() => Tour, (tour) => tour.travel, { cascade: [Cascade.REMOVE] })
  tours = new Collection<Tour>(this);

  // moods

  @Field(() => Int)
  @Property({ default: 0, check: 'nature_mood >= 0 AND nature_mood <= 100' })
  natureMood: number;

  @Field(() => Int)
  @Property({ default: 0, check: 'relax_mood >= 0 AND relax_mood <= 100' })
  relaxMood: number;

  @Field(() => Int)
  @Property({ default: 0, check: 'history_mood >= 0 AND history_mood <= 100' })
  historyMood: number;

  @Field(() => Int)
  @Property({ default: 0, check: 'culture_mood >= 0 AND culture_mood <= 100' })
  cultureMood: number;

  @Field(() => Int)
  @Property({ default: 0, check: 'party_mood >= 0 AND party_mood <= 100' })
  partyMood: number;
}
