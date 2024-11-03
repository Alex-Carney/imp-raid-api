import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePlayerDto {
  @ApiProperty({
    description: 'The username of the player',
    example: 'Alex1',
    required: true,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  username: string = '';

  @ApiProperty({
    description: 'The players MC UUID, can be retrieved from namemc',
    example: '0a6ba3c7-d0ec-415e-a3fc-7c664528efe1',
    required: false,
    type: String,
  })
  @IsString()
  uuid?: string = '';
}
