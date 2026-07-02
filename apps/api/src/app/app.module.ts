import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BarcodeModule } from './modules/barcode/barcode.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BarcodeModule,
  ],
})
export class AppModule { }