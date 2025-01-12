import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { NatsClientModule } from 'src/core/nats-client/nats-client.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/models/user.model';
import { JWTStrategy } from '../core/stratgies/jwt.strategy';
import { Order } from 'src/models/order.model';
import { foodOrder } from 'src/models/food-order.model';
import { Food } from 'src/models/food.model';
import { Restaurant } from 'src/models/restaurant.model';

@Module({
  imports: [
    NatsClientModule,
    SequelizeModule.forFeature([User, Order, foodOrder, Food, Restaurant])
  ],
  controllers: [UserController],
  providers: [JWTStrategy]
})
export class UserModule {}
