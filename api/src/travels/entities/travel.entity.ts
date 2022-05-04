import { Collection, Entity, OneToMany, Property } from '@mikro-orm/core';
import { ObjectType } from '@nestjs/graphql';
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

  @Property({ columnType: 'TEXT' })
  description: string;

  @Property()
  numberOfDays: number;

  @Property({ persist: false })
  get numberOfNights() {
    return this.numberOfDays - 1;
  }

  @OneToMany(() => Tour, (tour) => tour.travel)
  tours = new Collection<Tour>(this);
}
