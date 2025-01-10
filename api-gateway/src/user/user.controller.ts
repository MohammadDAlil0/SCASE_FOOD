import { BadRequestException, Body, Controller, Get, Inject, InternalServerErrorException, Param, Post, Put } from '@nestjs/common';
import { ChangeRoleDecorator, ChangeStatusDecorator, CraeteOderDecorator, LoginDecorators, SignupDecorators, SubmitOrderDecorator } from './decorators/user-appliers.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { LoginDto } from './dto/login.dto';
import { ChangeRoleDto } from './dto/change-role.dto';
import { ChangeStatusDto } from './dto/contriubte.dto';
import { GetUser } from './decorators/get-user.decortator';
import { User } from 'src/models/user.model';

@Controller('user')
export class UserController {
    constructor(
        @Inject('NATS_SERVICE') private readonly natsClient: ClientProxy,
    ) {}

    @Post('signup')
    @SignupDecorators()
    async signup(@Body() createUserDto: CreateUserDto) {
        try {
            return await this.natsClient.send({ cmd: 'signup' }, createUserDto).toPromise();   
        } catch(error) {
            return error;
        }
    }

    @Post('login')
    @LoginDecorators()
    async login(@Body() loginDto: LoginDto) {
        try {
            return await this.natsClient.send({ cmd: 'login' }, loginDto).toPromise();
        } catch(error) {
            return error;
        }
    }

    @Put('changeRole/:userId')
    @ChangeRoleDecorator()
    async changeRole(@Param('userId') userId: string, @Body() dto: ChangeRoleDto) {
        try {
            return await this.natsClient.send({ cmd: 'changeRole' }, {
                userId,
                ...dto
            }).toPromise();
        } catch (error) {
            return error;
        }
    }

    @Put('changeStatus')
    @ChangeStatusDecorator()
    async changeStatus(@GetUser() curUser: User, @Body() changeStatusDto: ChangeStatusDto) {
        try {
            return await this.natsClient.send({ cmd: 'changeStatus' }, {
                curUser,
                ...changeStatusDto
            }).toPromise();
        } catch(error) {
            return error;
        }
    }

    @Post('createOrder/:contributorId')
    @CraeteOderDecorator()
    async createOrder(@Param('contributorId') contributorId: string, @GetUser() curUser: User) {
        try {
            return await this.natsClient.send({ cmd: 'createOrder' }, {
                craetedBy: curUser.id,
                contributorId

            }).toPromise();
        } catch(error) {
            return error;
        }
    }

    @Put('submitOrder/:orderId')
    @SubmitOrderDecorator()
    async submitOrder(@Param('orderId') orderId: string) {
    try {
        return await this.natsClient.send({ cmd: 'submitOrder' }, orderId).toPromise();
    } catch(error) {
        return error;
    }
    }
}
