import { CanActivate, ExecutionContext, Injectable, BadRequestException, Inject, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Observable } from 'rxjs';
import { Order } from 'src/models/order.model';
import { DataBaseService } from '../database/database.service';
import { User } from 'src/models/user.model';
import { Status } from '../constants/enums';

@Injectable()
export class ContributorApi implements CanActivate {
  constructor(
    @InjectModel(Order) private readonly OrderModel: typeof Order,
    @Inject() private readonly dataBaseService: DataBaseService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const curUser = request.user;
    const orderId = request.params.orderId;

    const order: Order = await this.dataBaseService.findByPkOrThrow(this.OrderModel, orderId);

    if (curUser.id !== order.contributorId) {
      throw new BadRequestException("You can't do this action");
    }

    return true;
  }
}

@Injectable()
export class NotMeApi implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const curUser = request.user;
    const userId = request.params.userId;

    if (curUser.id === userId) {
      throw new BadRequestException("You can't do this action on yourself");
    }

    return true;
  }
}

@Injectable()
export class StillOnGoingGuard implements CanActivate {
  constructor(
    @InjectModel(User) private readonly UserModel: typeof User,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const contributorId = request.body.contributorId || request.params.contributorId;

    const contributor = await this.UserModel.findOne({
      where: {
        id: contributorId,
        status: Status.ONGOING
      }
    });
    
    if (!contributor) {
      throw new ForbiddenException('contributor has already ordered');
    }

    return true;
  }
}

@Injectable()
export class UserOrderGuard implements CanActivate {
  constructor(
    @InjectModel(Order) private readonly OrderModel: typeof Order,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const orderId = request.body.orderId || request.params.orderId;
    const curUserId = request.user.id;
    
    const order = await this.OrderModel.findOne({
      where: {
        id: orderId,
        createdBy: curUserId
      }
    });

    if (!order) {
      throw new ForbiddenException("You don't have such an order ID");
    }

    return true;
  }
}