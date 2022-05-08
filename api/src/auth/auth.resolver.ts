import { Query, Resolver } from '@nestjs/graphql';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { CurrentUser, UseAuthGuards } from './auth.decorators';
import { AuthUser } from './auth.types';

@UseAuthGuards()
@Resolver()
export class AuthResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => User)
  async me(@CurrentUser() authUser: AuthUser) {
    return this.usersService.findOne(authUser.userId);
  }
}
