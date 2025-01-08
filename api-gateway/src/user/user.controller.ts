import { Body, Controller, Get, Inject, Param, Post, Put } from '@nestjs/common';
import { ChangeRoleDecorator, LoginDecorators, SignupDecorators } from './decorators/user-appliers.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { ClientProxy } from '@nestjs/microservices';
import { LoginDto } from './dto/login.dto';
import { ChangeRoleDto } from './dto/change-role.dto';

@Controller('user')
export class UserController {
    constructor(
        @Inject('NATS_SERVICE') private readonly natsClient: ClientProxy,
    ) {}

    @Post('signup')
    @SignupDecorators()
    signup(@Body() createUserDto: CreateUserDto) { 
        return this.natsClient.send({ cmd: 'signup' }, createUserDto);   
    }

    @Post('login')
    @LoginDecorators()
    login(@Body() loginDto: LoginDto) {
        return this.natsClient.send({ cmd: 'login' }, loginDto);
    }

    @Put('changeRole/:userId')
    @ChangeRoleDecorator()
    changeRole(@Param('userId') userId: string, @Body() dto: ChangeRoleDto) {
        return this.natsClient.send({ cmd: 'changeRole '}, {
            userId,
            ...dto
        })
    }
}