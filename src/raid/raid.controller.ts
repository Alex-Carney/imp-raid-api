import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RaidService } from './raid.service';
import { CreateRaidCompletionDto } from './dto/create-raid-completion.dto';
import { UpdateRaidCompletionDto } from './dto/update-raid-completion.dto';
import { DateFilterDto } from './dto/date-filter.dto';
import { RaidCompletionByTypeDto } from './dto/raid-type-filter.dto';
import { RaidCompletionsByPlayerDto } from './dto/player-filter.dto';
import { ApiKeyGuard } from '../auth/api-key.guard';
import { Role } from '@prisma/client';

@ApiTags('Raid')
@Controller('raid')
@ApiBearerAuth()
@UseGuards(ApiKeyGuard)
@SetMetadata('role', Role.USER)
export class RaidController {
  constructor(private readonly raidService: RaidService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new raid completion' })
  @ApiBody({
    type: CreateRaidCompletionDto,
    description: 'Raid completion details',
  })
  @ApiResponse({
    status: 201,
    description: 'Raid completion created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createRaidDto: CreateRaidCompletionDto) {
    const { raidType, playerUsernames, completionTime } = createRaidDto;
    return this.raidService.create(raidType, playerUsernames, completionTime);
  }

  @Get('completions-by-type')
  @ApiOperation({
    summary: 'Get all raid completions by type with optional date filtering',
  })
  @ApiQuery({ name: 'raidType', description: 'The raid type to filter by' })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Start date for filtering (optional)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'End date for filtering (optional)',
  })
  @ApiResponse({ status: 200, description: 'List of raid completions by type' })
  async getRaidCompletionsByType(
    @Query() raidCompletionByTypeDto: RaidCompletionByTypeDto,
  ) {
    const { raidType, startDate, endDate } = raidCompletionByTypeDto;
    return this.raidService.getAllRaidCompletionsByType(
      raidType,
      startDate,
      endDate,
    );
  }

  @Get('most-recent')
  @ApiOperation({ summary: 'Get the most recent raid completion' })
  @ApiResponse({
    status: 200,
    description: 'Most recent raid completion retrieved successfully',
  })
  async getMostRecentRaidCompletion() {
    return this.raidService.getMostRecentRaidCompletion();
  }

  @Get('completions-between-dates')
  @ApiOperation({ summary: 'Get all raid completions between two dates' })
  @ApiQuery({ name: 'startDate', description: 'Start date for filtering' })
  @ApiQuery({ name: 'endDate', description: 'End date for filtering' })
  @ApiResponse({
    status: 200,
    description: 'Raid completions between dates retrieved successfully',
  })
  async getRaidCompletionsBetweenDates(@Query() dateFilterDto: DateFilterDto) {
    const { startDate, endDate } = dateFilterDto;
    return this.raidService.getRaidCompletionsBetweenDates(startDate, endDate);
  }

  @Get('top-players')
  @ApiOperation({
    summary: 'Get top players based on raid completions between two dates',
  })
  @ApiQuery({ name: 'startDate', description: 'Start date for filtering' })
  @ApiQuery({ name: 'endDate', description: 'End date for filtering' })
  @ApiResponse({
    status: 200,
    description: 'Top players based on raid completions retrieved successfully',
  })
  async getTopPlayersBetweenDates(@Query() dateFilterDto: DateFilterDto) {
    const { startDate, endDate } = dateFilterDto;
    return this.raidService.getTopPlayersBetweenDates(startDate, endDate);
  }

  @Get('completions-by-player')
  @ApiOperation({
    summary:
      'Get all raid completions by a specific player with optional date filtering',
  })
  @ApiQuery({ name: 'username', description: "Player's username" })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Start date for filtering (optional)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'End date for filtering (optional)',
  })
  @ApiResponse({
    status: 200,
    description: 'Raid completions by player retrieved successfully',
  })
  async getRaidCompletionsByPlayer(
    @Query() raidCompletionsByPlayerDto: RaidCompletionsByPlayerDto,
  ) {
    const { username, startDate, endDate } = raidCompletionsByPlayerDto;
    return this.raidService.getRaidCompletionsByPlayer(
      username,
      startDate,
      endDate,
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing raid completion' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the raid completion to update',
  })
  @ApiBody({
    type: UpdateRaidCompletionDto,
    description: 'Updated raid completion details',
  })
  @ApiResponse({
    status: 200,
    description: 'Raid completion updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Raid completion not found' })
  async update(
    @Param('id') id: string,
    @Body() updateRaidDto: UpdateRaidCompletionDto,
  ) {
    return this.raidService.update(+id, updateRaidDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a raid completion' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the raid completion to delete',
  })
  @ApiResponse({
    status: 200,
    description: 'Raid completion deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Raid completion not found' })
  async remove(@Param('id') id: string) {
    return this.raidService.remove(+id);
  }
}
