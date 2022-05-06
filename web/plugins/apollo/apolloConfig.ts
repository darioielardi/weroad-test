import { Context } from '@nuxt/types';
import { LocalScheme } from '@nuxtjs/auth-next';

export default (ctx: Context) => ({
  httpEndpoint: 'http://localhost:3001/graphql',
  getAuth: () => {
    const strategy = ctx.$auth.strategy as LocalScheme;
    return strategy.token.get();
  },
});
