import { Injectable } from '@nestjs/common';
import { CreateRaidCompletionDto } from './dto/create-raid-completion.dto';
import { UpdateRaidCompletionDto } from './dto/update-raid-completion.dto';

@Injectable()
export class RaidService {
  async create(createRaidDto: CreateRaidCompletionDto) {
    return 'This action adds a new raid';
  }

  findAll() {
    return `This action returns all raid`;
  }

  findOne(id: number) {
    return `This action returns a #${id} raid`;
  }

  update(id: number, updateRaidDto: UpdateRaidCompletionDto) {
    return `This action updates a #${id} raid`;
  }

  remove(id: number) {
    return `This action removes a #${id} raid`;
  }
}
