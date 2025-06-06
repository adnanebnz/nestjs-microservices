import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

@Injectable()
export class ApiGatewayService {
  createRiderCoordinates(coordinates: any) {
    throw new Error('Method not implemented.');
  }
  private riderService: ClientProxy;
  private riderCoordinatesService: ClientProxy;

  constructor() {
    this.riderService = ClientProxyFactory.create({
      transport: Transport.REDIS,
      options: {
        host: 'localhost',
        port: 6379,
      },
    });
    this.riderCoordinatesService = ClientProxyFactory.create({
      transport: Transport.REDIS,
      options: {
        host: 'localhost',
        port: 6379,
      },
    });
  }

  getRider(payload: any) {
    console.log('called rider microservice get-rider');
    return this.riderService.send(
      { cmd: 'get-rider' },
      { id: parseInt(payload.id, 10) },
    );
  }
  createRider(rider: any) {
    return this.riderService.send({ cmd: 'create-rider' }, rider);
  }
  /**
   * RIDER COORDINATES
   */
  createRiderCoordinate(rider: any) {
    return this.riderCoordinatesService.send(
      { cmd: 'saveRiderCoordinates' },
      rider,
    );
  }

  getRiderCoordinates(id: number) {
    return this.riderCoordinatesService.send(
      { cmd: 'getRiderCoordinates' },
      { id },
    );
  }
}
