import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantModule } from './tenant/tenant.module';
import { LoginModule } from './login/login.module';
import { AdminModule } from './admin/admin.module';
import { UserModule } from './user/user.module'; // Import the UserModule
import { CompetencyModule } from './competency/competency.module';
import { PracticeModule } from './practice/practice.module';
import { SkillModule } from './Skills/skills.module';
import { employeeSkillModule } from './employeeSkill/employeeSkill.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {competencySkillModule} from "./competencySkill/competencySkill.module"
import { ProjectModule } from './project/project.module';
import { FileModule } from './fileUpload/file.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "ep-green-breeze-a4fsyfx5-pooler.us-east-1.aws.neon.tech",
      port: 5432,
      username: "default",
      password: "QpkMKSP4mNe6",
      database: "verceldb",
      entities: [__dirname + '/../**/*.entity.{js,ts}'],
      synchronize: true,
    }),
    TenantModule,
    LoginModule,
    AdminModule,
    UserModule,
    CompetencyModule,
    PracticeModule, // Include the UserModule here
    SubscriptionModule,
    SkillModule,
    employeeSkillModule,
    competencySkillModule,
    FileModule,
    ProjectModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

