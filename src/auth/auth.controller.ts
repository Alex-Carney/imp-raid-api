import {
  Controller,
  Post,
  UseGuards,
  Body,
  SetMetadata,
  Logger,
} from '@nestjs/common';
import { ApiKeyGuard } from './api-key.guard';
import { AuthService } from './auth.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateApiKeyDto } from './dto/register-key.dto';
import { Role } from '@prisma/client';

@Controller('auth')
@ApiTags('Auth - Admin Only')
@ApiBearerAuth()
@UseGuards(ApiKeyGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  private readonly logger = new Logger(AuthController.name);

  @Post('generate-api-key')
  @SetMetadata('role', Role.ADMIN)
  @ApiOperation({ summary: 'Generate a new API key' })
  @ApiResponse({ status: 201, description: 'API key successfully generated' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - only admin can generate API keys',
  })
  @ApiBody({
    description: 'Information needed to generate an API key',
    type: CreateApiKeyDto,
  })
  async generateApiKey(@Body() { description }: CreateApiKeyDto) {
    this.logger.warn('Generating new API key');
    return this.authService.generateAndRegisterApiKey(description);
  }
}
