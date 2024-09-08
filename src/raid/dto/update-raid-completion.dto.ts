import { PartialType } from '@nestjs/mapped-types';
import { CreateRaidCompletionDto } from './create-raid-completion.dto';

export class UpdateRaidCompletionDto extends PartialType(
  CreateRaidCompletionDto,
) {}
