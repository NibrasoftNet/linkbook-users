import { SetMetadata } from '@nestjs/common';
import { RoleEnum } from '../../roles/roles.enum';

export const Roles = (...roles: RoleEnum[]) => SetMetadata('roles', roles);
