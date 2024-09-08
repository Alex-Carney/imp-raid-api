import { RaidType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateRaidCompletionDto {
  @ApiProperty({
    description: 'The type of the raid',
    enum: RaidType,
    example: RaidType.NOL,
    required: true,
  })
  @IsEnum(RaidType, {
    message: `raidType must be a valid enum value: ${Object.keys(RaidType).join(', ')}`,
  })
  @IsNotEmpty()
  raidType: RaidType;

  @ApiProperty({
    description:
      'List of players participating in the raid. Must be an array of 4 non-empty strings.',
    example: ['Alex1', 'AscendedKitten', 'Onboo', 'sandrra'],
  })
  @IsArray({ message: 'players must be an array' })
  @ArrayMinSize(4, { message: 'players array must contain exactly 4 players' })
  @ArrayMaxSize(4, { message: 'players array must contain exactly 4 players' })
  @IsString({ each: true, message: 'Each player must be a string' })
  @IsNotEmpty({ each: true, message: 'Player name cannot be empty' })
  players: string[];

  @ApiProperty({
    description:
      'Completion time of the raid in ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ). If omitted, the database will use the ' +
      'current time as the completion time.',
    example: '2023-09-07T14:30:00Z',
    required: false,
  })
  @IsDateString(
    {},
    { message: 'completionTime must be a valid ISO 8601 datetime string' },
  )
  completionTime?: string;
}
