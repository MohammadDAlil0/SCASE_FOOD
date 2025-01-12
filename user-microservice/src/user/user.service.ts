import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import { ChangeRoleDto } from './dto/change-role.dto';
import { changeStatusDto } from './dto/contriubte.dto';
import { User } from 'src/models/user.model';
import { DataBaseService } from 'src/core/database/database.service';
import * as argon from 'argon2'; 
import { Role, Status, StatusOfOrder } from 'src/core/constants/enums';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from 'src/models/order.model';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User) private readonly UserModel: typeof User,
        @InjectModel(Order) private readonly OrderModel: typeof Order,
        @Inject('NATS_SERVICE') private readonly natsClient: ClientProxy,
        @Inject() private readonly jwt: JwtService,
        @Inject() private readonly config: ConfigService,
        @Inject() private readonly dataBaseService: DataBaseService
    ) {}

    async signup(createUserDto: CreateUserDto) {
        const user = await this.UserModel.create<User>({ ...createUserDto, hash: createUserDto.password });
        const access_token = await this.getToken(user.id, user.email);
        this.natsClient.emit({ cmd: 'createAdminsNotifications' }, {
          title: 'New User',
          desciption: 'A new user has been signup please accept his request or refuse him'
        });
        return {
          ...user.dataValues,
          access_token
        }
    }

    async login(loginDto: LoginDto) {
        const user: User = await this.dataBaseService.findOneOrThrow(this.UserModel, {
          where: {
            email: loginDto.email
          }
        });
        
        const userMathPassword = await argon.verify(user.hash, loginDto.password);
        
        if (!userMathPassword) {
          throw new BadRequestException('Invalid Password');
        }
        
        const access_token = await this.getToken(user.id, user.email); 
        return {
          ...user.dataValues,
          access_token
        }
    }

    async changeRole(dto: ChangeRoleDto) {
        const updatedUser: User = await this.dataBaseService.findByPkOrThrow(this.UserModel, dto.userId);

        updatedUser.role = dto.role;
        await updatedUser.save();
        
        this.natsClient.emit({ cmd: 'createNotification' }, {
          userId: updatedUser.id,
          title: 'Role Changed',
          desciption: 'Your role has been changed'
        });

        return updatedUser;
    }
    
    async getToken(userId: string, email: string): Promise<string> {
        const payload = {
          sub: userId,
          email
        }
        const token = await this.jwt.signAsync(payload, {
          expiresIn: this.config.getOrThrow<string>('JWT_EXPIRES_IN'),
          secret: this.config.getOrThrow<string>('JWT_SECRET')
        });
        return token;
    }

    async changeStatus(changeStatusDto: changeStatusDto) {
      const curUser: User = changeStatusDto.curUser;
      const getUser: User = await this.dataBaseService.findByPkOrThrow(this.UserModel, curUser.id);
      getUser.status = (getUser.status === Status.ONGOING ? Status.IDLE : Status.ONGOING);
      if (getUser.status === Status.ONGOING) {
        getUser.dataToCall = changeStatusDto.dateToCall || new Date(Date.now() + 20 * 60 * 1000);
      } else {
        const [numberOfEffectedRows] = await this.OrderModel.update<Order>({
          statusOfOrder: StatusOfOrder.DONE
        }, {
          where: {
            contributorId: getUser.id,
            numberOfContribution: getUser.numberOfContributions,
            statusOfOrder: StatusOfOrder.PAIED
          }
        });
        if (numberOfEffectedRows !== 0) { // Find at least one order to prevent fake contributions
          getUser.numberOfContributions++;
        }
      }
      await getUser.save()
      return getUser;
    }

    async createOrder(createOrderDto: CreateOrderDto) {
      // TOIMPROVE: You can find the contributor from the Guard and pass it to here which prevent deplicated search in the database
      const contributor: User = await this.dataBaseService.findByPkOrThrow(this.UserModel, createOrderDto.contributorId)
        
      return await this.OrderModel.create({
        ...createOrderDto,
        numberOfContributions: contributor.numberOfContributions
      });
    }

    async submitOrder(orderId: string) {
      const order: Order = await this.dataBaseService.findByPkOrThrow(this.OrderModel, orderId);
      const orderedFood = await this.natsClient.send({ cmd: 'getFoodOfOrder' }, orderId).toPromise();
      order.totalPrice = 0;
      orderedFood.forEach(element => {
        order.totalPrice += element.price;
      });
      order.statusOfOrder = StatusOfOrder.UNPAIED;
      await order.save();

      this.natsClient.emit({ cmd: 'createNotification' }, {
        userId: order.createdBy,
        title: 'Your Order Sumbmited Successfuly',
        desciption: "Say 'wait' to your stomack your order on the queue"
      });
      
      return {
        order
      };
    }

    async getAllActiveContributors() {
      const contributors = await this.UserModel.findAll<User>({
        where: {
          status: Status.ONGOING
        }
      });
      return contributors;
    }

    async changeStatusOfOrder(orderId: string) {
      const order: Order = await this.dataBaseService.findByPkOrThrow(this.OrderModel, orderId);
      order.statusOfOrder = (order.statusOfOrder === StatusOfOrder.PAIED ? StatusOfOrder.UNPAIED : StatusOfOrder.PAIED);
      await order.save();
      return order;
    }

    async getTopContributors() {
      const contributors = await this.UserModel.findAll({
        order: [ ['numberOfContributions', 'DESC'] ]
      });
      return contributors;
    }

    async getMyOrders(userId: string) {
      const orders = await this.OrderModel.findAll<Order>({
        where: {
          createdBy: userId,
        }
      });
      return orders;
    }
}