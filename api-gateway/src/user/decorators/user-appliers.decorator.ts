import { applyDecorators, Delete, Get, HttpCode, HttpStatus, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Role } from '../../constants/enums';
import { JwtGuard, RolesGuard, UserApi } from '../guards';
import { Roles } from './roles.decorator';

export function SignupDecorators() {
  return applyDecorators(
    ApiOperation({ summary: 'Signup A User' }),
    ApiResponse({ status: 201, description: 'You will get a user with an access-token' }),
  );
}

export function LoginDecorators() {
    return applyDecorators(
        ApiOperation({ summary: 'Login A User' }),
        ApiResponse({ status: 200, description: 'You will get a user with an access-token' }),
        HttpCode(200)
    );
}

export function ChangeRoleDecorator() {
    return applyDecorators(
        ApiOperation({ summary: "Change A User's Role" }),
        ApiResponse({ status: 200, description: 'You will get the updated user' }),
        ApiBearerAuth(),
        UseGuards(JwtGuard, RolesGuard, UserApi),
        Roles(Role.ADMIN),
    );
}

export function ContributeDecorator() {
  return applyDecorators(
    ApiOperation({ summary: "Contribute To Order" }),
    ApiResponse({ status: 200, description: 'You will get a message' }),
    ApiBearerAuth(),
    UseGuards(JwtGuard, RolesGuard, UserApi),
    Roles(Role.ADMIN, Role.USER),
  )
}