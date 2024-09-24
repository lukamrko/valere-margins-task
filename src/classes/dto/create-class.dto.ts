import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClassDto {
    @ApiProperty({ description: 'The name of the class' })
    @IsNotEmpty()
    className: string;

    @ApiProperty({ description: 'Description of the class', required: false })
    classDescription?: string;

    @ApiProperty({ description: 'ID of the associated sport' })
    @IsNotEmpty()
    sportID: number;
}
