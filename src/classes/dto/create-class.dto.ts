import { IsNotEmpty } from 'class-validator';

export class CreateClassDto {
    @IsNotEmpty()
    className: string;

    classDescription: string;

    @IsNotEmpty()
    sportID: number;
}
