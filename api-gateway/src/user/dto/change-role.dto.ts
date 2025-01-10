import { IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Role } from "../../core/constants/enums";

export class ChangeRoleDto {
    @IsEnum(Role)
    @ApiProperty({
        description: 'Role of a user',
        enum: ['GHOST', 'USER', 'ADMIN']
    })
    role: Role
}
