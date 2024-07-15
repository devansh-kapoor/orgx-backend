import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { Tenant } from '../tenant/tenant.entity';
import { Subscription } from './subscription.entity';
import { SubscriptionQueriesService } from './subscriptionQueries.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant, Subscription])],
  controllers: [SubscriptionController],
  providers: [SubscriptionService, SubscriptionQueriesService],
})
export class SubscriptionModule {}
