import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDefined, IsEnum, IsNotEmpty, IsOptional, IsUUID } from "class-validator";
import { Status } from "src/core/constants/enums";

export class ChangeStatusDto {
    @ApiProperty({
        description: 'Expected Date to call',
        type: Date
    })
    @IsOptional()
    @IsNotEmpty()
    @Type(() => Date)
    dateToCall?: Date;
}