import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { LoginDto } from './dto/login.dto';
import { ChangeRoleDto } from './dto/change-role.dto';

@Controller('user')
export class UserController {
    constructor(
        @Inject() private readonly userService: UserService, 
    ) {}

    @MessagePattern({ cmd: 'signup' })
    signup(@Payload() data: CreateUserDto) {
        return this.userService.signup(data);
    }

    @MessagePattern({ cmd: 'login' })
    login(@Payload() loginDto: LoginDto) {
        return this.userService.login(loginDto); 
    }

    // TODO: TESTING this one
    @MessagePattern({ cmd: 'changeRole'})
    changeRole(@Payload() changeRoleDto: ChangeRoleDto) {
        return this.userService.changeRole(changeRoleDto);
    }
}
