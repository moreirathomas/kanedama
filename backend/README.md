# Our simple app

Here's a very basic little app (for now, we have big expectations!).

## Development

### Prerequisites

- [Node.js](https://nodejs.org/en/) (>=18.0.0)
- [Docker](https://www.docker.com/) to run a local [PostgreSQL](https://www.postgresql.org/) database (or run your own)

Install dependencies:

```bash
npm install
```

### Serve the app

```bash
npm run start
```

### Start the database

You may want to use Docker to run a local PostgreSQL database for development:

```bash
docker run -e POSTGRES_PASSWORD=password -d -p5432:5432 postgres
```

Note that the exposed port `5432` is the default port for PostgreSQL. If you want to use a different port, you need to update `DB_PORT` in the `.env` file (or similar).

Make sure to migrate the database on fresh installations:

```bash
npm run migrate
```

### Testing

```bash
npm run test
```

Will run all tests (unit and end-to-end).

To run only unit tests:

```bash
npm run test:unit
```

To run only end-to-end tests:

```bash
npm run test:e2e
```

Note that the end-to-end tests will perform actual actions against the API and induce read and write operations on the database. To avoid unexpected behavior, it is recommended to use a fresh database for testing. Furthermore, the end-to-end test requires the server to be running.

```bash
# If using Docker
# stop, restart and setup the database
docker stop <container-id> && docker rm <container-id>
docker run -e POSTGRES_PASSWORD=password -d -p5432:5432 postgres
npm run migrate

# start the server in a separate terminal
npm run start

npm run test:e2e
```

## Features

### User registration

A user can register with a name, a valid email, a valid password.

A user has a name, an email address and a password.

- the name must be alphanumeric charaters, its lenght must be in `[4, 50]`
- the email address must contain alphanumeric charaters, a single `@` symbol, its length is `<` 256
- the password must be alphanumeric charaters, its lenght must be in `[8, 255]`

Names and email addresses are unique among our users.

If invalid values are received during the registration, we return the list of failed validations.

### User login

A user can login with their email & password, if it's ok, their name will be returned.

## API

### Register a user

```bash
POST /users
```

#### Query parameters

| Name       | Type     | Description                             |
| ---------- | -------- | --------------------------------------- |
| `name`     | `string` | **Required**. The name of the user.     |
| `email`    | `string` | **Required**. The email of the user.    |
| `password` | `string` | **Required**. The password of the user. |

#### HTTP response status codes

| Status Code | Description                              |
| ----------- | ---------------------------------------- |
| `201`       | Created.                                 |
| `400`       | Invalid parameters or validation failed. |
| `409`       | Email or name already taken.             |

#### Response body

None if successful.

Error object if the validation failed:

```json
{
  "error": "Validation failed",
  "reasons": {
    "name": ["must be alphanumeric", "must be between 4 and 50 characters"],
    "email": ["must be a valid email", "must be less than 256 characters"],
    "password": ["must be alphanumeric", "must be between 8 and 255 characters"]
  }
}
```

### Login

```bash
POST /login
```

#### Query parameters

| Name       | Type     | Description                             |
| ---------- | -------- | --------------------------------------- |
| `email`    | `string` | **Required**. The email of the user.    |
| `password` | `string` | **Required**. The password of the user. |

#### HTTP response status codes

| Status Code | Description         |
| ----------- | ------------------- |
| `200`       | OK.                 |
| `400`       | Invalid parameters. |
| `401`       | Wrong credentials.  |

#### Response body

```json
{
  "name": "John Doe"
}
```

None if failed.

### Check app health

```bash
GET /healthz
```

#### HTTP response status codes

| Status Code | Description                 |
| ----------- | --------------------------- |
| `200`       | OK to receive HTTP traffic. |
