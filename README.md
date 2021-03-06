# WeRoad Technical Test Project

This is my submission for the WeRoad technical test project.

## Introduction

This repository is structured as a monorepo with two projects:

- `api`: the api server (NestJS).
- `web`: a NuxtJS frontend app.

Dependencies management is handled by `yarn` through `yarn workspaces`.

## Setup

We need a Postgres database. If needed, there's a `docker-compose.yml` file configured to spin up a Postgres 14 instance with two database (`weroad-dev` for development and `weroad-test` for testing). Just run `docker-compose up` and you're ready to go.

- Install dependencies with `yarn`.
- Create the `.env` and `.env.test` files in the `api` project based on the `.env.example` template.
- Run the database migrations with `yarn db:migrate`
- Run the main seeder with `yarn db:seed`

## Development

- To start the api server: `yarn api dev`
- To start the frontend server: `yarn web dev`

The credentials for the users generated by the main seeder are:

email:

- for the admin: `admin1@test.com`
- for the editor: `editor1@test.com`

the password is: `password`

## Testing

The api server comes with a complete end-to-end tests suite. I think a properly managed e2e tests suite is enough for a project of this size and complexity, which is why there are no unit or integration tests.

To run the e2e tests suite, use the command NestJS set up for us: `yarn api test:e2e`.

A global `test/setup.js` script is executed by jest to setup and clean the test database and load the `.env.test` file before all tests run.

Tests are run with a `maxWorkers` lock option set to 3 for performance reasons.

## Notes

Some notes about the choices and implementations of this project:

### UUIDs

Every database entity uses UUIDs as the primary key. That's not handled by the ORM, they're generated at the database level. This is to make it easier to work with the database outside of the application code, such as within a GUI client.

The UUIDs are generated with the `pgcrypto` extension, as suggested by the official Postgres docs: https://www.postgresql.org/docs/12/uuid-ossp.html (see the Note at the bottom).

### Frontend app deployment target

Since we have a separate api server and server side rendering is not a priority, the deployment target for the NuxtJS application is a static single page application, which is easy and cheap to deploy.

### Authentication

The authentication system is stateless, thanks to JWTs.

The authentication endpoints are implemented as traditional REST ones, instead of GraphQL operations. This is mainly to take advantage of `@nuxtjs/auth` on the client side, which comes with built-in strategies that only support REST endpoints. It also supports custom schemes, so an eventual GraphQL implementation it's definitely possible, just not convenient for this project.

#### Refresh tokens

For an application that handles private and business-critical data, a refresh token system is a must-have in the context of JWTs. When a user logs in, they are provided with:

- An access token with an expiration time of 15 minutes.
- A refresh token with an expiration time of 7 days.

The actual refresh mechanism based on token expiration is automatically handled by `@nuxtjs/auth`. One thing I don't like about the library is the fact that both the tokens are stored in local storage. Normally, I would keep the access token in memory and, most importantly, I would only send the refresh token as an http-only cookie, for an extra layer of security. Once again, this can probably be solved with a custom strategy/scheme.

Another thing that should be implemented in this context is refresh tokens invalidation. This can easily be done in multiple ways, and the actual implementation depends on the project requirements.

## Notes on requirements

1. A login endpoint to retrieve the user roles; - DONE
2. A private (admin) endpoint to create new users. If you want, this could be a DB seeder. This will mainly be used to generate users for this exercise; - DONE (UsersSeeder)
3. A private (admin) endpoint to create new travels; - DONE
4. A private (admin) endpoint to create new tours for travel; - DONE
5. A private (admin) endpoint to delete a travel; - DONE
6. A public (no auth) endpoint to get a list of paginated travels and associated tours. It must return only `public` travels; - DONE (this is actually used to fetch travels in the dashboard. When an authenticated user is found all travels are fetched, even private ones)
7. (optional) A private (editor) endpoint to update a tour; - DONE
8. (optional) A public (no auth) endpoint to get a list of paginated tours by the travel `slug` (e.g. all the tours of the travel `foo-bar`). Users can filter (search) the results by `priceFrom`, `priceTo`, `startingDate`, `endingDate`. User can sort the list by `price` asc and desc. They will **always** be sorted, after every additional user-provided filter, by `startingDate` asc. - DONE (this is also used to fetch tours in the travel page, like the `travels`, and it will throw a 404 if the travel is not public and no authenticated user is detected)

#### The front-end project should have:

1. A page that allows to interact with the travel end-points described above - DONE
2. Roles should be considered in the user interaction within the pages (e.g only admins can delete travel) - DONE
3. A page that lists the paginated travels and links to the single travel - DONE
4. (optional) A page that lists the paginated tours and links to the single tour - DONE
5. (optional) A page that allows to interact with the tour end-points described above - DONE
