import { Module } from '@nestjs/common';
import { NecordModule } from 'necord';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DiscordConfig } from '../common/config/config.interface';
import { IntentsBitField } from 'discord.js';
import { AppCommand } from './app.command';
import { ApiModule } from '../api/api.module';

@Module({
  imports: [
    NecordModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        token: configService.get<DiscordConfig>('discord').discordToken,
        intents: [
          IntentsBitField.Flags.Guilds,
          IntentsBitField.Flags.GuildMessages,
        ],
      }),
      inject: [ConfigService],
    }),
    ApiModule,
  ],
  providers: [AppCommand],
})
export class DiscordModule {}
