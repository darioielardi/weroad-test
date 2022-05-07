# WeRoad Application Test

TODO:

- db w docker (compose?)
- remove unnecessary endpoints
- remove unnecessary unit tests

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
