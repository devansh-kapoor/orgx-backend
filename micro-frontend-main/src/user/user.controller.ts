import {
  Controller,
  Post,
  Body,
  Request,
  Get,
  Param,
  Put,
  Delete,
  Query,
  BadRequestException,
  ParseIntPipe,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

import { UserService } from './user.service';
import {
  CreateUserDto,
  FilterUsersByNameDto,
  FilterUsersByLocationDto,
  GetUserByIdDto,
  UpdateUserDto,
  DeleteUserDto,
  checkUsersByEmail,
} from './user.dto';
import { ApiTags } from '@nestjs/swagger';
import {
  createUserSwagger,
  filterUsersByNameSwagger,
  getAllUsersSwagger,
  getAllDesignationsSwagger,
  getUserByIdSwagger,
  updateUserSwagger,
  deleteUserSwagger,
  filterUsersByLocationSwagger,
  checkUsersByEmailSwagger,
} from './employee.swagger';

@Controller('employee')
@ApiTags('employee')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @createUserSwagger()
  async createUser(@Request() req, @Body() userData: any) {
    const tenantCode = req.headers.tenant_code;
    const createUserDto = plainToClass(CreateUserDto, userData);

    const errors = await validate(createUserDto);
    if (errors.length > 0) {
      const errorMessage = Object.values(errors[0].constraints).join(', ');
      throw new BadRequestException({ message: errorMessage });
    }
    return await this.userService.createUser(tenantCode, userData);
  }

  @Get('filterByName')
  @filterUsersByNameSwagger()
  async filterUsersByName(@Query('name') name: string, @Request() req) {
    const tenantCode = req.headers.tenant_code;
    const filterUsersByNameDto = plainToClass(FilterUsersByNameDto, { name });

    const errors = await validate(filterUsersByNameDto);
    if (errors.length > 0) {
      const errorMessage = Object.values(errors[0].constraints).join(', ');
      throw new BadRequestException({ message: errorMessage });
    }
    return await this.userService.filterUsersByName(tenantCode, name);
  }

  @Get('filterByLocation')
  @filterUsersByLocationSwagger()
  async filterUsersByLocation(
    @Query('location') location: string,
    @Request() req,
  ) {
    const tenantCode = req.headers.tenant_code;
    const filterUsersByLocationDto = plainToClass(FilterUsersByLocationDto, {
      location,
    });
    const errors = await validate(filterUsersByLocationDto);
    if (errors.length > 0) {
      const errorMessage = Object.values(errors[0].constraints).join(', ');
      throw new BadRequestException({ message: errorMessage });
    }
    return await this.userService.filterUsersByLocation(tenantCode, location);
  }

  @Get()
  @getAllUsersSwagger()
  async getAllUsers(@Request() req) {
    const tenantCode = req.headers.tenant_code;
    return await this.userService.getAllUsers(tenantCode);
  }

  @Get('designation')
  @getAllDesignationsSwagger()
  async getAllDesignations(@Request() req) {
    const tenantCode = req.headers.tenant_code;
    return await this.userService.getAllDesignations(tenantCode);
  }

  @Get(':id')
  @getUserByIdSwagger()
  async getUserById(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const tenantCode = req.headers.tenant_code;
    const getUserByIdDto = plainToClass(GetUserByIdDto, { id });

    const errors = await validate(getUserByIdDto);
    if (errors.length > 0) {
      const errorMessage = Object.values(errors[0].constraints).join(', ');
      throw new BadRequestException({ message: errorMessage });
    }

    return await this.userService.getUserById(id.toString(), tenantCode);
  }

  @Put(':id')
  @updateUserSwagger()
  async updateUser(
    @Param('id') id: string,
    @Body() userData: any,
    @Request() req,
  ) {
    const tenantCode = req.headers.tenant_code;
    const updateUserDto = plainToClass(UpdateUserDto, { id, ...userData });

    const errors = await validate(updateUserDto);
    if (errors.length > 0) {
      const errorMessage = Object.values(errors[0].constraints).join(', ');
      throw new BadRequestException({ message: errorMessage });
    }
    return await this.userService.updateUser(id, tenantCode, userData);
  }

  @Delete(':id')
  @deleteUserSwagger()
  async deleteUser(@Param('id') id: string, @Request() req) {
    const tenantCode = req.headers.tenant_code;
    const errors = await validate(DeleteUserDto);
    if (errors.length > 0) {
      const errorMessage = Object.values(errors[0].constraints).join(', ');
      throw new BadRequestException({ message: errorMessage });
    }
    return await this.userService.deleteUser(id, tenantCode);
  }

  @Get('email/check')
  @checkUsersByEmailSwagger()
  async checkUsersByEmail(@Query('email') email: string, @Request() req) {
    const tenantCode = req.headers.tenant_code;
    const errors = await validate(checkUsersByEmail);
    if (errors.length > 0) {
      const errorMessage = Object.values(errors[0].constraints).join(', ');
      throw new BadRequestException({ message: errorMessage });
    }
    return await this.userService.checkUsersByEmail(email, tenantCode);
  }
}
