import { Query, Resolver } from '@nestjs/graphql';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { CurrentUser } from './auth.decorators';
import { AuthUser } from './auth.types';
import { UseGqlAuthGuard } from './gql-auth.guard';

@Resolver()
export class AuthResolver {
  constructor(private usersService: UsersService) {}

  @UseGqlAuthGuard()
  @Query(() => User)
  async me(@CurrentUser() authUser: AuthUser) {
    return this.usersService.findOne(authUser.userId);
  }
}
