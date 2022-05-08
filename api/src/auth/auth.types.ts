import { Role } from '../users/entities/user.entity';

export interface AuthUser {
  userId: string;
  role: Role;
}
