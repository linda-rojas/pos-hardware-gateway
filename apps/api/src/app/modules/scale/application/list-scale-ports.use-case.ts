import { Injectable } from '@nestjs/common';
import { SerialScaleAdapter } from '../infrastructure/serial-scale.adapter';

@Injectable()
export class ListScalePortsUseCase {
    constructor(private readonly serialScaleAdapter: SerialScaleAdapter) { }

    async execute() {
        const ports = await this.serialScaleAdapter.listPorts();

        return ports.map((port) => ({
            path: port.path,
            manufacturer: port.manufacturer,
            serialNumber: port.serialNumber,
            vendorId: port.vendorId,
            productId: port.productId,
        }));
    }
}