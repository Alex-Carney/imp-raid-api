import { PartialType } from '@nestjs/mapped-types';
import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RaidType } from '@prisma/client';
import { DateFilterDto } from './date-filter.dto'; // Import the RaidType enum

export class RaidCompletionByTypeDto extends PartialType(DateFilterDto) {
  @ApiProperty({
    description: 'Type of the raid',
    enum: RaidType,
    example: RaidType.NOL,
  })
  @IsEnum(RaidType, { message: 'raidType must be a valid enum value' })
  raidType: RaidType;
}
