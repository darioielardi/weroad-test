import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { IS_PUBLIC_KEY } from './auth.constants';
import { GqlAuthGuard } from './gql-auth.guard';
import { GqlRolesGuard } from './roles.guard';

export const CurrentUser = createParamDecorator(
  (_: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.user || null;
  },
);

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export function UseAuthGuards() {
  return UseGuards(GqlAuthGuard, GqlRolesGuard);
}
