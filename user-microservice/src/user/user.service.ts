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
import { Status } from 'src/core/constants/enums';
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
      if (curUser.status === changeStatusDto.status) {
        throw new RpcException('You are already in this status');
      }
      const getUser: User = await this.dataBaseService.findByPkOrThrow(this.UserModel, curUser.id);
      getUser.status = changeStatusDto.status;
      if (changeStatusDto.status === 'ONGOING') {
        ++getUser.numberOfContributions;
        getUser.dataToCall = changeStatusDto.dateToCall;
      }
      await getUser.save()
      return getUser;
    }

    async createOrder(createOrderDto: CreateOrderDto) {
      const contributor: User = await this.dataBaseService.findByPkOrThrow(this.UserModel, createOrderDto.contributorId);

      return await this.OrderModel.create({
        ...createOrderDto,
        numberOfContributions: contributor.numberOfContributions
      });
    }

    async submitOrder(orderId: string) {
      const order = await this.dataBaseService.findByPkOrThrow(this.OrderModel, orderId);
      const orderedFood = await this.natsClient.send({ cmd: 'getFoodOfOrder' }, orderId);
      console.log(orderedFood);
      return 'success';
    }
}
