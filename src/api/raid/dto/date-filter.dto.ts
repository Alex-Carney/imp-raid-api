import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate } from 'class-validator';

export class DateFilterDto {
  @ApiProperty({
    description: 'Start date for filtering (in ISO 8601 format)',
    example: '2023-01-01T00:00:00.000Z',
    required: false,
  })
  @Type(() => Date)
  @IsDate({ message: 'startDate must be a valid date' })
  startDate?: Date;

  @ApiProperty({
    description: 'End date for filtering (in ISO 8601 format)',
    example: '2023-12-31T23:59:59.000Z',
    required: false,
  })
  @Type(() => Date)
  @IsDate({ message: 'endDate must be a valid date' })
  endDate?: Date;
}
