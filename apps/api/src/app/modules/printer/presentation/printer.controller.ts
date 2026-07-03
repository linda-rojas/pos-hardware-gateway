import { Body, Controller, Get, Post } from '@nestjs/common';
import { PrintTestDto } from '../dto/print-test.dto';
import { PrintTestUseCase } from '../application/print-test.use-case';

@Controller('printer')
export class PrinterController {
    constructor(private readonly printTestUseCase: PrintTestUseCase) { }

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
}