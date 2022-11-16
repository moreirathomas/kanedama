import { Either } from '../lib/either';

export type RepositoryError = 'NOT_FOUND' | 'UNIQUE_VIOLATION' | 'UNKNOWN';

export type RepositoryResult<T> = Promise<Either<RepositoryError, T>>;
