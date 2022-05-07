# WeRoad Application Test

TODO:

- db w docker (compose?)
- remove unnecessary endpoints
- remove unnecessary unit tests
- branding
- travel moods
- error handling (codes + alerts)
- toasts https://github.com/nuxt-community/community-modules/tree/master/packages/toast

TO DOC:

- we use a db generated id to improve DX when working with a db client (pgcrypto instead of uuid-ossp https://www.postgresql.org/docs/12/uuid-ossp.html)
- nuxtjs spa + static
- auth flow
- auth has rest endpoints for simplicity ( and nuxt/auth integration ), but we can implement as gql ops if needed

## Setup

yarn install
fill .env
setup db w docker
migrate + seed
start

## Testing

yarn api test:setup
yarn api test / yarn api test:e2e

## To Ask

- roles system
- travel slug vs name uniqueness
- travel moods (json vs relation vs columns)
