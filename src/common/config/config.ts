import { Config } from './config.interface';

const config: Config = {
  cors: { enabled: true },
  swagger: {
    enabled: true,
    title: 'IMP Raid API',
    description: 'API Description',
    version: '1.0',
    path: 'api',
  },
  throttler: {
    ttl: 60000,
    limit: 10,
  },
  nest: {
    port: 3000,
  },
  helmet: {
    enabled: true,
  },
  discord: {
    enabled: true,
    discordToken: process.env.DISCORD_BOT_TOKEN || 'EXAMPLE_TOKEN',
  },
};

export default (): Config => config;
