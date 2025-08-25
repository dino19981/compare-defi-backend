import { IsOptional, IsString } from 'class-validator';
import { PoolPlatform } from '../types';

export class PoolItemPlatformDto {
  @IsString()
  name: PoolPlatform;

  @IsString()
  link: string;

  @IsOptional()
  @IsString()
  refLink: string;
}
