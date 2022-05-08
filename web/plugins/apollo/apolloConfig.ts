import { Context } from '@nuxt/types';
import { RefreshScheme } from '@nuxtjs/auth-next';

export default (ctx: Context) => ({
  httpEndpoint: 'http://localhost:3001/graphql',
  getAuth: async () => {
    const strategy = ctx.$auth.strategy as RefreshScheme;

    if (strategy.token.status().expired()) {
      await strategy.refreshTokens();
    }

    return strategy.token.get();
  },
});
