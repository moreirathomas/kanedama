import { UserRepository } from '../user';

export interface WithUserRepository {
  repository: UserRepository;
}
