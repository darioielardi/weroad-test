import { Cascade, Check, Entity, ManyToOne, Property } from '@mikro-orm/core';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '../../common/base.entity';
import { Travel } from '../../travels/entities/travel.entity';

@Entity()
@ObjectType()
@Check({
  name: 'tour_dates_check',
  expression: `starting_date < ending_date`,
})
export class Tour extends BaseEntity {
  @Property({ unique: true })
  name: string;

  @Property({ columnType: 'date' })
  startingDate: Date;

  @Property({ columnType: 'date' })
  endingDate: Date;

  @Field(() => Int)
  @Property({ columnType: 'int', check: 'price >= 0 AND price % 100 = 0' })
  price: number;

  @ManyToOne(() => Travel, { cascade: [Cascade.REMOVE] })
  travel: Travel;
}
