import { SetMetadata } from '@nestjs/common';
import { Role } from '../../core/constants/enums';
import { ROLES_KEY } from '../../core/constants/constants';

export const Roles = (...roles: Role[]) => {
    return SetMetadata(ROLES_KEY, roles)
};