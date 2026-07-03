import { Module } from '@nestjs/common';
import { PrintTestUseCase } from './application/print-test.use-case';
import { WindowsPrinterAdapter } from './infrastructure/windows-printer.adapter';
import { PrinterController } from './presentation/printer.controller';

@Module({
    controllers: [PrinterController],
    providers: [PrintTestUseCase, WindowsPrinterAdapter],
    exports: [PrintTestUseCase],
})
export class PrinterModule { }