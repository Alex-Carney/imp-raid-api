import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { RaidService } from './raid.service';
import { CreateRaidCompletionDto } from './dto/create-raid-completion.dto';
import { UpdateRaidCompletionDto } from './dto/update-raid-completion.dto';
import { DateFilterDto } from './dto/date-filter.dto';
import { RaidCompletionByTypeDto } from './dto/raid-type-filter.dto';
import { RaidCompletionsByPlayerDto } from './dto/player-filter.dto';

@Controller('raid')
export class RaidController {
  constructor(private readonly raidService: RaidService) {}

  // Create a new raid completion
  @Post('create')
  async create(@Body() createRaidDto: CreateRaidCompletionDto) {
    const { raidType, playerUsernames, completionTime } = createRaidDto;
    return this.raidService.create(raidType, playerUsernames, completionTime);
  }

  // Get all raid completions by raid type with optional date filtering
  @Get('completions-by-type')
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

  // Get the most recent raid completion
  @Get('most-recent')
  async getMostRecentRaidCompletion() {
    return this.raidService.getMostRecentRaidCompletion();
  }

  // Get all raid completions between two dates (GET with query parameters)
  @Get('completions-between-dates')
  async getRaidCompletionsBetweenDates(@Query() dateFilterDto: DateFilterDto) {
    const { startDate, endDate } = dateFilterDto;
    return this.raidService.getRaidCompletionsBetweenDates(startDate, endDate);
  }

  // Get top players based on raid completions between two dates
  @Get('top-players')
  async getTopPlayersBetweenDates(@Query() dateFilterDto: DateFilterDto) {
    const { startDate, endDate } = dateFilterDto;
    return this.raidService.getTopPlayersBetweenDates(startDate, endDate);
  }

  // Get all raid completions by a specific player with optional date filtering
  @Get('completions-by-player')
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

  // Update an existing raid completion
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRaidDto: UpdateRaidCompletionDto,
  ) {
    return this.raidService.update(+id, updateRaidDto);
  }

  // Delete a raid completion
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.raidService.remove(+id);
  }
}
