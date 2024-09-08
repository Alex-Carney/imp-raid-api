import { Injectable } from '@nestjs/common';
import { hash, compare } from 'bcrypt';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class ApiKeyService {
  constructor(private prisma: PrismaService) {}

  async hashApiKey(apiKey: string): Promise<string> {
    const saltRounds = 10; // You can configure this dynamically as you did with passwords
    return hash(apiKey, saltRounds);
  }

  async validateApiKey(apiKey: string, storedHash: string): Promise<boolean> {
    return compare(apiKey, storedHash);
  }

  async createApiKey(description?: string): Promise<string> {
    const apiKey = this.generateRandomApiKey();
    const hashedKey = await this.hashApiKey(apiKey);

    await this.prisma.apiKey.create({
      data: {
        keyHash: hashedKey,
        description,
      },
    });

    return apiKey;
  }

  private generateRandomApiKey(): string {
    return require('crypto').randomBytes(32).toString('hex');
  }
}
