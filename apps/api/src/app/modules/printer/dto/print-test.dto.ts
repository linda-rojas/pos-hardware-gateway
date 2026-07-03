import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class PrintTestDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    printerName!: string;

    @IsString()
    @IsOptional()
    @MaxLength(100)
    title?: string;
}