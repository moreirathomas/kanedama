import { UserRepository } from '../features/user';

export interface WithUserRepository {
  repository: UserRepository;
}
