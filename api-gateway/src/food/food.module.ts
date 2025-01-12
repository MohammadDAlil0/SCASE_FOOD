import { Module } from '@nestjs/common';
import { FoodController } from './food.controller';
import { NatsClientModule } from 'src/core/nats-client/nats-client.module';
import { Order } from 'src/models/order.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
    NatsClientModule,
    SequelizeModule.forFeature([Order])
  ],
  controllers: [FoodController],
  providers: [],
})
export class FoodModule {}
