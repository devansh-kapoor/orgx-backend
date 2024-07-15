import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import {
  createSubscriptionSwagger,
  subscriptionByIdSwagger,
  updateSubscriptionSwagger,
  deleteSubscriptionSwagger,
  getSubscriptionSwagger,
  subscriptionNameSwagger,
} from './subscription.swagger';
import {
  CreatePlanDto,
  GetSubscriptionByIdDto,
  UpdateSubscriptionDto,
  DeleteSubscriptionDto,
  SubscriptionNameDto,
} from './subscription.dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { ApiTags } from '@nestjs/swagger';

@Controller('subscription')
@ApiTags('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  @createSubscriptionSwagger()
  async createSubscription(@Body() createPlanDto: CreatePlanDto) {
    const createPlan = plainToClass(CreatePlanDto, createPlanDto);

    const errors = await validate(createPlan);
    if (errors.length > 0) {
      const errorMessage = Object.values(errors[0].constraints).join(', ');
      throw new BadRequestException({ message: errorMessage });
    }
    return await this.subscriptionService.createSubscription(createPlanDto);
  }

  @Get()
  @getSubscriptionSwagger()
  async getSubscriptions() {
    return await this.subscriptionService.getSubscriptions();
  }

  @Post('planName')
  @subscriptionNameSwagger()
  async subscriptionName(@Body() subscriptionNameDto: SubscriptionNameDto) {
    const subscriptionName = plainToClass(
      SubscriptionNameDto,
      subscriptionNameDto,
    );

    const errors = await validate(subscriptionName);
    if (errors.length > 0) {
      const errorMessage = Object.values(errors[0].constraints).join(', ');
      throw new BadRequestException({ message: errorMessage });
    }

    return await this.subscriptionService.subscriptionName(
      subscriptionNameDto.planName,
    );
  }

  @Get(':id')
  @subscriptionByIdSwagger()
  async getSubscriptionById(@Param('id', ParseIntPipe) id: number) {
    const getSubscriptionById = plainToClass(
      GetSubscriptionByIdDto,
      GetSubscriptionByIdDto,
    );
    const errors = await validate(getSubscriptionById);
    if (errors.length > 0) {
      const errorMessage = Object.values(errors[0].constraints).join(', ');
      throw new BadRequestException({ message: errorMessage });
    }
    return await this.subscriptionService.getSubscriptionById(id);
  }

  @Put(':id')
  @updateSubscriptionSwagger()
  async updateSubscription(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: UpdateSubscriptionDto,
  ) {
    const updateSubscription = plainToClass(UpdateSubscriptionDto, updateData);

    const errors = await validate(updateSubscription);
    if (errors.length > 0) {
      const errorMessage = Object.values(errors[0].constraints).join(', ');
      throw new BadRequestException({ message: errorMessage });
    }

    return await this.subscriptionService.updateSubscription(id, updateData);
  }

  @Delete(':id')
  @deleteSubscriptionSwagger()
  async deleteSubscription(@Param('id', ParseIntPipe) id: number) {
    const deleteSubscription = plainToClass(DeleteSubscriptionDto, { id });

    const errors = await validate(deleteSubscription);
    if (errors.length > 0) {
      const errorMessage = Object.values(errors[0].constraints).join(', ');
      throw new BadRequestException({ message: errorMessage });
    }
    return await this.subscriptionService.deleteSubscription(id);
  }
}
