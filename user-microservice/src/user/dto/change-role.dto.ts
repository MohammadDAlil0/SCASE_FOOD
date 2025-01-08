import { Role } from "../constants/enums";

export class ChangeRoleDto {
    userId: string;
    role: Role;
}