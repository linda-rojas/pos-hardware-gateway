import { Injectable } from '@nestjs/common';
import { PrintTestDto } from '../dto/print-test.dto';
import { WindowsPrinterAdapter } from '../infrastructure/windows-printer.adapter';

@Injectable()
export class PrintTestUseCase {
    constructor(private readonly windowsPrinterAdapter: WindowsPrinterAdapter) { }

    async execute(dto: PrintTestDto) {
        const now = new Date();

        const title = dto.title?.trim() || 'POS HARDWARE GATEWAY';

        const ticket = [
            '',
            this.centerText(title, 32),
            '--------------------------------',
            this.centerText('Prueba de impresora termica', 32),
            '',
            `Fecha: ${now.toLocaleDateString()}`,
            `Hora : ${now.toLocaleTimeString()}`,
            '',
            'Impresora: ' + dto.printerName,
            'Estado: OK',
            '--------------------------------',
            this.centerText('Gracias', 32),
            '',
            '',
            '',
        ].join('\r\n');

        await this.windowsPrinterAdapter.printText(dto.printerName, ticket);

        return {
            printerName: dto.printerName,
            printedAt: now.toISOString(),
        };
    }

    private centerText(text: string, width: number): string {
        if (text.length >= width) {
            return text;
        }

        const leftPadding = Math.floor((width - text.length) / 2);

        return `${' '.repeat(leftPadding)}${text}`;
    }
}