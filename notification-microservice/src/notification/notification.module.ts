import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Notification } from 'src/models/notification.model';
import { User } from 'src/models/user.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Notification, User])
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
