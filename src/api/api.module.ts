import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerConfig } from '../common/config/config.interface';
import { AuthModule } from '../auth/auth.module';
import { Module } from '@nestjs/common';
import { RaidModule } from './raid/raid.module';
import { PlayerModule } from './player/player.module';
import { APP_GUARD } from '@nestjs/core';
import { PlayerService } from './player/player.service';

@Module({
  imports: [
    // ThrottlerModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (config: ConfigService) => [
    //     {
    //       ttl: config.get<ThrottlerConfig>('throttler').ttl,
    //       limit: config.get<ThrottlerConfig>('throttler').limit,
    //     },
    //   ],
    // }),
    AuthModule,
    RaidModule,
    PlayerModule,
  ],
  // providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
  exports: [PlayerModule],
})
export class ApiModule {}
