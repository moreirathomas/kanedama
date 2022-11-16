import { left, right } from './either';
import { applyValidation } from './validation';

describe('applyValidation', () => {
  test('is left when one function returns left', () => {
    const fns = [
      (input: string) => right(input),
      () => left('error'),
      (input: string) => right(input),
    ];

    const actual = applyValidation(fns)('input');

    expect(actual.isLeft()).toEqual(true);
    expect(actual.value).toEqual(['error']);
  });

  test('is right when all functions return right', () => {
    const fns = [
      (input: string) => right(input),
      (input: string) => right(input),
    ];

    const result = applyValidation(fns)('input');

    expect(result.isRight()).toBe(true);
  });

  test('accumulates errors', () => {
    const fns = [
      (input: string) => right(input),
      () => left('error'),
      () => left('another error'),
    ];

    const actual = applyValidation(fns)('input');

    expect(actual.isLeft()).toEqual(true);
    expect(actual.value).toEqual(['error', 'another error']);
  });

  // Supporting application of incremental transformations is a nice-to-have
  // feature. It's way more complex however, and not necessary for the
  // current use case.
  test('does not mutate input', () => {
    const fns = [
      (input: number) => right(input + 1),
      (input: number) => right(input * 2),
    ];

    const result = applyValidation(fns)(1);
    expect(result.value).toEqual(1);
  });
});
