import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Notification } from 'src/models/notification.model';
import { CreateUsersNotificationsDto } from './dto/create-users-notifications.dto';
import { User } from 'src/models/user.model';
import { Role } from 'src/core/constants/enums';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification) private readonly NotificationModel: typeof Notification,
    @InjectModel(User) private readonly UserModel: typeof User
  ) {}
  async create(createNotificationDto: CreateNotificationDto) {
    await this.NotificationModel.create({
      ...createNotificationDto
    });
  }

  async findAll(userId: string) {
    return await this.NotificationModel.findAll({
      where: {
        userId
      }
    });
  }

  async createAdminsNotifications(createUsersNotificationsDto: CreateUsersNotificationsDto) {
    const adminsIds = await this.UserModel.findAll({
      where: {
        role: Role.ADMIN
      },
      attributes: ['id']
    });
    adminsIds.forEach(user => {
      this.create({
        userId: user.id,
        ...createUsersNotificationsDto
      })
    });
  }

  async createUsersNotifications(createUsersNotificationsDto: CreateUsersNotificationsDto) {
    const usersIds = await this.UserModel.findAll({
      where: {
        role: Role.USER
      }
    });
    usersIds.forEach(user => {
      this.create({
        userId: user.id,
        ...createUsersNotificationsDto
      })
    });
  }
}