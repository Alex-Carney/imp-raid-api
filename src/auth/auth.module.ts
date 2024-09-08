import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiKeyService } from './api-key.service';
import { AuthController } from './auth.controller';
import { ApiKeyGuard } from './api-key.guard';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService, ApiKeyService, ApiKeyGuard],
  exports: [ApiKeyGuard],
})
export class AuthModule {}
