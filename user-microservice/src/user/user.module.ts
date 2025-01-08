import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { NatsClientModule } from 'src/nats-client/nats-client.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/models/user.model';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        SequelizeModule.forFeature([User]),
        NatsClientModule,
        JwtModule.register({})
    ],
    controllers: [UserController],
    providers: [UserService]
})
export class UserModule {}
