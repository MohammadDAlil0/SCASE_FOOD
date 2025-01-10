import { applyDecorators, Delete, Get, HttpCode, HttpStatus, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Role } from '../../core/constants/enums';
import { JwtGuard, RolesGuard, UserApi } from '../../core/guards';
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
      UseGuards(JwtGuard, RolesGuard),
      Roles(Role.ADMIN),
    );
}

export function ChangeStatusDecorator() {
  return applyDecorators(
    ApiOperation({ summary: "ChangeStatus To Order" }),
    ApiResponse({ status: 200, description: 'You will get a message' }),
    ApiBearerAuth(),
    UseGuards(JwtGuard, RolesGuard),
    Roles(Role.ADMIN, Role.USER),
  )
}

export function CraeteOderDecorator() {
  return applyDecorators(
    ApiOperation({ summary: "Create Order" }),
    ApiResponse({ status: 201, description: 'You will get the created order' }),
    ApiBearerAuth(),
    UseGuards(JwtGuard, RolesGuard),
    Roles(Role.ADMIN, Role.USER),
  )
}

export function SubmitOrderDecorator() {
  return applyDecorators(
      ApiOperation({ summary: 'Submit Order' }),
      ApiResponse({ status: HttpStatus.OK, description: 'You will get a message' }),
      ApiBearerAuth(),
      UseGuards(JwtGuard, RolesGuard),
      Roles(Role.ADMIN, Role.USER),
  )
}