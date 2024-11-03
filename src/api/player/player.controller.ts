import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PlayerService } from './player.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { ApiKeyGuard } from '../../auth/api-key.guard';
import { Role } from '@prisma/client';

@ApiTags('Player')
@ApiBearerAuth()
@UseGuards(ApiKeyGuard)
@SetMetadata('role', Role.USER)
@Controller('player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new player' })
  @ApiBody({
    type: CreatePlayerDto,
    description: 'The player details for creation',
  })
  @ApiResponse({ status: 201, description: 'Player successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() createPlayerDto: CreatePlayerDto) {
    return this.playerService.create(
      createPlayerDto.username,
      createPlayerDto.uuid,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all players' })
  @ApiResponse({ status: 200, description: 'List of all players.' })
  @ApiResponse({ status: 404, description: 'Players not found' })
  findAll() {
    return this.playerService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific player by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the player to retrieve' })
  @ApiResponse({ status: 200, description: 'Player found.' })
  @ApiResponse({ status: 404, description: 'Player not found' })
  findOne(@Param('id') id: string) {
    return this.playerService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a player by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the player to update' })
  @ApiBody({ type: UpdatePlayerDto, description: 'The updated player details' })
  @ApiResponse({ status: 200, description: 'Player successfully updated.' })
  @ApiResponse({ status: 404, description: 'Player not found' })
  update(@Param('id') id: string, @Body() updatePlayerDto: UpdatePlayerDto) {
    return this.playerService.update(
      +id,
      updatePlayerDto.username,
      updatePlayerDto.uuid,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a player by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the player to delete' })
  @ApiResponse({ status: 200, description: 'Player successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Player not found' })
  remove(@Param('id') id: string) {
    return this.playerService.remove(+id);
  }
}
