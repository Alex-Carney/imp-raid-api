import { Injectable } from '@nestjs/common';
import { ApiKeyService } from './api-key.service';
import { PrismaService } from 'nestjs-prisma';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly apiKeyService: ApiKeyService,
    private readonly prisma: PrismaService,
  ) {}

  async generateAndRegisterApiKey(description?: string): Promise<string> {
    const apiKeyPlaintext = await this.apiKeyService.createApiKey(description);
    const hashedApiKey = await this.apiKeyService.hashApiKey(apiKeyPlaintext);

    await this.prisma.apiKey.create({
      data: {
        keyHash: hashedApiKey,
        description,
        // New admin keys cannot be created via the API
        role: Role.USER,
      },
    });

    return apiKeyPlaintext;
  }
}
