import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TokensService } from './tokens.service';
import { TokensRepository } from './tokens.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenEntity, TokenSchema } from './token.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TokenEntity.name, schema: TokenSchema },
    ]),
    HttpModule,
  ],
  providers: [TokensService, TokensRepository],
  exports: [TokensService],
})
export class TokensModule {}
