import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { NatsClientModule } from 'src/nats-client/nats-client.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/models/user.model';
import { JWTStrategy } from './stratgies/jwt.strategy';

@Module({
  imports: [
    NatsClientModule,
    SequelizeModule.forFeature([User])
  ],
  controllers: [UserController],
  providers: [JWTStrategy]
})
export class UserModule {}
