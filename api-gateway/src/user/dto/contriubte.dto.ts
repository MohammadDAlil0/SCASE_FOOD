import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDefined, IsNotEmpty, IsUUID } from "class-validator";

export class ContributeDto {
    @ApiProperty({
        description: 'Expected Date to call',
        type: Date
    })
    @IsNotEmpty()
    @Type(() => Date)
    dateToCall: Date;
}