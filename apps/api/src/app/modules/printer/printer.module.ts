import { Module } from '@nestjs/common';
import { PrintTestUseCase } from './application/print-test.use-case';
import { PrintReceiptUseCase } from './application/print-receipt.use-case';
import { WindowsPrinterAdapter } from './infrastructure/windows-printer.adapter';
import { WindowsRawPrinterAdapter } from '../cash-drawer/infrastructure/windows-raw-printer.adapter';
import { PrinterController } from './presentation/printer.controller';

@Module({
    controllers: [PrinterController],
    providers: [
        PrintTestUseCase,
        PrintReceiptUseCase,
        WindowsPrinterAdapter,
        // WindowsRawPrinterAdapter es stateless — lo registramos aquí
        // para que PrintReceiptUseCase pueda enviarse bytes ESC/POS RAW
        WindowsRawPrinterAdapter,
    ],
    exports: [PrintTestUseCase, PrintReceiptUseCase],
})
export class PrinterModule { }