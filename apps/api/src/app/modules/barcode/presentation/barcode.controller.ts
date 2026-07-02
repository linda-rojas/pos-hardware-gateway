import { Body, Controller, Get, Post } from '@nestjs/common';
import { RegisterBarcodeScanUseCase } from '../application/register-barcode-scan.use-case';
import { CreateBarcodeScanDto } from '../dto/create-barcode-scan.dto';
import { BarcodeGateway } from './barcode.gateway';

@Controller('barcode')
export class BarcodeController {
    constructor(
        private readonly registerBarcodeScanUseCase: RegisterBarcodeScanUseCase,
        private readonly barcodeGateway: BarcodeGateway
    ) { }

    @Post('scans')
    createScan(@Body() dto: CreateBarcodeScanDto) {
        const scan = this.registerBarcodeScanUseCase.execute(dto);

        this.barcodeGateway.emitBarcodeScanned(scan);

        return {
            success: true,
            message: 'Barcode scan registered successfully',
            data: scan,
        };
    }

    @Get('scans')
    getScans() {
        return {
            success: true,
            data: this.registerBarcodeScanUseCase.getLastScans(),
        };
    }

    @Get('last-scan')
    getLastScan() {
        return {
            success: true,
            data: this.registerBarcodeScanUseCase.getLastScan(),
        };
    }

    @Get('health')
    health() {
        return {
            success: true,
            module: 'barcode',
            status: 'ok',
        };
    }
}