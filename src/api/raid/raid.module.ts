import { Module } from '@nestjs/common';
import { RaidService } from './raid.service';
import { RaidController } from './raid.controller';
import { PlayerModule } from '../player/player.module';
import { PlayerService } from '../player/player.service';

@Module({
  controllers: [RaidController],
  providers: [RaidService],
  imports: [PlayerModule],
  exports: [],
})
export class RaidModule {}
