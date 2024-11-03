import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Player, RaidType } from '@prisma/client';
import { PlayerService } from '../player/player.service';
import { UpdateRaidCompletionDto } from './dto/update-raid-completion.dto';

@Injectable()
export class RaidService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly playerService: PlayerService,
  ) {}

  async create(
    raidType: RaidType,
    playerUsernames: string[],
    completionTime: Date,
  ) {
    return this.prisma.$transaction(async (prisma) => {
      const playerParticipants: Player[] = await Promise.all(
        playerUsernames.map(async (username: string) => {
          const player = await prisma.player.findFirst({
            where: { username },
          });

          if (!player) {
            return this.playerService.create(username);
          }

          return player;
        }),
      );

      const raidCompletion = await prisma.raidCompletion.create({
        data: {
          raidType: raidType,
          completionTime: completionTime,
        },
      });

      await Promise.all(
        playerParticipants.map(async (player) => {
          return prisma.raidParticipant.create({
            data: {
              playerId: player.id,
              raidCompletionId: raidCompletion.id,
            },
          });
        }),
      );

      return prisma.raidCompletion.findUnique({
        where: { id: raidCompletion.id },
        include: { raidParticipants: true },
      });
    });
  }

  async getAllRaidCompletionsByType(
    raidType: RaidType,
    startDate?: Date,
    endDate?: Date,
  ) {
    const whereClause: any = { raidType };

    if (startDate || endDate) {
      whereClause.completionTime = {};
      if (startDate) {
        whereClause.completionTime.gte = startDate;
      }
      if (endDate) {
        whereClause.completionTime.lte = endDate;
      }
    }

    return this.prisma.raidCompletion.findMany({
      where: whereClause,
      include: { raidParticipants: true },
    });
  }

  async getMostRecentRaidCompletion() {
    return this.prisma.raidCompletion.findFirst({
      orderBy: {
        completionTime: 'desc',
      },
      include: { raidParticipants: true },
    });
  }

  async getRaidCompletionsBetweenDates(startDate?: Date, endDate?: Date) {
    const whereClause: any = {};

    if (startDate || endDate) {
      whereClause.completionTime = {};
      if (startDate) {
        whereClause.completionTime.gte = startDate;
      }
      if (endDate) {
        whereClause.completionTime.lte = endDate;
      }
    }

    return this.prisma.raidCompletion.findMany({
      where: whereClause,
      include: { raidParticipants: true },
    });
  }

  async getTopPlayersBetweenDates(startDate?: Date, endDate?: Date) {
    const whereClause: any = {};

    if (startDate || endDate) {
      whereClause.raidCompletion = { completionTime: {} };
      if (startDate) {
        whereClause.raidCompletion.completionTime.gte = startDate;
      }
      if (endDate) {
        whereClause.raidCompletion.completionTime.lte = endDate;
      }
    }

    const playersWithRaidCounts = await this.prisma.raidParticipant.groupBy({
      by: ['playerId'],
      _count: {
        playerId: true,
      },
      where: whereClause,
      orderBy: {
        _count: {
          playerId: 'desc',
        },
      },
      take: 10,
    });

    return Promise.all(
      playersWithRaidCounts.map(async (playerCount) => {
        const player = await this.prisma.player.findUnique({
          where: { id: playerCount.playerId },
          select: {
            id: true,
            username: true,
          },
        });

        return {
          ...player,
          raidCompletions: playerCount._count.playerId,
        };
      }),
    );
  }

  async getRaidCompletionsByPlayer(
    username: string,
    startDate?: Date,
    endDate?: Date,
  ) {
    const player = await this.prisma.player.findFirst({
      where: { username },
    });

    if (!player) {
      throw new Error(`Player with username "${username}" not found`);
    }

    const whereClause: any = {
      raidParticipants: { some: { playerId: player.id } },
    };

    if (startDate || endDate) {
      whereClause.completionTime = {};
      if (startDate) {
        whereClause.completionTime.gte = startDate;
      }
      if (endDate) {
        whereClause.completionTime.lte = endDate;
      }
    }

    return this.prisma.raidCompletion.findMany({
      where: whereClause,
      include: { raidParticipants: true },
    });
  }

  async update(id: number, updateRaidDto: UpdateRaidCompletionDto) {
    return this.prisma.raidCompletion.update({
      where: { id },
      data: updateRaidDto,
    });
  }

  async remove(id: number) {
    return this.prisma.raidCompletion.delete({
      where: { id },
    });
  }
}
