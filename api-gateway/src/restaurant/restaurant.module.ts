import { Module } from '@nestjs/common';
import { RestaurantController } from './restaurant.controller';
import { NatsClientModule } from 'src/core/nats-client/nats-client.module';

@Module({
  imports: [NatsClientModule],
  controllers: [RestaurantController],
  providers: [],
})
export class RestaurantModule {}
