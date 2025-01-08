import { Role } from "../constants/enums";

export class CreateUserDto {
    username: string;

    email: string;

    password: string;

    confirmPassword: string;

    role: Role;
}