import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateBarcodeScanDto } from '../dto/create-barcode-scan.dto';
import { BarcodeScanEntity } from '../domain/barcode-scan.entity';

@Injectable()
export class RegisterBarcodeScanUseCase {
    private readonly scans: BarcodeScanEntity[] = [];

    execute(dto: CreateBarcodeScanDto): BarcodeScanEntity {
        const scan: BarcodeScanEntity = {
            id: randomUUID(),
            code: dto.code.trim(),
            source: dto.source || 'unknown',
            deviceId: dto.deviceId || 'unknown-device',
            scannedAt: new Date().toISOString(),
        };

        this.scans.unshift(scan);

        if (this.scans.length > 50) {
            this.scans.pop();
        }

        return scan;
    }

    getLastScans(): BarcodeScanEntity[] {
        return this.scans;
    }

    getLastScan(): BarcodeScanEntity | null {
        return this.scans[0] || null;
    }
}