import { BarcodeScanEntity } from './barcode-scan.entity';

export interface BarcodeScannerPort {
    registerScan(
        code: string,
        source?: string,
        deviceId?: string
    ): BarcodeScanEntity;
}