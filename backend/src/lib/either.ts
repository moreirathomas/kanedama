const EitherType = {
  Left: Symbol('left'),
  Right: Symbol('right'),
};

export type Either<L, R> = Left<L> | Right<R>;

export type Left<L> = {
  type: typeof EitherType.Left;
  value: L;
};

export type Right<R> = {
  type: typeof EitherType.Right;
  value: R;
};

export function Left<L>(value: L): Left<L> {
  return {
    type: EitherType.Left,
    value,
  };
}

export function Right<R>(value: R): Right<R> {
  return {
    type: EitherType.Right,
    value,
  };
}

export function isLeft<L, R>(val: Either<L, R>): val is Left<L> {
  return val.type === EitherType.Left;
}

export function isRight<L, R>(val: Either<L, R>): val is Right<R> {
  return val.type === EitherType.Right;
}
