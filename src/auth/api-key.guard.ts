import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { PrismaService } from 'nestjs-prisma';
import { ApiKey, Role } from '@prisma/client';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = this.extractApiKey(request);
    const requiredRole = this.getRequiredRole(context);

    if (!apiKey) {
      throw new UnauthorizedException('API key is missing');
    }

    // Fetch the API key record from the database by matching the hashed API key
    const apiKeyRecord: ApiKey = await this.prisma.apiKey.findFirst({
      where: {
        keyHash: await this.hashApiKey(apiKey),
      },
    });

    if (
      !apiKeyRecord ||
      !(await this.validateApiKey(apiKey, apiKeyRecord.keyHash))
    ) {
      throw new UnauthorizedException('Invalid API key');
    }

    if (requiredRole === Role.ADMIN && apiKeyRecord.role !== Role.ADMIN) {
      throw new UnauthorizedException('Admin privileges required');
    }

    return true;
  }

  private extractApiKey(request: any): string | null {
    const authorizationHeader = request.headers['authorization'];
    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
      return authorizationHeader.split(' ')[1];
    }
    return null;
  }

  private async validateApiKey(
    apiKey: string,
    storedHash: string,
  ): Promise<boolean> {
    return compare(apiKey, storedHash);
  }

  private async hashApiKey(apiKey: string): Promise<string> {
    return hash(apiKey, 10);
  }

  private getRequiredRole(context: ExecutionContext): Role {
    const handler = context.getHandler();
    const role: Role = Reflect.getMetadata('role', handler);
    if (!role) {
      throw new Error('DEV ERROR: Role metadata is not defined');
    }
    return role;
  }
}
