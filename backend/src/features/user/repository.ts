import { Knex } from 'knex';
import { DatabaseError } from 'pg';

import { RepositoryResult } from '../../database';
import { Left, Right } from '../../lib/either';
import { User } from './type';

export interface UserRepository {
  createOne(user: User): RepositoryResult<User>;
  findOne(user: Pick<User, 'email' | 'password'>): RepositoryResult<User>;
}

export const userRepository = (databaseConnection: Knex): UserRepository => {
  const query = () => databaseConnection<User>('persons');

  return {
    async createOne(user) {
      try {
        const [createdUser] = await query().insert(user).returning('*');

        return Right(createdUser);
      } catch (error) {
        if (error instanceof DatabaseError) {
          // https://www.postgresql.org/docs/9.5/errcodes-appendix.html
          switch (error.code) {
            case '23505':
              return Left({ error: 'UNIQUE_VIOLATION' });
            default:
              break;
          }
        }
        return Left({ error: 'UNKNOWN' });
      }
    },

    async findOne({ email, password }) {
      try {
        const user = await query().where({ email, password }).first('*');
        if (!user) {
          return Left({ error: 'NOT_FOUND' });
        }
        return Right(user);
      } catch (error) {
        console.error(error);

        return Left({ error: 'UNKNOWN' });
      }
    },
  };
};
