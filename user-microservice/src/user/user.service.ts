import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/models/user.model';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import { DataBaseService } from 'src/database/database.service';
import * as argon from 'argon2';
import { ChangeRoleDto } from './dto/change-role.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User) private readonly UserModel: typeof User,
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
}
