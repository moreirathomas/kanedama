import { Either } from '../lib/either';

export interface RepositoryError {
  error: 'NOT_FOUND' | 'UNIQUE_VIOLATION' | 'UNKNOWN';
}

export type RepositoryResult<T> = Promise<Either<RepositoryError, T>>;
