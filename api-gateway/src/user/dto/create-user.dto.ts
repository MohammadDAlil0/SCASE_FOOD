import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { Match } from "../decorators/confim-password.validator.decorator";
import { Role } from "../../core/constants/enums";

export class CreateUserDto {
    @ApiProperty({
        description: 'Username of a user',
        type: String,
        example: 'user1'
    })
    @IsString()
    @IsNotEmpty()
    username: string;
    
    @ApiProperty({
        description: 'Email of a user',
        type: String,
        example: 'user1@example.com'
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'Password of a user',
        type: String,
        minLength: 8,
        example: '12345678'
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password: string;

    @ApiProperty({
        description: 'Confirm your password',
        type: String,
        example: '12345678'
    })
    @IsString()
    @IsNotEmpty()
    @Match('password', { message: 'Passwords do not match' })
    confirmPassword: string;

    // TOTEST
    @ApiProperty({
        description: 'Role of a user, it is just for testing',
        type: String,
        example: 'USER'
    })
    @IsEnum(Role)
    role: Role;
}