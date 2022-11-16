import { Either, left, right } from './either';

/**
 * Applies a list of functions to an input, returning a list of errors if any
 * of the functions return an instance of `Either` that is `Left`.
 * @example
 * const fns = [
 *   (input: unknown) => typeof input === 'string' ? right(input) : left('not a string'),
 *   (input: unknown) => typeof input === 'number' ? right(input) : left('not a number'),
 * ];
 * const result = applyValidation(fns)(true);
 * assert(result.value).equal(['not a string', 'not a number']);
 */
export function applyValidation<E, T, U>(
  fns: ((input: U) => Either<E, T>)[],
): (input: U) => Either<E[], T> {
  return (input: U) => {
    const v = fns.reduce((acc, fn) => {
      const res = fn(input);

      if (res.isLeft()) {
        if (acc.isLeft()) {
          return left([...acc.value, res.value]);
        }
        return left([res.value]);
      }

      return acc;
    }, right(input) as Either<E[], T>);

    return v;
  };
}
