import { Module } from '@nestjs/common';
import { OpenCashDrawerUseCase } from './application/open-cash-drawer.use-case';
import { WindowsRawPrinterAdapter } from './infrastructure/windows-raw-printer.adapter';
import { CashDrawerController } from './presentation/cash-drawer.controller';

@Module({
    controllers: [CashDrawerController],
    providers: [OpenCashDrawerUseCase, WindowsRawPrinterAdapter],
    exports: [OpenCashDrawerUseCase],
})
export class CashDrawerModule { }