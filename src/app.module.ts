import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlayerModule } from './api/player/player.module';
import { RaidModule } from './api/raid/raid.module';
import { loggingMiddleware, PrismaModule } from 'nestjs-prisma';
import { AuthModule } from './auth/auth.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './common/config/config';
import {
  DiscordConfig,
  ThrottlerConfig,
} from './common/config/config.interface';
import { APP_GUARD } from '@nestjs/core';
import { NecordModule } from 'necord';
import { IntentsBitField } from 'discord.js';
import { DiscordModule } from './discord/discord.module';
import { ApiModule } from './api/api.module';

@Module({
  imports: [
    PlayerModule,
    RaidModule,
    AuthModule,
    DiscordModule,
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    ApiModule,
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        middlewares: [
          loggingMiddleware({
            logger: new Logger('PrismaMiddleware'),
            logLevel: 'log',
          }),
        ],
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
