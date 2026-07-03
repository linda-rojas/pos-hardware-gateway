import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BarcodeModule } from './modules/barcode/barcode.module';
import { PrinterModule } from './modules/printer/printer.module';
import { CashDrawerModule } from './modules/cash-drawer/cash-drawer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BarcodeModule,
    PrinterModule,
    CashDrawerModule,
  ],
})
export class AppModule { }