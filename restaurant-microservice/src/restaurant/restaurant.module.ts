import { Module } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Restaurant } from 'src/models/restaurant.model';
import { NatsClientModule } from 'src/core/nats-client/nats-client.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Restaurant]),
    NatsClientModule,
  ],
  controllers: [RestaurantController],
  providers: [RestaurantService],
})
export class RestaurantModule {}
