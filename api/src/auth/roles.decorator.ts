import { SetMetadata } from '@nestjs/common';
import { Role } from '../users/entities/user.entity';
import { ROLES_KEY } from './auth.constants';

export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

export const Admin = () => Roles(Role.ADMIN);
export const Editor = () => Roles(Role.EDITOR);
