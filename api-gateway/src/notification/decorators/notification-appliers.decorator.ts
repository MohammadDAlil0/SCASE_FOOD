import { applyDecorators, HttpCode, HttpStatus, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Role } from "src/core/constants/enums";
import { Roles } from "src/user/decorators/roles.decorator";
import { JwtGuard, RolesGuard } from "src/core/guards";

export function FindAllNotificationDecorator() {
    return applyDecorators(
        ApiOperation({ summary: 'Get All Notifications' }),
        ApiResponse({ status: HttpStatus.OK, description: 'You will get a list of notifications' }),
        ApiBearerAuth(),
        UseGuards(JwtGuard, RolesGuard),
        Roles(Role.ADMIN, Role.USER)
    );
}