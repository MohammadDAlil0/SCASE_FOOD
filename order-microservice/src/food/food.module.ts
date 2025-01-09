import { Module } from '@nestjs/common';
import { FoodService } from './food.service';
import { FoodController } from './food.controller';
import { NatsClientModule } from 'src/nats-client/nats-client.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Food } from 'src/models/food.model';
import { Restaurant } from 'src/models/restaurant.mode';

@Module({
  imports: [
    SequelizeModule.forFeature([Food, Restaurant]),
    NatsClientModule, 
  ],
  controllers: [FoodController],
  providers: [FoodService],
})
export class FoodModule {}
