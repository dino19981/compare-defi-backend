import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsString, IsUrl, ValidateNested } from 'class-validator';
import { MetaDto } from 'src/shared/dtos/meta.dto';

export class PoolMetaTokenDto {
  @ApiProperty({ description: 'Название токена' })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Урл картинки токена',
    example: 'https://example.com/token.png',
  })
  @IsUrl()
  icon: string;
}

export class PoolMetaDto extends MetaDto {
  @ApiProperty({
    description: 'токены',
    type: [PoolMetaTokenDto],
  })
  @IsArray()
  @ValidateNested()
  @Type(() => PoolMetaTokenDto)
  tokens: PoolMetaTokenDto[];
}
