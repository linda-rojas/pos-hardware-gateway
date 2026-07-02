import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateBarcodeScanDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    code!: string;

    @IsString()
    @IsOptional()
    @MaxLength(100)
    source?: string;

    @IsString()
    @IsOptional()
    @MaxLength(100)
    deviceId?: string;
}