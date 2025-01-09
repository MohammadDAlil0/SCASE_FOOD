import { Role } from "src/constants/enums";

export class CreateUserDto {
    username: string;

    email: string;

    password: string;

    confirmPassword: string;

    role: Role;
}