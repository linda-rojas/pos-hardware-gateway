import { Body, Controller, Get, Post } from '@nestjs/common';
import { PrintTestDto } from '../dto/print-test.dto';
import { PrintReceiptDto } from '../dto/print-receipt.dto';
import { PrintTestUseCase } from '../application/print-test.use-case';
import { PrintReceiptUseCase } from '../application/print-receipt.use-case';

@Controller('printer')
export class PrinterController {
    constructor(
        private readonly printTestUseCase: PrintTestUseCase,
        private readonly printReceiptUseCase: PrintReceiptUseCase,
    ) { }

    @Get('health')
    health() {
        return {
            success: true,
            module: 'printer',
            status: 'ok',
        };
    }

    @Post('print-test')
    async printTest(@Body() dto: PrintTestDto) {
        const result = await this.printTestUseCase.execute(dto);

        return {
            success: true,
            message: 'Print test sent successfully',
            data: result,
        };
    }

    /**
     * Imprime un recibo de venta.
     * El POS envía las líneas ya formateadas; el gateway solo convierte a bytes ESC/POS.
     * Si `openDrawer: true` también abre el cajón en el mismo comando, antes de imprimir.
     */
    @Post('receipt')
    async printReceipt(@Body() dto: PrintReceiptDto) {
        const result = await this.printReceiptUseCase.execute(dto);

        return {
            success: true,
            message: 'Receipt printed successfully',
            data: result,
        };
    }
}