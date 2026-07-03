import { IsIn, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class OpenCashDrawerDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    printerName!: string;

    @IsString()
    @IsOptional()
    @IsIn(['default', 'pin2', 'pin5'])
    pulseType?: 'default' | 'pin2' | 'pin5';

    @IsString()
    @IsOptional()
    @IsIn(['soft', 'normal', 'strong'])
    pulseStrength?: 'soft' | 'normal' | 'strong';
}