import { Either, left, right } from '../../lib/either';
import { applyValidation } from '../../lib/validation';
import { User } from './type';

type AlphanumericError = 'must be alphanumeric';

const alphanumeric = (input: string): Either<AlphanumericError, string> => {
  return !input.match(/^[\w]+$/)
    ? left('must be alphanumeric' as AlphanumericError)
    : right(input);
};

type LengthError = `must be between ${number} and ${number} characters`;

const lengthBetween = (min: number, max: number) => {
  return (input: string): Either<LengthError, string> => {
    return input.length < min || input.length > max
      ? left(`must be between ${min} and ${max} characters` as LengthError)
      : right(input);
  };
};

type AlphanumericEmailError =
  `${AlphanumericError} and contain a single @ symbol`;

const alphanumericEmail = (
  input: string,
): Either<AlphanumericEmailError, string> => {
  return !input.match(/^[\w]+@([\w]+\.)+[\w]+$/)
    ? left(
        'must be alphanumeric and contain a single @ symbol' as AlphanumericEmailError,
      )
    : right(input);
};

const parseName = (input: string) => {
  const fns = [alphanumeric, lengthBetween(4, 50)];
  return applyValidation(fns)(input);
};

const parseEmail = (input: string) => {
  const fns = [alphanumericEmail, lengthBetween(0, 256)];
  return applyValidation(fns)(input);
};

const parsePassword = (input: string) => {
  const fns = [alphanumeric, lengthBetween(8, 255)];
  return applyValidation(fns)(input);
};

export type ErrorParseUser = Record<keyof User, string[] | undefined>;

export const parseUser = (input: User): Either<ErrorParseUser, User> => {
  const name = parseName(input.name);
  const email = parseEmail(input.email);
  const password = parsePassword(input.password);

  const errors: ErrorParseUser = {
    name: name.isLeft() ? name.value : undefined,
    email: email.isLeft() ? email.value : undefined,
    password: password.isLeft() ? password.value : undefined,
  };

  if (Object.values(errors).some((error) => error !== undefined)) {
    return left(errors);
  }

  return right(input);
};
