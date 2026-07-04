import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class ReadScaleDto {
    @IsString()
    @IsNotEmpty()
    port!: string;

    @IsInt()
    @IsOptional()
    baudRate?: number;

    @IsInt()
    @IsOptional()
    @Min(500)
    @Max(10000)
    timeoutMs?: number;
}