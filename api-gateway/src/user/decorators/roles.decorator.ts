import { SetMetadata } from '@nestjs/common';
import { Role } from '../constants/enums';
import { ROLES_KEY } from '../constants/constants';

export const Roles = (...roles: Role[]) => {
    return SetMetadata(ROLES_KEY, roles)
};