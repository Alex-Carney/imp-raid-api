import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Player } from '@prisma/client';

@Injectable()
export class PlayerService {
  constructor(private readonly prisma: PrismaService) {}

  create(username: string, uuid?: string): Promise<Player> {
    return this.prisma.player.create({
      data: {
        username,
        uuid,
      },
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

  update(id: number, username: string, uuid?: string) {
    return this.prisma.player.update({
      where: {
        id,
      },
      data: { username, uuid },
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
