import { Module } from '@nestjs/common';
import { RaidService } from './raid.service';
import { RaidController } from './raid.controller';
import { PlayerModule } from '../player/player.module';

@Module({
  controllers: [RaidController],
  providers: [RaidService],
  imports: [PlayerModule],
})
export class RaidModule {}
