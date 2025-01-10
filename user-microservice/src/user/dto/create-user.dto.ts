import { Role } from "src/core/constants/enums";

export class CreateUserDto {
    username: string;

    email: string;

    password: string;

    confirmPassword: string;

    role: Role;
}