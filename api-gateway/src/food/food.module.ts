import { Module } from '@nestjs/common';
import { FoodController } from './food.controller';
import { NatsClientModule } from 'src/core/nats-client/nats-client.module';

@Module({
  imports: [NatsClientModule],
  controllers: [FoodController],
  providers: [],
})
export class FoodModule {}
