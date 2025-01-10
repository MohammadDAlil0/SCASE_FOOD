import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { LoginDto } from './dto/login.dto';
import { ChangeRoleDto } from './dto/change-role.dto';
import { changeStatusDto } from './dto/contriubte.dto';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('user')
export class UserController {
    constructor(
        @Inject() private readonly userService: UserService, 
    ) {}

    @MessagePattern({ cmd: 'signup' })
    async signup(@Payload() data: CreateUserDto) {
        return this.userService.signup(data);
    }

    @MessagePattern({ cmd: 'login' })
    async login(@Payload() loginDto: LoginDto) {
        return this.userService.login(loginDto); 
    }

    @MessagePattern({ cmd: 'changeRole' })
    async changeRole(@Payload() changeRoleDto: ChangeRoleDto) {
        return this.userService.changeRole(changeRoleDto);
    }

    @MessagePattern({ cmd: 'changeStatus' })
    async changeStatus(@Payload() changeStatusDto: changeStatusDto) {
        return this.userService.changeStatus(changeStatusDto);

    }

    @MessagePattern({ cmd: 'createOrder' })
    async createOrder(@Payload() createOrderDto: CreateOrderDto) {
        return this.userService.createOrder(createOrderDto);
    }

    @MessagePattern({ cmd: 'submitOrder' })
    submitOrder(@Payload() orderId: string) {
    return this.userService.submitOrder(orderId);
}
}
