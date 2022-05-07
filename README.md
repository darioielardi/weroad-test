# WeRoad Application Test

TODO:

- db w docker (compose?)
- husky + lint-staged ?
- remove unnecessary endpoints
- test update travel e2e
- remove unnecessary unit tests
- branding
- delete travel
- travel moods
- error handling (codes + alerts)

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
