import { Role } from "src/constants/enums";

export class ChangeRoleDto {
    userId: string;
    role: Role;
}