import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PoolsController } from './pools.controller';
import { PoolsService } from './pools.service';
import { PancakeSwapModule } from '@modules/pancakeSwap';
import { ChainsModule } from 'src/shared/modules/chains';
import { UniSwapModule } from '@modules/uniswap';
import { PoolsRepository } from './pools.repository';
import { PoolEntity, PoolSchema } from './pools.entity';
import { CetusModule } from '@modules/cetus';
import { RaydiumModule } from '@modules/raydium';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: PoolEntity.name, schema: PoolSchema }]),
    PancakeSwapModule,
    ChainsModule,
    UniSwapModule,
    CetusModule,
    RaydiumModule,
  ],
  controllers: [PoolsController],
  providers: [PoolsService, PoolsRepository],
  exports: [PoolsService],
})
export class PoolsModule {}
