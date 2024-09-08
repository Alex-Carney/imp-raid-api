import { Injectable } from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class PlayerService {
  constructor(private readonly prisma: PrismaService) {}

  create(createPlayerDto: CreatePlayerDto) {
    return this.prisma.player.create({
      data: createPlayerDto,
    });
  }

  findAll() {
    return this.prisma.player.findMany();
  }

  findOne(id: number) {
    return this.prisma.player.findUnique({
      where: {
        id,
      },
    });
  }

  findFirstByUsername(username: string) {
    return this.prisma.player.findFirst({
      where: {
        username,
      },
    });
  }

  findUniqueByUUID(uuid: string) {
    return this.prisma.player.findUnique({
      where: {
        uuid,
      },
    });
  }

  update(id: number, updatePlayerDto: UpdatePlayerDto) {
    return this.prisma.player.update({
      where: {
        id,
      },
      data: updatePlayerDto,
    });
  }

  remove(id: number) {
    return this.prisma.player.delete({
      where: {
        id,
      },
    });
  }
}
