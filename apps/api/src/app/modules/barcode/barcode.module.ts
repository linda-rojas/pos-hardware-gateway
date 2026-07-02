import { Module } from '@nestjs/common';
import { RegisterBarcodeScanUseCase } from './application/register-barcode-scan.use-case';
import { BarcodeController } from './presentation/barcode.controller';
import { BarcodeGateway } from './presentation/barcode.gateway';

@Module({
    controllers: [BarcodeController],
    providers: [RegisterBarcodeScanUseCase, BarcodeGateway],
    exports: [RegisterBarcodeScanUseCase],
})
export class BarcodeModule { }