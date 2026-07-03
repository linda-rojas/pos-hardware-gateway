import { Body, Controller, Get, Post } from '@nestjs/common';
import { OpenCashDrawerUseCase } from '../application/open-cash-drawer.use-case';
import { OpenCashDrawerDto } from '../dto/open-cash-drawer.dto';

@Controller('cash-drawer')
export class CashDrawerController {
    constructor(private readonly openCashDrawerUseCase: OpenCashDrawerUseCase) { }

    @Get('health')
    health() {
        return {
            success: true,
            module: 'cash-drawer',
            status: 'ok',
        };
    }

    @Post('open')
    async open(@Body() dto: OpenCashDrawerDto) {
        const result = await this.openCashDrawerUseCase.execute(dto);

        return {
            success: true,
            message: 'Cash drawer open command sent successfully',
            data: result,
        };
    }
}