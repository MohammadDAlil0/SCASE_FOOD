import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CraeteOrderDto {
    @ApiProperty({
        description: 'Contributor ID',
        type: String,
        example: 'xxxx-xxxx'
    })
    @IsString()
    @IsNotEmpty()
    contributorId: string;
}