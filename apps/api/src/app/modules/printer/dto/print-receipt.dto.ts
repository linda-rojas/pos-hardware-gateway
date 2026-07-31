import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
  ArrayMaxSize,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ReceiptLineDto {
  /** Texto de la línea — requerido salvo que sea divider o blank */
  @IsString()
  @IsOptional()
  @MaxLength(500)
  text?: string;

  /**
   * Alineación: 'left' | 'center' | 'right'
   * Por defecto: 'left'
   */
  @IsString()
  @IsOptional()
  align?: 'left' | 'center' | 'right';

  /** Negrita */
  @IsBoolean()
  @IsOptional()
  bold?: boolean;

  /** Tamaño doble (ESC/POS GS ! 0x11) */
  @IsBoolean()
  @IsOptional()
  doubleSize?: boolean;

  /** Línea divisoria de guiones — si true, ignora `text` */
  @IsBoolean()
  @IsOptional()
  divider?: boolean;

  /** Línea en blanco — si true, ignora `text` */
  @IsBoolean()
  @IsOptional()
  blank?: boolean;

  /**
   * Imagen en base64 (PNG o JPG).
   * Si está presente, se imprime centrada como raster ESC/POS.
   * Ignora `text`, `bold`, `doubleSize`, `align`.
   */
  @IsString()
  @IsOptional()
  imageBase64?: string;

  /**
   * Ancho máximo de la imagen en píxeles al que se redimensionará antes de imprimir.
   * Por defecto: 384 (ancho útil en impresoras de 80mm a 203dpi).
   */
  @IsOptional()
  imageWidth?: number;
}

export class PrintReceiptDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  printerName!: string;

  /**
   * Líneas del recibo en orden, ya formateadas y decididas por el POS.
   * El gateway no toma decisiones de diseño — solo convierte a bytes.
   */
  @IsArray()
  @ArrayMaxSize(200)
  @ValidateNested({ each: true })
  @Type(() => ReceiptLineDto)
  lines!: ReceiptLineDto[];

  /**
   * Si true, envía comando ESC/POS de corte de papel al final.
   * Por defecto: true
   */
  @IsBoolean()
  @IsOptional()
  cutPaper?: boolean;

  /**
   * Si true, envía comando de apertura de cajón ANTES de imprimir.
   * Útil para hacer las dos cosas en una sola llamada.
   */
  @IsBoolean()
  @IsOptional()
  openDrawer?: boolean;
}
