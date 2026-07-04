import { Injectable } from '@nestjs/common';
import { ReadScaleDto } from '../dto/read-scale.dto';
import { SerialScaleAdapter } from '../infrastructure/serial-scale.adapter';

@Injectable()
export class ReadScaleUseCase {
    constructor(private readonly serialScaleAdapter: SerialScaleAdapter) { }

    async execute(dto: ReadScaleDto) {
        const reading = await this.serialScaleAdapter.readWeight(
            dto.port,
            dto.baudRate || 9600,
            dto.timeoutMs || 2500
        );

        return {
            ...reading,
            grams: Math.round(reading.value * 1000),
        };
    }
}