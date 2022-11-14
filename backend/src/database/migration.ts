import { Knex } from 'knex';

const query = `CREATE TABLE Persons (
  PersonID int,
  name varchar(255),
  email varchar(255),
  password varchar(255),
  city varchar(255)
);`;

export async function migrate(database: Knex) {
  console.log('migrating 🚀');
  try {
    await database.raw(query);
  } catch (error) {
    console.info(error);
  }
}
