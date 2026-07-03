import { Injectable } from '@nestjs/common';
import { OpenCashDrawerDto } from '../dto/open-cash-drawer.dto';
import { WindowsRawPrinterAdapter } from '../infrastructure/windows-raw-printer.adapter';

@Injectable()
export class OpenCashDrawerUseCase {
    constructor(private readonly windowsRawPrinterAdapter: WindowsRawPrinterAdapter) { }

    async execute(dto: OpenCashDrawerDto) {
        const command = this.getOpenDrawerCommand(dto.pulseType || 'default');

        await this.windowsRawPrinterAdapter.sendRawBytes(dto.printerName, command);

        return {
            printerName: dto.printerName,
            pulseType: dto.pulseType || 'default',
            openedAt: new Date().toISOString(),
        };
    }

    private getOpenDrawerCommand(
        pulseType: 'default' | 'pin2' | 'pin5'
    ): number[] {
        /**
         * ESC/POS cash drawer command:
         * ESC p m t1 t2
         *
         * ESC = 27
         * p   = 112
         * m   = 0 or 1, depending on drawer pin
         * t1  = pulse on time
         * t2  = pulse off time
         */
        if (pulseType === 'pin5') {
            return [27, 112, 1, 25, 250];
        }

        return [27, 112, 0, 25, 250];
    }
}