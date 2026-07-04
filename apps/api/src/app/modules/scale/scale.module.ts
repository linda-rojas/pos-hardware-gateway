import { Module } from '@nestjs/common';
import { ListScalePortsUseCase } from './application/list-scale-ports.use-case';
import { ReadScaleUseCase } from './application/read-scale.use-case';
import { SerialScaleAdapter } from './infrastructure/serial-scale.adapter';
import { ScaleController } from './presentation/scale.controller';

@Module({
    controllers: [ScaleController],
    providers: [SerialScaleAdapter, ListScalePortsUseCase, ReadScaleUseCase],
    exports: [ReadScaleUseCase],
})
export class ScaleModule { }