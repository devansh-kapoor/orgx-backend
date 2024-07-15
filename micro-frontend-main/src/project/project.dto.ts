import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsNumber,
  IsArray,
  IsDate,
  IsDateString,
} from 'class-validator';
import { optional } from 'joi';

export class CreateProjectDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  timeline: string;

  @ApiProperty()
  @IsString()
  duration: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty()
  @IsDateString()
  start_date?: Date;

  @ApiProperty()
  @IsDateString()
  end_date?: Date;

  @ApiProperty()
  @IsNumber()
  project_manager: number;

  @ApiProperty()
  @IsNumber()
  team_lead: number;

  @ApiProperty()
  @IsArray()
  developer: Array<number>;
}

export class ProjectNameDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  competency_name: string;
}

export class UpdateProjectDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  timeline: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  duration: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  start_date?: Date;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  end_date?: Date;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  project_manager: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  team_lead: number;

  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  developer: Array<number>;
}

export class ProjectIdDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class DeleteProjectDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
