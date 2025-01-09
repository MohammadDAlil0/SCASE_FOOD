import { Module } from '@nestjs/common';
import { RestaurantModule } from './restaurant/restaurant.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RestaurantModule, 
    DatabaseModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
