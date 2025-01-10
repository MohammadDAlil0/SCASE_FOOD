import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './core/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { FoodModule } from './food/food.module';
import { RestaurantModule } from './restaurant/restaurant.module';

@Module({
  imports: [
    UserModule,
    DatabaseModule,
    ConfigModule.forRoot({ isGlobal: true }),
    FoodModule,
    RestaurantModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}