import { Body, Controller, Get, Post } from '@nestjs/common';
import { ListScalePortsUseCase } from '../application/list-scale-ports.use-case';
import { ReadScaleUseCase } from '../application/read-scale.use-case';
import { ReadScaleDto } from '../dto/read-scale.dto';

@Controller('scale')
export class ScaleController {
    constructor(
        private readonly listScalePortsUseCase: ListScalePortsUseCase,
        private readonly readScaleUseCase: ReadScaleUseCase
    ) { }

    @Get('health')
    health() {
        return {
            success: true,
            module: 'scale',
            status: 'ok',
        };
    }

    @Get('ports')
    async ports() {
        const ports = await this.listScalePortsUseCase.execute();

        return {
            success: true,
            data: ports,
        };
    }

    @Post('read')
    async read(@Body() dto: ReadScaleDto) {
        const reading = await this.readScaleUseCase.execute(dto);

        return {
            success: true,
            message: 'Scale weight read successfully',
            data: reading,
        };
    }
}