import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RaidService } from './raid.service';
import { CreateRaidCompletionDto } from './dto/create-raid-completion.dto';
import { UpdateRaidCompletionDto } from './dto/update-raid-completion.dto';

@Controller('raid')
export class RaidController {
  constructor(private readonly raidService: RaidService) {}

  @Post()
  create(@Body() createRaidDto: CreateRaidCompletionDto) {
    return this.raidService.create(createRaidDto);
  }

  @Get()
  findAll() {
    return this.raidService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.raidService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRaidDto: UpdateRaidCompletionDto,
  ) {
    return this.raidService.update(+id, updateRaidDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.raidService.remove(+id);
  }
}
