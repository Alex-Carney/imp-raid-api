import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
import { DateFilterDto } from './date-filter.dto';

export class RaidCompletionsByPlayerDto extends DateFilterDto {
  @ApiProperty({
    description: 'Username of the player',
    example: 'Alex1',
  })
  @IsString()
  @IsNotEmpty({ message: 'Username cannot be empty' })
  username: string;
}
