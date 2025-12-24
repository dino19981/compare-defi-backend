import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PoolsController } from './pools.controller';
import { PoolsService } from './pools.service';
import { PancakeSwapModule } from '@modules/pancakeSwap';
import { ChainsModule } from 'src/shared/modules/chains';
import { UniSwapModule } from '@modules/uniswap';
import { PoolsMetaRepository, PoolsRepository } from './repositories';
import {
  PoolEntity,
  PoolsMetaEntity,
  PoolsMetaSchema,
  PoolSchema,
} from './entities';
import { CetusModule } from '@modules/cetus';
import { RaydiumModule } from '@modules/raydium';
import { TokensModule } from '@shared-modules/tokens';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: PoolEntity.name, schema: PoolSchema }]),
    MongooseModule.forFeature([
      { name: PoolsMetaEntity.name, schema: PoolsMetaSchema },
    ]),
    ChainsModule,
    TokensModule,
    PancakeSwapModule,
    UniSwapModule,
    CetusModule,
    RaydiumModule,
  ],
  controllers: [PoolsController],
  providers: [PoolsService, PoolsRepository, PoolsMetaRepository],
  exports: [PoolsService],
})
export class PoolsModule {}
