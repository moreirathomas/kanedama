import {
  Validation,
  Failure,
  isFailure,
  mergeFailures,
} from '../../lib/validation';
import { User } from './type';

const alphanumeric = (input: string): Validation<string, string> => {
  return !input.match(/^[\w]+$/) ? Failure('must be alphanumeric') : input;
};

const lengthBetween =
  (min: number, max: number) =>
  (input: string): Validation<string, string> => {
    return input.length < min || input.length > max
      ? Failure(`must be between ${min} and ${max} characters`)
      : input;
  };

const alphanumericEmail = (input: string): Validation<string, string> => {
  return !input.match(/^[\w]+@([\w]+\.)+[\w]+$/)
    ? Failure('must be alphanumeric and contain a single @ symbol')
    : input;
};

const parseName = (input: string): Validation<string, string[]> => {
  const errors = mergeFailures([alphanumeric, lengthBetween(4, 50)])(input);

  return errors.error.length > 0 ? Failure(errors.error) : input;
};

const parseEmail = (input: string): Validation<string, string[]> => {
  const errors = mergeFailures([alphanumericEmail, lengthBetween(0, 256)])(
    input,
  );

  return errors.error.length > 0 ? Failure(errors.error) : input;
};

const parsePassword = (input: string): Validation<string, string[]> => {
  const errors = mergeFailures([alphanumeric, lengthBetween(8, 255)])(input);

  return errors.error.length > 0 ? Failure(errors.error) : input;
};

export type ErrorParseUser = { [K in keyof User]?: string[] };

export const parseUser = (input: User): Validation<User, ErrorParseUser> => {
  const name = parseName(input.name);
  const email = parseEmail(input.email);
  const password = parsePassword(input.password);

  if (isFailure(name) || isFailure(email) || isFailure(password)) {
    return Failure({
      name: isFailure(name) ? name.error : [],
      email: isFailure(email) ? email.error : [],
      password: isFailure(password) ? password.error : [],
    });
  }

  return input;
};
