import { Module } from '@nestjs/common';
import { RaidService } from './raid.service';
import { RaidController } from './raid.controller';

@Module({
  controllers: [RaidController],
  providers: [RaidService],
})
export class RaidModule {}
