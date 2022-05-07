import { ApolloError } from 'apollo-client';

export function isApolloError(err: unknown): err is ApolloError {
  return err instanceof ApolloError;
}
