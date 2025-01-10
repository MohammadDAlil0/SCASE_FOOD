import { Module } from '@nestjs/common';
import { FoodService } from './food.service';
import { FoodController } from './food.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Food } from 'src/models/food.model';
import { Restaurant } from 'src/models/restaurant.model';
import { foodOrder } from 'src/models/food-order.model';
import { NatsClientModule } from 'src/core/nats-client/nats-client.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Food, Restaurant, foodOrder]),
    NatsClientModule, 
  ],
  controllers: [FoodController],
  providers: [FoodService],
})
export class FoodModule {}
