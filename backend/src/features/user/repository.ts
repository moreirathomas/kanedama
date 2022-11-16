import { Knex } from 'knex';
import { DatabaseError } from 'pg';

import { RepositoryResult } from '../../database';
import { left, right } from '../../lib/either';
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

        return right(createdUser);
      } catch (error) {
        if (error instanceof DatabaseError) {
          // https://www.postgresql.org/docs/9.5/errcodes-appendix.html
          switch (error.code) {
            case '23505':
              return left({ error: 'UNIQUE_VIOLATION' });
            default:
              break;
          }
        }
        return left({ error: 'UNKNOWN' });
      }
    },

    async findOne({ email, password }) {
      try {
        const user = await query().where({ email, password }).first('*');
        if (!user) {
          return left({ error: 'NOT_FOUND' });
        }
        return right(user);
      } catch (error) {
        console.error(error);

        return left({ error: 'UNKNOWN' });
      }
    },
  };
};
