import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { NatsClientModule } from 'src/nats-client/nats-client.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/models/user.model';
import { JwtModule } from '@nestjs/jwt';
import { Contributor } from 'src/models/contributor.model';

@Module({
    imports: [
        SequelizeModule.forFeature([User, Contributor]),
        NatsClientModule,
        JwtModule.register({})
    ],
    controllers: [UserController],
    providers: [UserService]
})
export class UserModule {}
