import { Injectable } from '@nestjs/common';
import { Context, SlashCommand, SlashCommandContext } from 'necord';
import { PlayerService } from '../api/player/player.service';
import { Player } from '@prisma/client';
import { IMPERIAL_SERVER_ID } from '../common/imperial.constants';

@Injectable()
export class AppCommand {
  constructor(private readonly playerService: PlayerService) {}

  @SlashCommand({
    name: 'ping',
    description: 'Ping command!',
    guilds: [IMPERIAL_SERVER_ID],
  })
  public async onPing(@Context() [interaction]: SlashCommandContext) {
    return interaction.reply({ content: 'Pong!' });
  }

  @SlashCommand({
    name: 'getall',
    description: 'Lets try dependency injection',
    guilds: [IMPERIAL_SERVER_ID],
  })
  public async onGetAll(@Context() [interaction]: SlashCommandContext) {
    const allPlayers: Player[] = await this.playerService.findAll();
    console.log(allPlayers);
    return interaction.reply({
      content: String(allPlayers),
    });
  }
}
