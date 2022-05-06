import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: EntityRepository<User>,
  ) {}

  findOne(id: string) {
    return this.userRepo.findOne(id);
  }

  findOneByEmail(email: string, selectPassword = false) {
    return this.userRepo.findOne(
      { email },
      { populate: selectPassword ? ['password'] : [] },
    );
  }
}
