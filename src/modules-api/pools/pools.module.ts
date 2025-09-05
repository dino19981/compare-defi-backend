import { Module } from '@nestjs/common';
import { PoolsController } from './pools.controller';
import { PoolsService } from './pools.service';
import { PancakeSwapModule } from '@modules/pancakeSwap';
import { ChainsModule } from 'src/shared/modules/chains';
import { UniSwapModule } from '@modules/uniswap';
import { PoolsRepository } from './pools.repository';
import { DatabaseModule } from '@modules/database';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PoolEntity } from './pools.entity';
import { CetusModule } from '@modules/cetus';
import { RaydiumModule } from '@modules/raydium';

@Module({
  imports: [
    TypeOrmModule.forFeature([PoolEntity]),
    DatabaseModule,
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
