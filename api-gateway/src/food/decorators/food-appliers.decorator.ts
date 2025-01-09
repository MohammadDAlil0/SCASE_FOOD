import { applyDecorators, HttpCode, HttpStatus, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Role } from "src/constants/enums";
import { Roles } from "src/user/decorators/roles.decorator";
import { JwtGuard, RolesGuard } from "src/user/guards";

export function FoodGlobalDecorator() {
    return applyDecorators(
        ApiBearerAuth(),
        UseGuards(JwtGuard, RolesGuard),
        Roles(Role.ADMIN, Role.USER)
    )
}

export function CreateFoodDecorator() {
    return applyDecorators(
        ApiOperation({ summary: 'Create Food' }),
        ApiResponse({ status: HttpStatus.CREATED, description: 'You will the cerated food' }),
        Roles(Role.ADMIN)
    )
}

export function FindAllFoodDecorator() {
    return applyDecorators(
        ApiOperation({ summary: 'Get All Foods' }),
        ApiResponse({ status: HttpStatus.OK, description: 'You will get a list of foods' }),
    );
}

export function FindFoodDecorator() {
    return applyDecorators(
        ApiOperation({ summary: 'Get Food'}),
        ApiResponse({ status: HttpStatus.OK, description: 'You will get food' }),
    )
}

export function UpdateFoodDecorator() {
    return applyDecorators(
        ApiOperation({ summary: 'Update Food' }),
        ApiResponse({ status: HttpStatus.OK, description: 'You will the updated food' }),
        Roles(Role.ADMIN)
    )
}

export function DeleteFoodDecorator() {
    return applyDecorators(
        ApiOperation({ summary: 'Delete Food' }),
        ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'You will the deleted food' }),
        Roles(Role.ADMIN),
        HttpCode(HttpStatus.NO_CONTENT)
    )
}