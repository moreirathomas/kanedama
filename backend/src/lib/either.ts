export type Either<L, R> = Left<L> | Right<R>;

export interface Left<L> {
  value: L;
  isLeft(): this is Left<L>;
  isRight(): false;
}

export interface Right<R> {
  value: R;
  isLeft(): false;
  isRight(): this is Right<R>;
}

export function left<L>(value: L): Left<L> {
  return {
    value,
    isLeft() {
      return true;
    },
    isRight() {
      return false;
    },
  };
}

export function right<R>(value: R): Right<R> {
  return {
    value,
    isLeft() {
      return false;
    },
    isRight() {
      return true;
    },
  };
}
