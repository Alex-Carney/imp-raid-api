import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class CreateApiKeyDto {
  @ApiProperty({
    description:
      'Optional description of the API key (e.g., who or what it’s for)',
    example: 'API key for third-party integration',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 255, {
    message: 'Description must be between 0 and 255 characters',
  })
  description?: string;
}
