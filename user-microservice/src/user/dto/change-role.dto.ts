import { Role } from "src/core/constants/enums";

export class ChangeRoleDto {
    userId: string;
    role: Role;
}