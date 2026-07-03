import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BarcodeModule } from './modules/barcode/barcode.module';
import { PrinterModule } from './modules/printer/printer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BarcodeModule,
    PrinterModule,
  ],
})
export class AppModule { }