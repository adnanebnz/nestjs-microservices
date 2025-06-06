import { Body, Controller, Post } from '@nestjs/common';
import { RiderService } from './rider.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RedisContext,
} from '@nestjs/microservices';
import { CreateRiderDTO } from './dto/create-rider.dto';
import { Rider } from './rider.entity';

@Controller('rider')
export class RiderController {
  constructor(private readonly riderService: RiderService) {}

  @MessagePattern({ cmd: 'create-rider' })
  create(
    @Payload()
    data: CreateRiderDTO,
    @Ctx()
    context: RedisContext,
  ): Promise<Rider> {
    console.log('data', data);
    return this.riderService.create(data);
  }

  @MessagePattern({ cmd: 'get-rider' })
  async getRiderById(
    @Payload()
    data: any,
    @Ctx()
    context: RedisContext,
  ) {
    return await this.riderService.findById(data.id);
  }
}
