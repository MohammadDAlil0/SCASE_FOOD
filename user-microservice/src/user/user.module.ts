import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/models/user.model';
import { JwtModule } from '@nestjs/jwt';
import { NatsClientModule } from 'src/core/nats-client/nats-client.module';
import { Order } from 'src/models/order.model';
import { foodOrder } from 'src/models/food-order.model';
import { Food } from 'src/models/food.model';
import { Restaurant } from 'src/models/restaurant.model';

@Module({
    imports: [
        SequelizeModule.forFeature([User, Order, foodOrder, Food, Restaurant]),
        NatsClientModule,
        JwtModule.register({})
    ],
    controllers: [UserController],
    providers: [UserService]
})
export class UserModule {}
