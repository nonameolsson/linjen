# Linjen

## What's in the stack

- Email/Password Authentication with
  [cookie-based sessions](https://remix.run/docs/en/v1/api/remix#createcookiesessionstorage)
- Database ORM with [Prisma](https://prisma.io)
- Styling with [Tailwind](https://tailwindcss.com/)
- End-to-end testing with [Cypress](https://cypress.io)
- Local third party request mocking with [MSW](https://mswjs.io)
- Unit testing with [Vitest](https://vitest.dev) and
  [Testing Library](https://testing-library.com)
- Code formatting with [Prettier](https://prettier.io)
- Linting with [ESLint](https://eslint.org)
- Static Types with [TypeScript](https://typescriptlang.org)

Not a fan of bits of the stack? Fork it, change it, and use
`npx create-remix --template your/repo`! Make it your own.

## Quickstart

Click this button to create a [Gitpod](https://gitpod.io) workspace with the
project set up

[![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod)](https://gitpod.io/from-referrer/)

## Dev

- first run `npx prisma generate` https://stackoverflow.com/a/67796697

### PlanetScale

- Connect to database with PlanetScale _TODO: ADD INSTRUCTIONS_

- Start dev server:

  ```sh
  npm run dev
  ```

### Docker PostgreSQL

#### 1. Start containers
`docker compose up -d`

#### 2. Connect from host
`psql -h localhost -U postgres`

#### 3. Create database with psql or pgAdmin

## Deployment

This Remix Stack comes with two GitHub Actions that handle automatically
deploying your app to production and staging environments.

Prior to your first deployment, you'll need to do a few things:

_TODO: ADD INSTRUCTIONS_

### Connecting to your database

_TODO: ADD INSTRUCTIONS_

## GitHub Actions

We use GitHub Actions for continuous integration and deployment. Anything that
gets into the `main` branch will be deployed to production after running
tests/build/etc. Anything in the `dev` branch will be deployed to staging.

## Testing

### Cypress

We use Cypress for our End-to-End tests in this project. You'll find those in
the `cypress` directory. As you make changes, add to an existing file or create
a new file in the `cypress/e2e` directory to test your changes.

We use [`@testing-library/cypress`](https://testing-library.com/cypress) for
selecting elements on the page semantically.

To run these tests in development, run `npm run test:e2e:dev` which will start
the dev server for the app as well as the Cypress client. Make sure the database
is running in docker as described above.

We have a utility for testing authenticated features without having to go
through the login flow:

```ts
cy.login()
// you are now logged in as a new user
```

We also have a utility to auto-delete the user at the end of your test. Just
make sure to add this in each test file:

```ts
afterEach(() => {
  cy.cleanupUser()
})
```

That way, we can keep your local db clean and keep your tests isolated from one
another.

### Vitest

For lower level tests of utilities and individual components, we use `vitest`.
We have DOM-specific assertion helpers via
[`@testing-library/jest-dom`](https://testing-library.com/jest-dom).

### Type Checking

This project uses TypeScript. It's recommended to get TypeScript set up for your
editor to get a really great in-editor experience with type checking and
auto-complete. To run type checking across the whole project, run
`npm run typecheck`.

### Linting

This project uses ESLint for linting. That is configured in `.eslintrc.js`.

_TODO: ADD INSTRUCTIONS FOR TRUNK_

### Formatting

We use [Prettier](https://prettier.io/) for auto-formatting in this project.
It's recommended to install an editor plugin (like the
[VSCode Prettier plugin](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode))
to get auto-formatting on save. There's also a `npm run format` script you can
run to format all files in the project.

_TODO: ADD INSTRUCTIONS FOR TRUNK_

#
