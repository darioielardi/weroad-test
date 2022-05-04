import { PrimaryKey, Property } from '@mikro-orm/core';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BaseEntity {
  @Field(() => ID)
  @PrimaryKey({ columnType: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id: string;

  @Property({ defaultRaw: 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Property({ defaultRaw: 'CURRENT_TIMESTAMP', onUpdate: () => new Date() })
  updatedAt: Date;
}
