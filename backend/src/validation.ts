const ValidationType = {
  Failure: Symbol(':failure'),
};

export type Validation<T, E> = T | Failure<E>;

export type Failure<E> = {
  type: typeof ValidationType.Failure;
  error: E;
};

export function Failure<E>(error: E): Failure<E> {
  return {
    type: ValidationType.Failure,
    error,
  };
}

export function isFailure<E>(val: unknown): val is Failure<E> {
  return (
    typeof val === 'object' &&
    val !== null &&
    (val as Failure<E>).type === ValidationType.Failure
  );
}

export function mergeFailures<T, E, U>(
  fns: ((input: U) => Validation<T, E>)[],
) {
  return (input: U) => {
    return fns.reduce((errors, fn) => {
      const prev = fn(input);
      if (isFailure<E>(prev)) {
        return Failure([...errors.error, prev.error]);
      }
      return errors;
    }, Failure([] as E[]));
  };
}
