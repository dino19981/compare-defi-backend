import { Module } from '@nestjs/common';
import { LandingsController } from './lendings.controller';
import { LandingsService } from './lendings.service';
import { LandingsRepository } from './lendings.repository';
import { DatabaseModule } from '@modules/database';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PoolEntity } from './lendings.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PoolEntity]), DatabaseModule],
  controllers: [LandingsController],
  providers: [LandingsService, LandingsRepository],
  exports: [LandingsService],
})
export class LandingsModule {}
