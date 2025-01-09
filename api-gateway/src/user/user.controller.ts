import { BadRequestException, Body, Controller, Get, Inject, InternalServerErrorException, Param, Post, Put } from '@nestjs/common';
import { ChangeRoleDecorator, ContributeDecorator, LoginDecorators, SignupDecorators } from './decorators/user-appliers.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { LoginDto } from './dto/login.dto';
import { ChangeRoleDto } from './dto/change-role.dto';
import { ContributeDto } from './dto/contriubte.dto';
import { GetUser } from './decorators/get-user.decortator';
import { User } from 'src/models/user.model';

@Controller('user')
export class UserController {
    constructor(
        @Inject('NATS_SERVICE') private readonly natsClient: ClientProxy,
    ) {}

    @Post('signup')
    @SignupDecorators()
    signup(@Body() createUserDto: CreateUserDto) {
        try {
            return this.natsClient.send({ cmd: 'signup' }, createUserDto);   
        } catch(error) {
            return error;
        }
    }

    @Post('login')
    @LoginDecorators()
    login(@Body() loginDto: LoginDto) {
        try {
            return this.natsClient.send({ cmd: 'login' }, loginDto);
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

    @Post('contribute')
    @ContributeDecorator()
    async contribute(@GetUser() curUser: User, @Body() contributeDto: ContributeDto) {
        try {
            console.log(contributeDto);
            return await this.natsClient.send({ cmd: 'contributes' }, {
                contributorId: curUser.id,
                ...contributeDto
            }).toPromise();
        } catch(error) {
            return error;
        }
    }


}